"use strict";

var tools = {}

tools.exec = require('child_process').exec
tools.http = require('http');
tools.url = require('url');

// from npm
tools.connect = require('connect');
tools.del = require('del')
tools.gitRev = require('git-rev')
var gulp = require('gulp')
tools.concat = require('gulp-concat')
tools.rename = require('gulp-rename')
tools.replace = require('gulp-replace')
tools.sourcemaps = require('gulp-sourcemaps');
tools.minimist = require('minimist')
tools.open = require('open');
tools.proxy = require('proxy-middleware');
tools.serveIndex = require('serve-index');
tools.serveStatic = require('serve-static');


tools.browserify = require('browserify');
tools.source = require('vinyl-source-stream');
tools.tsify = require('tsify');
tools.buffer = require('vinyl-buffer');


var config = {
  appProtocol: 'http',
  appHostname: 'localhost',
  appPort: 9000,
  proxyProtocol: 'http',
  proxyHostname: 'localhost',
  proxyPort: 8080,
  buildDir: './build',
  distDir: __dirname + '/dist',
  srcDir: './src',
  buildTarget: 'dev'

}
config.appHost = config.appProtocol + '://' + config.appHostname + ':' + config.appPort
config.proxyHost = config.proxyProtocol + '://' + config.proxyHostname + ':' + config.proxyPort
config.paths = {
  pages: [config.srcDir + '/*.html']
};


var minimistCliOpts = {
  string: ['open', 'env'],
  alias: {
    'open': ['o']
  },
  default: {
    open: false,
    env: process.env.NODE_ENV || 'dev'
  }
};
config.args = tools.minimist(process.argv.slice(2), minimistCliOpts)

if (config.args.env) {
  if (config.args.env.startsWith('prod')) {
    config.buildTarget = 'prod'
  } else {
    config.buildTarget = 'dev'
  }
}

