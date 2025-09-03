import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function DocCard({ doc, onUpdate }){
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(false);

  async function summarize(){
    setLoading(true);
    await authAxios.put('/docs/' + doc._id, { title: doc.title, content: doc.content });
    setLoading(false);
    if(onUpdate) onUpdate();
  }

  async function genTags(){
    setLoading(true);
    await authAxios.put('/docs/' + doc._id, { title: doc.title, content: doc.content });
    setLoading(false);
    if(onUpdate) onUpdate();
  }

  async function del(){
    if(!confirm('Delete document?')) return;
    await authAxios.delete('/docs/' + doc._id);
    if(onUpdate) onUpdate();
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{doc.title}</h3>
          <div className="text-sm text-gray-600">By {doc.createdBy?.name || doc.createdBy?.email || 'Unknown'}</div>
        </div>
        <div className="text-sm text-gray-500">{new Date(doc.updatedAt).toLocaleString()}</div>
      </div>
      <p className="mt-3 text-sm">{doc.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">{(doc.tags||[]).map(t=> <span key={t} className="px-2 py-1 bg-gray-200 rounded">{t}</span>)}</div>
      <div className="mt-3 flex gap-2">
        <Link to={'/docs/' + doc._id + '/edit'} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit</Link>
        <button onClick={summarize} className="px-3 py-1 bg-yellow-500 text-white rounded">{loading? 'Working...':'Summarize'}</button>
        <button onClick={genTags} className="px-3 py-1 bg-pink-500 text-white rounded">Generate Tags</button>
        <button onClick={del} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
  );
}
