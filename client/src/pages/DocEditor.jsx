import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function DocEditor(){
  const { id } = useParams();
  const isNew = !id;
  const { authAxios } = useAuth();
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const [summary,setSummary] = useState('');
  const [tags,setTags] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{ if(!isNew) load(); }, [id]);

  async function load(){
    const res = await authAxios.get('/docs/' + id);
    setTitle(res.data.title); setContent(res.data.content); setSummary(res.data.summary); setTags(res.data.tags || []);
  }

  async function save(){
    if(isNew){
      const res = await authAxios.post('/docs', { title, content });
      nav('/');
    } else {
      await authAxios.put('/docs/' + id, { title, content });
      nav('/');
    }
  }

  async function regenSummary(){
    await authAxios.put('/docs/' + (id || ''), { title, content });
    if(!isNew) load();
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{isNew? 'New Document' : 'Edit Document'}</h2>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded mb-3" />
      <textarea value={content} onChange={e=>setContent(e.target.value)} rows={12} className="w-full p-2 border rounded mb-3" />
      <div className="flex gap-2">
        <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        {!isNew && <button onClick={regenSummary} className="bg-yellow-500 text-white px-4 py-2 rounded">Summarize with Gemini</button>}
      </div>
      {!isNew && <div className="mt-4">
        <h3 className="font-semibold">Summary</h3>
        <p className="mt-2">{summary}</p>
        <h4 className="mt-3 font-semibold">Tags</h4>
        <div className="flex gap-2 mt-2">{(tags||[]).map(t=> <span key={t} className="px-2 py-1 bg-gray-200 rounded">{t}</span>)}</div>
      </div>}
    </div>
  );
}
