module.exports = function (config) {
  config.set({
    // ...
    reporters: ['progress', 'kjhtml', 'coverage'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'lcovonly', subdir: '.' },
        { type: 'text-summary' }
      ],
      fixWebpackSourcePaths: true,
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
  });
};
