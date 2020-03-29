module.exports = {
  name: 'plugin-retry',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plugin-retry',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  coverageReporters: ['html', 'lcov']
};
