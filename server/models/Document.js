const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  title: String,
  content: String,
  summary: String,
  tags: [String],
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const docSchema = new mongoose.Schema({
  title: { type: String, required:true },
  content: { type: String, required:true },
  summary: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  embeddings: { type: [Number] },
  versions: [versionSchema]
}, { timestamps: true });

docSchema.index({ title: 'text', content: 'text', summary: 'text', tags: 'text' });
module.exports = mongoose.model('Document', docSchema);
