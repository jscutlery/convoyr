module.exports = {
  name: 'httpext',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/httpext',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
