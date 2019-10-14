module.exports = {
  name: 'http-ext',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/http-ext',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  coverageReporters: ['html', 'lcov']
};
