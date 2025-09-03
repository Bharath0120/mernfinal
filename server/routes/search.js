const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { authMiddleware } = require('../middleware/auth');
const { getEmbedding } = require('../services/gemini');

router.use(authMiddleware);

router.get('/text', async (req,res)=>{
  const q = req.query.q;
  if(!q) return res.json([]);
  const docs = await Document.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
                            .sort({ score: { $meta: 'textScore' } })
                            .limit(50);
  res.json(docs);
});

router.get('/semantic', async (req,res)=>{
  const q = req.query.q;
  if(!q) return res.status(400).json({error:'q required'});
  const queryVec = await getEmbedding(q);
  const docs = await Document.find({ embeddings: { $exists: true } }).limit(1000);
  function cosine(a,b){ if(!a||!b) return -1; let dot=0,na=0,nb=0; for(let i=0;i<a.length;i++){dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i];} return dot/(Math.sqrt(na)*Math.sqrt(nb)); }
  const scored = docs.map(d=>({ doc:d, score: cosine(queryVec, d.embeddings) || 0 })).sort((a,b)=>b.score - a.score).slice(0,20).map(x=> ({ score:x.score, doc:x.doc }));
  res.json(scored);
});

module.exports = router;
