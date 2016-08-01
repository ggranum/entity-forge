"use strict";

var tools = {}

tools.exec = require('child_process').exec
tools.http = require('http')
tools.url = require('url')
tools.fs = require('fs')
tools.util = require('util')

// from npm
tools.connect = require('connect');
tools.del = require('del')
tools.gitRev = require('git-rev')
var gulp = require('gulp')
tools.concat = require('gulp-concat')
tools.rename = require('gulp-rename')
tools.replace = require('gulp-replace')
tools.sourcemaps = require('gulp-sourcemaps')
tools.minimist = require('minimist')
tools.open = require('open');
tools.proxy = require('proxy-middleware')
tools.serveIndex = require('serve-index')
tools.serveStatic = require('serve-static')


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

  catchError: function (msg) {
    return function (e) {
      console.log(msg || "Error: ", e)
    }
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


gulp.task('serve', ['start-server'], function (done) {
  // if 'done' is not passed in this task will not block.
})

gulp.task('default', function (done) {
  done()
});
