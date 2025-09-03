import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function QA(){
  const { authAxios } = useAuth();
  const [q,setQ] = useState('');
  const [answer,setAnswer] = useState(null);
  const [sources,setSources] = useState([]);

  async function ask(){
    const res = await authAxios.post('/qa', { question: q });
    setAnswer(res.data.answer);
    setSources(res.data.sources || []);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Team Q&A</h1>
      <textarea value={q} onChange={e=>setQ(e.target.value)} rows={4} className="w-full p-2 border rounded mb-3" />
      <div className="flex gap-2 mb-4">
        <button onClick={ask} className="bg-blue-600 text-white px-4 py-2 rounded">Ask</button>
      </div>
      {answer && <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Answer</h3>
        <p className="mt-2">{answer}</p>
        <h4 className="mt-3 font-semibold">Sources</h4>
        <ul className="mt-2">{sources.map(s=> <li key={s.title}>{s.title}</li>)}</ul>
      </div>}
    </div>
  );
}
