const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { authMiddleware } = require('../middleware/auth');
const { generateSummaryAndTags, getEmbedding } = require('../services/gemini');

router.use(authMiddleware);

// Create document
router.post('/', async (req,res)=>{
  const { title, content } = req.body;
  if(!title || !content) return res.status(400).json({error:'title+content required'});

  let summary = '';
  let tags = [];
  let vector = null;

  try {
    const out = await generateSummaryAndTags(content);
    summary = out.summary || '';
    tags = out.tags || [];
  } catch(e) { console.warn('summary/tags failed', e.message); }

  try { 
    vector = await getEmbedding(title + '\n' + (summary || content).slice(0,10000)); 
  } catch(e){ console.warn('embedding failed', e.message); }

  const doc = await Document.create({ 
    title, 
    content, 
    summary, 
    tags, 
    createdBy: req.user._id, 
    embeddings: vector 
  });

  res.json(doc);
});

// Update document
router.put('/:id', async (req,res)=>{
  const doc = await Document.findById(req.params.id);
  if(!doc) return res.status(404).json({error:'Not found'});
  if(!(req.user.role === 'admin' || doc.createdBy.equals(req.user._id))) return res.status(403);

  doc.versions.push({
    title: doc.title,
    content: doc.content,
    summary: doc.summary,
    tags: doc.tags,
    updatedAt: doc.updatedAt
  });

  const { title, content } = req.body;
  if (title) doc.title = title;
  if (content) doc.content = content;

  try {
    const out = await generateSummaryAndTags(doc.content);
    doc.summary = out.summary || doc.summary;
    doc.tags = out.tags || doc.tags;
  } catch(e){ console.warn(e.message); }

  try { 
    doc.embeddings = await getEmbedding(doc.title + '\n' + (doc.summary || doc.content).slice(0,10000)); 
  } catch(e) { console.warn(e.message); }

  await doc.save();
  res.json(doc);
});

// List documents
router.get('/', async (req,res)=>{
  const { tag } = req.query;
  const q = tag ? { tags: tag } : {};
  const docs = await Document.find(q)
    .populate('createdBy','email name role')
    .sort({ updatedAt: -1 })
    .limit(200);
  res.json(docs);
});

// Get single document
router.get('/:id', async (req,res)=>{
  const doc = await Document.findById(req.params.id).populate('createdBy','email name role');
  if(!doc) return res.status(404).json({error:'Not found'});
  res.json(doc);
});

// Delete document
router.delete('/:id', async (req,res)=>{
  const doc = await Document.findById(req.params.id);
  if(!doc) return res.status(404).json({error:'Not found'});
  if(!(req.user.role === 'admin' || doc.createdBy.equals(req.user._id))) return res.status(403);

  await doc.deleteOne();   // ✅ fixed
  res.json({ ok: true });
});

module.exports = router;

