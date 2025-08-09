module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: { clearContext: false },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'lcovonly', subdir: '.' },
        { type: 'text-summary' }
      ],
      fixWebpackSourcePaths: true,
      // IMPORTANT si tu utilises beaucoup d'ESM :
      instrumenterOptions: { esModules: true },
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: false,
  });
};
