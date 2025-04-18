"use client";
import type React from "react";
import { useState, useEffect } from "react";

type TPListEntry = { id: string, ticker: string, target: number };

function loadTPList(): TPListEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("tplist") || "[]");
  } catch {
    return [];
  }
}
function saveTPList(list: TPListEntry[]) {
  localStorage.setItem("tplist", JSON.stringify(list));
}

export default function TPListPage() {
  const [tplist, setTPList] = useState<TPListEntry[]>([]);
  const [input, setInput] = useState({ ticker: "", target: "" });
  const [editId, setEditId] = useState<string|null>(null);
  useEffect(() => { setTPList(loadTPList()); }, []);
  useEffect(() => { saveTPList(tplist); }, [tplist]);

  const addOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const ticker = input.ticker.trim().toUpperCase();
    const tprice = Number(input.target);
    if (!ticker || !input.target || Number.isNaN(tprice)) return;
    if (editId) {
      setTPList(tplist.map(item => item.id === editId ? { ...item, ticker, target: tprice } : item));
      setEditId(null);
    } else {
      if (tplist.some(item => item.ticker === ticker)) return;
      setTPList([{ id: Math.random().toString(36).slice(2), ticker, target: tprice }, ...tplist]);
    }
    setInput({ ticker: "", target: "" });
  };
  const startEdit = (id: string) => {
    const item = tplist.find(t => t.id === id);
    if (!item) return;
    setEditId(id);
    setInput({ ticker: item.ticker, target: item.target.toString() });
  };
  const deleteEntry = (id: string) => {
    setTPList(tplist.filter(item => item.id !== id));
    if (editId === id) setEditId(null);
  };
  return (
    <div className="max-w-md mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-bold mb-4">TP List</h1>
      <form onSubmit={addOrUpdate} className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Stock Ticker"
          className="rounded p-2 text-black w-32"
          value={input.ticker}
          onChange={e=>setInput(i=>({ ...i, ticker: e.target.value }))}
          required
          disabled={Boolean(editId)}
        />
        <input
          type="number"
          min={0.01}
          step={0.01}
          placeholder="Target Price"
          className="rounded p-2 text-black w-32"
          value={input.target}
          onChange={e=>setInput(i=>({ ...i, target: e.target.value }))}
          required
        />
        <button type="submit" className="bg-green-600 text-white font-semibold px-4 py-2 rounded">
          {editId ? "Update" : "Add"}
        </button>
        {editId && <button type="button" className="text-xs underline ml-2" onClick={()=>{ setEditId(null); setInput({ ticker: "", target: "" })}}>Cancel</button>}
      </form>
      <div className="rounded bg-zinc-900 p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-zinc-800">
              <th className="px-3 py-2">Ticker</th>
              <th className="px-3 py-2">Target Price</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tplist.length===0 && (
              <tr><td colSpan={3} className="text-zinc-400 py-4 text-center">No entries yet.</td></tr>
            )}
            {tplist.map(item => (
              <tr key={item.id} className="border-t border-zinc-800">
                <td className="px-3 py-2 font-mono">{item.ticker}</td>
                <td className="px-3 py-2">{item.target}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button className="text-blue-400 text-xs hover:underline" onClick={()=>startEdit(item.id)}>Edit</button>
                  <button className="text-red-400 text-xs hover:underline" onClick={()=>deleteEntry(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
