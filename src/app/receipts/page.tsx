// src/app/receipts/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Receipt, 
  Search, 
  Plus, 
  Eye, 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Hash, 
  User, 
  Phone,
  FileSpreadsheet
} from "lucide-react";
import { getInvoicesAction } from "@/app/actions/invoiceActions";
import { formatCurrency } from "@/lib/utils";

interface InvoiceItem {
  _id?: string;
  name: string;
  description?: string;
  details?: string;
  qty: number;
  unitPrice: number;
  discount?: number;
}

interface InvoiceRecord {
  _id: string;
  customerName?: string;
  phoneNumber?: string;
  invoiceNumber?: string;
  date?: string;
  paymentMode?: string;
  items?: InvoiceItem[];
  createdAt?: string;
}

export default function PastReceiptsPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMode, setSelectedMode] = useState<string>("ALL");

  useEffect(() => {
    async function loadInvoices() {
      setIsLoading(true);
      const res = await getInvoicesAction();
      if (res.success && res.data) {
        setInvoices(res.data);
      } else {
        setErrorMessage(res.error || "Failed to load past receipts.");
      }
      setIsLoading(false);
    }

    loadInvoices();
  }, []);

  // Calculate total for a single invoice's items safely
  const calculateTotal = (items: InvoiceItem[] = []) => {
    return items.reduce((acc, item) => {
      const qty = Number(item.qty) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;
      const net = qty * unitPrice * (1 - discount / 100);
      return acc + net;
    }, 0);
  };

  // Safe search filtering
  const filteredInvoices = invoices.filter((inv) => {
    const customerName = inv.customerName || "";
    const phoneNumber = inv.phoneNumber || "";
    const invoiceNumber = inv.invoiceNumber || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phoneNumber.includes(searchTerm) ||
      invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMode =
      selectedMode === "ALL" || (inv.paymentMode || "").toUpperCase() === selectedMode.toUpperCase();

    return matchesSearch && matchesMode;
  });

  // Calculate total sales revenue across all receipts (Declared BEFORE return statement)
  const grandRevenueTotal = invoices.reduce(
    (acc, inv) => acc + calculateTotal(inv.items || []),
    0
  );

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-surface-border shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary">Past Receipts Records</h1>
            <p className="text-xs text-zinc-500 font-medium">
              View, search, and access generated invoice histories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-light hover:bg-zinc-200 border border-surface-border text-secondary font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-primary" /> Back to Generator
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Receipt
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-500 uppercase">Total Issued</span>
            <p className="text-2xl font-black text-secondary">{invoices.length}</p>
          </div>
          <FileSpreadsheet className="w-8 h-8 text-primary/40" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-500 uppercase">Total Sales Value</span>
            <p className="text-2xl font-black text-primary">₦{formatCurrency(grandRevenueTotal)}</p>
          </div>
          <Receipt className="w-8 h-8 text-primary/40" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-500 uppercase">Filtered Records</span>
            <p className="text-2xl font-black text-secondary">{filteredInvoices.length}</p>
          </div>
          <Search className="w-8 h-8 text-primary/40" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, phone, or invoice no..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-secondary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-zinc-500 uppercase shrink-0">Payment:</span>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-xs bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold text-secondary cursor-pointer"
          >
            <option value="ALL">All Modes</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Card Payment">Card Payment</option>
            <option value="Not Paid">Not Paid</option>
          </select>
        </div>
      </div>

      {/* Receipts Table Container */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs font-bold text-zinc-500 uppercase">Loading receipts database...</p>
          </div>
        ) : errorMessage ? (
          <div className="p-8 text-center text-red-500 font-bold text-sm">
            {errorMessage}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-sm font-bold text-secondary">No receipts found</h3>
            <p className="text-xs text-zinc-500">
              {searchTerm || selectedMode !== "ALL"
                ? "Try adjusting your search query or payment mode filter."
                : "Generate your first receipt to see it listed here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-secondary text-white font-semibold">
                  <th className="py-3.5 px-4 min-w-30">Invoice No</th>
                  <th className="py-3.5 px-4 min-w-40">Customer Name</th>
                  <th className="py-3.5 px-4 min-w-32.5">Phone Number</th>
                  <th className="py-3.5 px-4 min-w-27.5">Date</th>
                  <th className="py-3.5 px-4 min-w-32.5">Payment Mode</th>
                  <th className="py-3.5 px-4 text-right min-w-30">Grand Total</th>
                  <th className="py-3.5 px-4 text-center min-w-25">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border bg-white">
                {filteredInvoices.map((inv) => {
                  const invTotal = calculateTotal(inv.items || []);
                  const rawNo = inv.invoiceNumber || "";
                  const formattedNo = rawNo
                    ? rawNo.startsWith("OCTA-")
                      ? rawNo
                      : `OCTA-${rawNo}`
                    : "OCTA-N/A";

                  return (
                    <tr key={inv._id} className="hover:bg-surface-light/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{formattedNo}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-zinc-800">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{inv.customerName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{inv.phoneNumber || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{inv.date || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-light text-secondary border border-surface-border">
                          <CreditCard className="w-3 h-3 text-primary" />
                          {inv.paymentMode || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-primary">
                        ₦{formatCurrency(invTotal)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/receipts/${inv._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}