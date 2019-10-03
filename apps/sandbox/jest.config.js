module.exports = {
  name: 'sandbox',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/sandbox',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
