"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";

interface TotalsSummaryProps {
  itemQty: number;
  subTotal: number;
  total: number;
  amountInWords: string;
}

export default function TotalsSummary({
  itemQty,
  subTotal,
  total,
  amountInWords,
}: TotalsSummaryProps) {
  return (
    <div id="totals" className="bg-surface-light/70 p-5 rounded-2xl border border-surface-border space-y-2.5 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-surface-border">
        <div>
          <span className="text-xs text-zinc-500 uppercase tracking-wider block font-bold">Item-Qty:</span>
          <span id="itemQty" className="text-base font-semibold text-secondary">{itemQty}</span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 uppercase tracking-wider block font-bold">Sub Total:</span>
          <span className="text-base font-semibold text-secondary">₦<span id="subTotal">{formatCurrency(subTotal)}</span></span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 uppercase tracking-wider block font-bold">Grand Total:</span>
          <span className="text-lg font-black text-primary">₦<span id="total">{formatCurrency(total)}</span></span>
        </div>
      </div>
      <div>
        <span className="text-xs text-zinc-500 uppercase tracking-wider block font-bold mb-0.5">Amount In Words:</span>
        <span id="amountInWords" className="text-xs italic font-semibold text-zinc-700 bg-white px-3 py-1.5 rounded-lg border border-surface-border block">
          {amountInWords}
        </span>
      </div>
    </div>
  );
}