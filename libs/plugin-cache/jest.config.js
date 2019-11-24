module.exports = {
  name: 'plugin-cache',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plugin-cache',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  coverageReporters: ['html', 'lcov']
};
