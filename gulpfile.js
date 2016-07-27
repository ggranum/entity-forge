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
  bundles: {
    forge: [
    ]
  },

  compileTsc: function(cb){
    tools.exec('npm run tsc', function (err, stdout, stderr) {
      // Ignoring non-zero exit code errors, as tsc will provide non-zero exit codes on warnings.
      console.log(stdout);
      cb();
    })
  },

  runJspm: function(target, cb){
    tools.exec('npm run build.jspm.' + target, function (err, stdout, stderr) {
      // Ignoring non-zero exit code errors.
      console.log(stdout);
      cb();
    })
  },

  jspmBuildWithTests: function(cb){
    var done = project.callbackOnCount(3, cb, 'jspmBuildWithTests')
    project.compileStatic(done)
    project.runJspm('test', done)
    project.doBundle(project.bundles.forge, 'forge-bundle.js', function(){
      project.compileDist(done)
    })
  },


  compile: function (cb) {
    var done = project.callbackOnCount(2, cb, 'compile')
    project.compileStatic(done)
    project.doBundle(project.bundles.forge, 'forge-bundle.js', function(){
      project.compileDist(done)
    })

  },

  compileDist: function (done) {
    return gulp.src([config.buildDir + '/forge-bundle.js'])
      .pipe(gulp.dest(config.distDir)).on('finish', done);
  },

  catchError: function (msg) {
    return function (e) {
      console.log(msg || "Error: ", e)
    }
  },
  watch: function (compileTarget) {
    gulp.watch('./src/**/*.html', ['compile-static']).on('error', project.catchError("Error watching HTML files"))
    return gulp.watch('./src/**/*.{js,ts}', [compileTarget || 'compile']).on('error', project.catchError("Error watching JS files"))
  },


  /**
   * Configure the proxy and start the webserver.
   */
  startServer: function () {
    console.log("startServer ")


    var proxyBasePaths = [
      'html',
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


gulp.task('compile-static', [], function (done) {
  project.compileStatic(done)
})

gulp.task('compileTsc', [], function (done) {
  project.compileTsc(done)
});
gulp.task('compile', ['compileTsc'], function (done) {
  project.compile(done)
})

gulp.task('watch', ['compile-static'], function () {
  return project.watch()
});

gulp.task('serve', ['start-server', 'watch'], function (done) {
  // if 'done' is not passed in this task will not block.
})

gulp.task('clean', [], function (done) {
  project.clean(done)
})

gulp.task('jspmBuildWithTests', function (done) {
  project.jspmBuildWithTests(done)
})

gulp.task('watchJspm', ['compile-static'], function () {
  return project.watch('jspmBuildWithTests')
});
gulp.task('serveJspm', ['start-server', 'watchJspm'], function (done) {
  // if 'done' is not passed in this task will not block.
})


gulp.task('build', ['compile'], function () {
})

gulp.task('default', function (done) {
  done()
});
