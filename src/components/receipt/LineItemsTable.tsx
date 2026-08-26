"use client";

import React from "react";
import { Plus, Trash2, Edit3, SlidersHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function renderDetails(details: string) {
  return details.split("\n").map((line, i) => {
    const idx = line.indexOf(":");
    if (idx === -1) return (
      <div key={i}>{line}</div>
    );
    const label = line.slice(0, idx + 1); // "Model:"
    const value = line.slice(idx + 1);
    return (
      <div key={i}>
        <strong>{label}</strong>
        {value}
      </div>
    );
  });
}

export interface ItemRow {
  id: string;
  name: string;
  description: string;
  details: string;
  modelNo?: string;
  serialNo?: string;
  imei1?: string;
  imei2?: string;
  qty: number;
  unitPrice: number;
  discount: number;
  amount: number;
}

interface LineItemsTableProps {
  items: ItemRow[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onItemChange: (id: string, field: keyof Omit<ItemRow, "id" | "amount">, value: string | number) => void;
  onOpenDetailModal: (item: ItemRow) => void;
}

export default function LineItemsTable({
  items,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onOpenDetailModal,
}: LineItemsTableProps) {
  return (
    <div id="itemTable" className="space-y-3 pt-4 border-t border-surface-border">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider">
          Line Items
        </h3>
        <span className="text-xs text-zinc-500 font-medium">
          {items.length} {items.length === 1 ? "Item" : "Items"} added
        </span>
      </div>

      <div className="table-wrapper overflow-x-auto rounded-xl border border-surface-border shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-secondary text-white font-semibold">
              <th className="py-3 px-3 w-10 text-center">S/N</th>
              <th className="py-3 px-3 min-w-32.5">Name</th>
              <th className="py-3 px-3 min-w-30">Item Description</th>
              <th className="py-3 px-3 min-w-45">Item Details</th>
              <th className="py-3 px-3 w-16 text-center">Qty</th>
              <th className="py-3 px-3 w-32 text-right">(₦) Unit Price</th>
              <th className="py-3 px-3 w-24 text-center">Discount (%)</th>
              <th className="py-3 px-3 w-32 text-right">Amount</th>
              <th className="py-3 px-3 w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody id="itemRows" className="divide-y divide-surface-border bg-white">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-surface-light/60 transition-colors">
                <td className="py-2.5 px-3 text-center font-bold text-secondary bg-surface-light/30">{index + 1}</td>
                <td className="py-2.5 px-2">
                  <input
                    type="text"
                    required
                    value={item.name}
                    onChange={(e) => onItemChange(item.id, "name", e.target.value)}
                    placeholder="e.g. Laptop"
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium"
                  />
                </td>
                <td className="py-2.5 px-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => onItemChange(item.id, "description", e.target.value)}
                    placeholder="e.g. Core i7 16GB"
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium"
                  />
                </td>

                <td className="py-2.5 px-2">
                  {item.details ? (
                    <button
                      type="button"
                      onClick={() => onOpenDetailModal(item)}
                      title={item.details}
                      className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-secondary rounded-lg text-xs font-medium transition-colors text-left group cursor-pointer"
                    >
                      <span className="whitespace-pre-line line-clamp-2 max-w-37.5 font-mono text-[11px] text-zinc-800">
                        {renderDetails(item.details)}
                      </span>
                      <Edit3 className="w-3.5 h-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenDetailModal(item)}
                      className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-surface-light hover:bg-zinc-200 border border-dashed border-zinc-300 text-zinc-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary" /> Add Details
                    </button>
                  )}
                </td>

                <td className="py-2.5 px-2">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => onItemChange(item.id, "qty", parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 border border-surface-border rounded-lg text-xs text-center focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium"
                  />
                </td>
                <td className="py-2.5 px-2">
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => onItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-surface-border rounded-lg text-xs text-right focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium"
                  />
                </td>
                <td className="py-2.5 px-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discount}
                    onChange={(e) => onItemChange(item.id, "discount", parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-surface-border rounded-lg text-xs text-center focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium"
                  />
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-primary text-xs">
                  ₦{formatCurrency(item.amount)}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    disabled={items.length === 1}
                    title="Remove Row"
                    className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary-light/50 rounded-lg disabled:opacity-20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        id="addItem"
        aria-label="Add New Item"
        onClick={onAddItem}
        className="flex items-center gap-2 text-xs font-bold text-secondary bg-surface-light hover:bg-zinc-200 border border-surface-border px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
      >
        <Plus className="w-4 h-4 text-primary" /> Add Item
      </button>
    </div>
  );
}