module.exports = {
  name: 'plugin-auth',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plugin-auth',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  coverageReporters: ['html', 'lcov']
};
