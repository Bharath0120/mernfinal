const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Document = require('../models/Document');
const { getEmbedding, generateAnswerFromContext } = require('../services/gemini');

router.use(authMiddleware);

router.post('/', async (req,res)=>{
  const { question } = req.body;
  if(!question) return res.status(400).json({error:'question required'});
  const qVec = await getEmbedding(question);
  const docs = await Document.find({ embeddings: { $exists: true } }).limit(1000);
  function cosine(a,b){ if(!a||!b) return -1; let dot=0,na=0,nb=0; for(let i=0;i<a.length;i++){dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i];} return dot/(Math.sqrt(na)*Math.sqrt(nb)); }
  const scored = docs.map(d=>({ d, score: cosine(qVec, d.embeddings) })).sort((a,b)=>b.score - a.score).slice(0,6).map(x=> x.d );
  const contexts = scored.map(d => ({ title: d.title, summary: d.summary, content: d.content }));
  const answer = await generateAnswerFromContext(question, contexts);
  res.json({ answer, sources: contexts.map(c=>({ title:c.title })) });
});

module.exports = router;
