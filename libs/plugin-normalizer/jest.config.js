module.exports = {
  name: 'plugin-normalizer',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/plugin-normalizer',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