var project = {
  server: null,
  clean: function (cb) {
    console.log("Starting 'Clean'")
    tools.del.sync([config.distDir, config.buildDir, './gh_pages'])
    console.log("Finished 'Clean'")
    cb()
  },

  copyNpm: function (cb) {

    var libs =
    {
      'seedrandom/': [
        {dev: 'seedrandom.js', prod: 'seedrandom.min.js', out: 'seedrandom.js'}
      ],
      'es6-shim/': [
        {dev: 'es6-shim.js', prod: 'es6-shim.min.js', out: 'es6-shim.js'}
      ],
      'systemjs/dist/': [
        {dev: 'system.src.js', prod: 'system.js', out: 'system.js'},
        {dev: 'system.js.map', prod: null, out: 'system.js.map'},
        {dev: 'system-polyfills.src.js', prod: 'system-polyfills.js', out: 'system-polyfills.js'},
        {dev: 'system-polyfills.js.map', prod: null, out: 'system-polyfills.js.map'}
      ]
    }

    var baseOutPath = config.buildDir + '/thirdparty/'
    var libKeys = Object.keys(libs)


    var count = 0
    libKeys.forEach(function (basePath) {
      var lib = libs[basePath]
      lib.forEach(function (libFile) {
        // build target is either dev or prod; we're counting the number of file copy promises we'll need to wait for.
        if ((libFile[config.buildTarget] != null) || (libFile['all'] != null)) {
          count++
        }
      })
    })
    var done = project.callbackOnCount(count, cb)

    libKeys.forEach(function (basePath) {
      var lib = libs[basePath]
      lib.forEach(function (libFile) {
        var inFile = libFile[config.buildTarget] || libFile['all']
        if (inFile) {
          gulp.src('./node_modules/' + basePath + inFile)
            .pipe(tools.rename(function (path) {
              var outFile = libFile['out'] || libFile['all']
              path.basename = outFile.substring(0, outFile.lastIndexOf("."))
              return path
            }))
            .pipe(gulp.dest(baseOutPath + basePath)).on('finish', done);
        }
      })
    })
  },


  callbackOnCount: function (count, cb) {
    return function () {
      if (--count === 0) {
        cb()
      }
    }
  },

  compileStatic: function (cb) {
    var done = project.callbackOnCount(2, cb)
    gulp.src('./src/**/*.{js,css,eot,svg,ttf,woff,woff2,png}').pipe(gulp.dest(config.buildDir)).on('finish', done);
    tools.gitRev.short(function (rev) {
      gulp.src([config.srcDir + '/**/*.html'])
        .pipe(tools.replace(/\$\{build.revision\}/, rev))
        .pipe(tools.replace(/\$\{build.date\}/, new Date().toISOString()))
        .pipe(gulp.dest(config.buildDir)).on('finish', done);
    })
  },

  doBundle: function (fileNames, outFileName, done) {
    let srcPath = config.srcDir + '/'
    let destPath = config.buildDir + '/'

    let filePaths = []
    fileNames.forEach(function (fileName) {
      filePaths.push(srcPath + fileName)
    })
    return gulp.src(filePaths)
      .pipe(tools.sourcemaps.init())
      .pipe(tools.concat(outFileName || 'bundle.js'))
      .pipe(tools.sourcemaps.write('./'))
      .pipe(gulp.dest(destPath)).on('finish', done);
  },


  compileTsc: function(cb){
    tools.exec('npm run tsc', function (err, stdout, stderr) {
      // Ignoring non-zero exit code errors, as tsc will provide non-zero exit codes on warnings.
      console.log(stdout);
      cb();
    })
  },

  compileTs: function (done) {
    return tools.browserify({
      basedir: '.',
      debug: true,
      entries: ['src/main-test.ts'],
      cache: {},
      packageCache: {}
    }).plugin(tools.tsify)
      .transform("babelify")
      .bundle()
      .pipe(tools.source('main.js'))
      .pipe(tools.buffer())
      .pipe(tools.sourcemaps.init({loadMaps: true}))
      .pipe(tools.sourcemaps.write('./'))
      .pipe(gulp.dest(config.buildDir)).on('finish', done);
  },

  bundles: {
    forge: [
      "forge/configuration-error.js",
      "forge/validate-failed-error.js",
      "forge/forge.js",
      "forge/entity-type.js",
      "forge/boolean-forge.js",
      "forge/number-forge.js",
      "forge/string-forge.js",
      "forge/descendant-validator.js",
      "forge/enum-forge.js",
      "forge/object-forge.js",
      "forge/index.js",'forge/boolean-forge.spec.js',
      'forge/enum-forge.spec.js',
      'forge/number-forge.spec.js',
      'forge/string-forge.spec.js',
      'forge/object-forge.spec.js',
    ]
  },

  compile: function (cb) {
    var done = project.callbackOnCount(3, cb, 'compile')
    project.compileStatic(done)
    project.doBundle(project.bundles.forge, 'forge-bundle.js', done)
    project.copyNpm(done)
  },

  catchError: function (msg) {
    return function (e) {
      console.log(msg || "Error: ", e)
    }
  },
  watch: function () {
    gulp.watch('./src/**/*.html', ['compile-static']).on('error', project.catchError("Error watching HTML files"))
    return gulp.watch('./src/**/*.{js,ts}', ['compile']).on('error', project.catchError("Error watching JS files"))
  },


  /**
   * Configure the proxy and start the webserver.
   */
  startServer: function () {
    console.log("startServer ")


    var proxyBasePaths = [
      'admin',
      'html',
      'api',
      'c',
      'dwr',
      'DotAjaxDirector'
    ]

    var app = tools.connect();
    // proxy API requests to the node server
    proxyBasePaths.forEach(function (pathSegment) {
      var target = config.proxyHost + '/' + pathSegment;
      var proxyOptions = tools.url.parse(target)
      proxyOptions.route = '/' + pathSegment
      proxyOptions.preserveHost = true
      app.use(function (req, res, next) {
        if (req.url.indexOf('/' + pathSegment + '/') === 0) {
          console.log("Forwarding request: ", req.url)
          tools.proxy(proxyOptions)(req, res, next)
        } else {
          next()
        }
      })
    })
    app.use(tools.serveStatic('./'))
    app.use(tools.serveIndex('./'))

    project.server = tools.http.createServer(app);
    project.server.on('error', project.catchError("Error connecting to httpServer"));
    project.server.on('listening', function () {
      console.log('Started connect web server on ' + config.appHost)
      if (config.args.open) {
        var openTo = config.args.open === true ? '/index-dev.html' : config.args.open
        console.log('Opening default browser to ' + openTo)
        tools.open(config.appHost + openTo)
      }
      else {
        console.log("add the '-o' flag to automatically open the default browser")
      }
    });
    project.server.listen(config.appPort)
  },

  stopServer: function (callback) {
    project.server.close(callback)
  },

}


gulp.task('start-server', function (done) {
  project.startServer()
  done()
})

gulp.task('copy-npm', function (cb) {
  project.copyNpm(cb)
});

gulp.task('compile-static', [], function (done) {
  project.compileStatic(done)
})

gulp.task('compileTs', [], function (done) {
  project.compileTs(done)
});
gulp.task('compileTsc', [], function (done) {
  project.compileTsc(done)
});
gulp.task('compile', ['compileTsc'], function (done) {
  project.compile(done)
})

gulp.task('watch', ['compile-static', 'copy-npm'], function () {
  return project.watch()
});

gulp.task('serve', ['start-server', 'watch'], function (done) {
  // if 'done' is not passed in this task will not block.
})

gulp.task('clean', [], function (done) {
  project.clean(done)
})

gulp.task('build', ['compile'], function () {
})

gulp.task('default', function (done) {
  done()
});
