"use client";

import type React from "react";
import { useEffect, useState } from "react";

// Type def for an order
interface LimitOrder {
  id: string;
  ticker: string;
  type: "Buy" | "Sell";
  limitPrice: number;
  quantity: number;
}

function loadOrders(): LimitOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("limitOrders");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveOrders(orders: LimitOrder[]) {
  localStorage.setItem("limitOrders", JSON.stringify(orders));
}

export default function LimitOrdersPage() {
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [form, setForm] = useState({
    ticker: "",
    type: "Buy" as "Buy" | "Sell",
    limitPrice: "",
    quantity: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  // Handle add or update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number.parseFloat(form.limitPrice);
    const qty = Number.parseFloat(form.quantity);
    if (!form.ticker || Number.isNaN(price) || Number.isNaN(qty)) return;
    if (editId) {
      setOrders(
        orders.map((o) =>
          o.id === editId ? { ...o, ...form, limitPrice: price, quantity: qty } : o
        )
      );
      setEditId(null);
    } else {
      setOrders([
        {
          id: Math.random().toString(36).slice(2),
          ticker: form.ticker.toUpperCase(),
          type: form.type,
          limitPrice: price,
          quantity: qty,
        },
        ...orders,
      ]);
    }
    setForm({ ticker: "", type: "Buy", limitPrice: "", quantity: "" });
  };
  // Handle edit
  const startEdit = (o: LimitOrder) => {
    setForm({ ticker: o.ticker, type: o.type, limitPrice: o.limitPrice.toString(), quantity: o.quantity.toString() });
    setEditId(o.id);
  };
  // Handle delete
  const handleDelete = (id: string) => setOrders(orders.filter((o) => o.id !== id));

  // Filtered lists
  const buyOrders = orders.filter((o) => o.type === "Buy");
  const sellOrders = orders.filter((o) => o.type === "Sell");
  const totalInvestment = buyOrders.reduce((sum, o) => sum + o.limitPrice * o.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-10">
      <h1 className="text-2xl font-bold mb-4">Limit Orders</h1>
      {/* Add/edit order form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-lg p-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          minLength={1}
          maxLength={8}
          placeholder="Stock Ticker"
          className="rounded p-2 text-black w-28"
          value={form.ticker}
          onChange={(e) => setForm({ ...form, ticker: e.target.value })}
          required
        />
        <select
          className="rounded p-2 text-black"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as "Buy" | "Sell" })}
        >
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
        <input
          type="number"
          step="0.01"
          min={0.01}
          placeholder="Limit Price"
          className="rounded p-2 text-black w-28"
          value={form.limitPrice}
          onChange={(e) => setForm({ ...form, limitPrice: e.target.value })}
          required
        />
        <input
          type="number"
          min={1}
          step="1"
          placeholder="Quantity"
          className="rounded p-2 text-black w-24"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit" className="bg-teal-600 hover:bg-teal-700 px-5 py-2 rounded text-white font-semibold">
          {editId ? "Update" : "Add Order"}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 text-xs underline text-zinc-400"
            onClick={() => { setEditId(null); setForm({ ticker: "", type: "Buy", limitPrice: "", quantity: "" }); }}
          >
            Cancel
          </button>
        )}
      </form>
      {/* Orders tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buy orders */}
        <div>
          <h2 className="font-bold text-lg mb-2 text-teal-400">Buy Limit Orders</h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="px-4 py-2">Ticker</th>
                  <th className="px-4 py-2">Limit Price</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Investment</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buyOrders.map((o) => (
                  <tr key={o.id} className="border-t border-zinc-800">
                    <td className="px-4 py-2 font-mono">{o.ticker}</td>
                    <td className="px-4 py-2">{o.limitPrice.toLocaleString()} PKR</td>
                    <td className="px-4 py-2">{o.quantity}</td>
                    <td className="px-4 py-2">{(o.limitPrice * o.quantity).toLocaleString()} PKR</td>
                    <td className="px-4 py-2 flex gap-1">
                      <button className="text-xs text-blue-300 hover:underline" onClick={() => startEdit(o)}>Edit</button>
                      <button className="text-xs text-red-400 hover:underline" onClick={() => handleDelete(o.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {buyOrders.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-4 text-zinc-400">No buy limit orders</td></tr>
                )}
              </tbody>
              {/* Show total investment at the bottom */}
              <tfoot>
                <tr className="bg-zinc-900 border-t border-zinc-700 font-bold">
                  <td colSpan={3} className="px-4 py-2 text-right">Total Investment:</td>
                  <td className="px-4 py-2 text-teal-300">{totalInvestment.toLocaleString()} PKR</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* Sell orders */}
        <div>
          <h2 className="font-bold text-lg mb-2 text-rose-300">Sell Limit Orders</h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="px-4 py-2">Ticker</th>
                  <th className="px-4 py-2">Limit Price</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellOrders.map((o) => (
                  <tr key={o.id} className="border-t border-zinc-800">
                    <td className="px-4 py-2 font-mono">{o.ticker}</td>
                    <td className="px-4 py-2">{o.limitPrice.toLocaleString()} PKR</td>
                    <td className="px-4 py-2">{o.quantity}</td>
                    <td className="px-4 py-2 flex gap-1">
                      <button className="text-xs text-blue-300 hover:underline" onClick={() => startEdit(o)}>Edit</button>
                      <button className="text-xs text-red-400 hover:underline" onClick={() => handleDelete(o.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {sellOrders.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-4 text-zinc-400">No sell limit orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
