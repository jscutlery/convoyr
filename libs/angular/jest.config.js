module.exports = {
  name: 'angular',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/angular',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  coverageReporters: ['html', 'lcov']
};
