module.exports.models = {
  schema: true,
  migrate: 'alter',
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id: { type: 'number', autoIncrement: true, },
 },
  dataEncryptionKeys: {
    default: 'UQ74H/syvWOaYG0tNiby5rVQhWi7LFNZCVf4tle6PuM='
  },

  cascadeOnDestroy: true
};
