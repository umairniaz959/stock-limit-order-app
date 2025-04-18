"use client";
import type React from "react";
import { useState, useEffect } from "react";

function loadWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("watchlist") || "[]");
  } catch {
    return [];
  }
}
function saveWatchlist(list: string[]) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [input, setInput] = useState("");
  useEffect(() => { setWatchlist(loadWatchlist()); }, []);
  useEffect(() => { saveWatchlist(watchlist); }, [watchlist]);

  const addStock = (e: React.FormEvent) => {
    e.preventDefault();
    const ticker = input.trim().toUpperCase();
    if (ticker && !watchlist.includes(ticker)) {
      setWatchlist([ticker, ...watchlist]);
      setInput("");
    }
  };
  const removeStock = (t:string) => setWatchlist(watchlist.filter(s => s !== t));

  return (
    <div className="max-w-md mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <form onSubmit={addStock} className="flex gap-2">
        <input
          type="text"
          placeholder="Stock Ticker"
          className="rounded p-2 text-black w-32"
          value={input}
          onChange={e=>setInput(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded">Add</button>
      </form>
      <ul className="rounded bg-zinc-900 p-4 divide-y divide-zinc-800">
        {watchlist.length===0 && <li className="text-zinc-400">No stocks in your watchlist.</li>}
        {watchlist.map(ticker => (
          <li key={ticker} className="flex justify-between items-center py-2">
            <span className="font-mono text-lg">{ticker}</span>
            <button className="text-red-400 text-xs hover:underline" onClick={()=>removeStock(ticker)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
