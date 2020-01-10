module.exports = {
  name: 'plugin-retry',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plugin-retry',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
