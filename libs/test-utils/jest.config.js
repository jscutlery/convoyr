module.exports = {
  name: 'test-utils',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/test-utils',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
