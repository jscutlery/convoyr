module.exports = {
  name: 'plugin-cache',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plugin-cache',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  coverageReporters: ['html', 'lcov']
};
