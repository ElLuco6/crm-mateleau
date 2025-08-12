/* module.exports = function (config) {
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
 */
module.exports = function (config) {
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS;

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

    client: { clearContext: false }, // garde le reporter HTML entre les runs
    reporters: ['progress', 'kjhtml', 'coverage'],

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [{ type: 'lcovonly', subdir: '.' }, { type: 'html', subdir: '.' }, { type: 'text' }, { type: 'text-summary' }],
      fixWebpackSourcePaths: true,
      instrumenterOptions: { esModules: true },
    },

    // 👇 DEV: fenêtre ouverte + watch | CI: headless + single run
    browsers: isCI ? ['ChromeHeadlessCI'] : ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },

    autoWatch: !isCI,           // relance auto en dev
    singleRun: isCI,            // CI = un seul run
    restartOnFileChange: true,  // recompile et relance sur chaque save

    // plus tolérant en dev si gros bundles
    browserNoActivityTimeout: 60000,
    browserDisconnectTolerance: 3,
    captureTimeout: 120000,
  });
};
