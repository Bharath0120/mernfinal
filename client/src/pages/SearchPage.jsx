import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import DocCard from '../components/DocCard';

export default function SearchPage(){
  const { authAxios } = useAuth();
  const [q,setQ] = useState('');
  const [results,setResults] = useState([]);

  async function doText(){
    const res = await authAxios.get('/search/text?q=' + encodeURIComponent(q));
    setResults(res.data);
  }
  async function doSemantic(){
    const res = await authAxios.get('/search/semantic?q=' + encodeURIComponent(q));
    setResults(res.data.map(r=> r.doc ));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Search query..." />
        <button onClick={doText} className="px-3 py-2 bg-gray-300 rounded">Text</button>
        <button onClick={doSemantic} className="px-3 py-2 bg-blue-600 text-white rounded">Semantic</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map(r=> <DocCard key={r._id} doc={r} />)}
      </div>
    </div>
  );
}
