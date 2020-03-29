module.exports = {
  name: 'angular',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/angular',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
  coverageReporters: ['html', 'lcov']
};
