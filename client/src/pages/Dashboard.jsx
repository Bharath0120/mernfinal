import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import DocCard from '../components/DocCard';

export default function Dashboard(){
  const { authAxios, user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState(null);

  useEffect(()=>{ fetchDocs(); }, []);

  async function fetchDocs(){
    const res = await authAxios.get('/docs');
    setDocs(res.data);
    const t = new Set();
    res.data.forEach(d=> (d.tags||[]).forEach(tag=>t.add(tag)));
    setTags(Array.from(t));
  }

  const recent = docs.slice(0,5);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Link to="/docs/new" className="bg-blue-600 text-white px-4 py-2 rounded">New Document</Link>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Filter by tag</h3>
        <div className="flex gap-2 mt-2">
          <button onClick={()=>setFilter(null)} className="px-2 py-1 bg-gray-200 rounded">All</button>
          {tags.map(t=> (
            <button key={t} onClick={()=>setFilter(t)} className={`px-2 py-1 rounded ${filter===t?'bg-blue-500 text-white':'bg-gray-200'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.filter(d=> !filter || (d.tags||[]).includes(filter)).map(d=> <DocCard key={d._id} doc={d} onUpdate={fetchDocs} />)}
      </div>

      <div className="mt-8">
        <h2 className="font-semibold">Recently edited</h2>
        <ul className="mt-2">
          {recent.map(r=> <li key={r._1d} className="py-1 border-b">{r.title} — {new Date(r.updatedAt).toLocaleString()}</li>)}
        </ul>
      </div>
    </div>
  );
}
