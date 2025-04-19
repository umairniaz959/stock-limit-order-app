"use client";
import React, { useEffect, useState } from "react";

// ... your LimitOrder type, all your code as before ...

// Add these localStorage key constants
const LIMIT_ORDER_KEY = "limitOrders";
const WATCHLIST_KEY = "watchlist";
const TPLIST_KEY = "tplist";

function loadOrders(): LimitOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LIMIT_ORDER_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveOrders(orders: LimitOrder[]) {
  localStorage.setItem(LIMIT_ORDER_KEY, JSON.stringify(orders));
}

function loadWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
  } catch { return []; }
}
function saveWatchlist(list: string[]) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

function loadTPList(): any[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(TPLIST_KEY) || "[]");
  } catch { return []; }
}
function saveTPList(list: any[]) {
  localStorage.setItem(TPLIST_KEY, JSON.stringify(list));
}

export default function LimitOrdersPage() {
  // ... (all your existing state and handlers as before)

  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [form, setForm] = useState({
    ticker: "",
    type: "Buy" as "Buy" | "Sell",
    limitPrice: "",
    quantity: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  // Re-render for import
  const [_, setDataChanged] = useState(0);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  // ... (your handleSubmit, startEdit, handleDelete, etc. as before) ...

  // --- Export handler ---
  const handleExport = () => {
    const data = {
      limitOrders: loadOrders(),
      watchlist: loadWatchlist(),
      tplist: loadTPList(),
    };
    const contents = JSON.stringify(data, null, 2);
    const blob = new Blob([contents], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'stock-app-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // --- Import handler ---
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.limitOrders || !json.watchlist || !json.tplist) {
          alert("Invalid backup file.");
          return;
        }
        localStorage.setItem(LIMIT_ORDER_KEY, JSON.stringify(json.limitOrders));
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(json.watchlist));
        localStorage.setItem(TPLIST_KEY, JSON.stringify(json.tplist));
        setDataChanged(d => d + 1); // force rerender on import
        alert("Imported successfully! Reloading page.");
        location.reload();
      } catch {
        alert("Failed to import—invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // ... rest of your rendering logic ...

  // Rest of your code unchanged, EXCEPT insert the following block after 
  // <div className="max-w-2xl mx-auto py-8 space-y-10">
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-10">
      {/* Import / Export buttons at TOP */}
      <div className="flex gap-4 mb-4">
        <button type="button"
         className="bg-violet-700 hover:bg-violet-800 px-4 py-2 rounded text-white font-semibold"
         onClick={handleExport}>
          Export Data
        </button>
        <label className="bg-violet-500 hover:bg-violet-600 px-4 py-2 rounded text-white font-semibold cursor-pointer">
          Import Data
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </label>
      </div>
      {/* ...the rest of your return JSX (form, tabs, tables, etc) unchanged... */}
      {/* ... keep all other code below this as in your current file ... */}