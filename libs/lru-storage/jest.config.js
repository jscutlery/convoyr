module.exports = {
  name: 'lru-storage',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/lru-storage',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
