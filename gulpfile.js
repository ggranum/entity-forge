"use strict";

var tools = {}

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
tools.sourceMaps = require('gulp-sourcemaps');
tools.minimist = require('minimist')
tools.open = require('open');
tools.proxy = require('proxy-middleware');
tools.serveIndex = require('serve-index');
tools.serveStatic = require('serve-static');

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
      .pipe(tools.sourceMaps.init())
      .pipe(tools.concat(outFileName || 'bundle.js'))
      .pipe(tools.sourceMaps.write('./'))
      .pipe(gulp.dest(destPath)).on('finish', done);
  },

  bundles: {
    validation: [
      "check/validation/restrictions.js",
      "check/validation/validator.js",
      "check/validation/objects.js",
      "check/validation/arrays.js",
      "check/validation/booleans.js",
      "check/validation/numbers.js",
      "check/validation/strings.js",
      "check/validation/index.js",
    ],
    check: [
      "check/constraint.js",
      "check/check.js",
      "check/array-check.js",
      "check/boolean-check.js",
      "check/number-check.js",
      "check/string-check.js",
      "check/index.js",
    ],
    generate: [
      "generate/data-gen.js",
      "generate/boolean-gen.js",
      "generate/enum-gen.js",
      "generate/number-gen.js",
      "generate/string-gen.js",
      "generate/object-gen.js",
    ],
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
      "forge/index.js",
    ],
    specs: [
      'generate/data-gen.spec.js',
      'generate/boolean-gen.spec.js',
      'generate/number-gen.spec.js',
      'generate/enum-gen.spec.js',
      'generate/string-gen.spec.js',
      'generate/object-gen.spec.js',
      'check/check.spec.js',
      'forge/boolean-forge.spec.js',
      'forge/enum-forge.spec.js',
      'forge/number-forge.spec.js',
      'forge/string-forge.spec.js',
      'forge/object-forge.spec.js',
    ]
  },

  compile: function (cb) {
    var done = project.callbackOnCount(8, cb, 'compile')
    project.compileStatic(done)
    var b = project.bundles
    let release = b.validation.concat(b.check, b.generate, b.forge)
    project.doBundle(project.bundles.validation, 'check/validation/bundle.js', done)
    project.doBundle(project.bundles.generate, 'generate/bundle.js', done)
    project.doBundle(project.bundles.check, 'check/bundle.js', done)
    project.doBundle(project.bundles.forge, 'forge/bundle.js', done)
    project.doBundle(project.bundles.specs, 'specs.bundle.js', done)
    project.doBundle(release, 'entity-forge.js', done)
    project.copyNpm(done)
  },

  catchError: function (msg) {
    return function (e) {
      console.log(msg || "Error: ", e)
    }
  },
  watch: function () {
    gulp.watch('./src/**/*.html', ['compile-static']).on('error', project.catchError("Error watching HTML files"))
    return gulp.watch('./src/**/*.js', ['compile']).on('error', project.catchError("Error watching JS files"))
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

gulp.task('compile', [], function (done) {
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

gulp.task('build', [], function (done) {
  project.compile(done)
})

gulp.task('default', function (done) {
  done()
});