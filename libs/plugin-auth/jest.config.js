module.exports = {
  name: 'plugin-auth',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plugin-auth',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
