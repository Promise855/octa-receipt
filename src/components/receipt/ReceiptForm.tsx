// src/components/receipt/ReceiptForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, Loader2, Receipt, User, Phone, Hash, History } from "lucide-react";

import DatePicker from "./DatePicker";
import PaymentModeSelect from "./PaymentModeSelect";
import LineItemsTable, { ItemRow } from "./LineItemsTable";
import TotalsSummary from "./TotalsSummary";
import DeviceDetailsModal, { DetailModalState } from "./DeviceDetailsModal";

import { formatOctaInvoiceNumber, numberToNairaWords } from "@/lib/utils";
import { createInvoiceAction } from "@/app/actions/invoiceActions";
import { PaymentMode } from "@/models/Invoice";

export default function ReceiptForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Bank Transfer");
  
  const [items, setItems] = useState<ItemRow[]>([
    {
      id: "item-1",
      name: "",
      description: "",
      details: "",
      modelNo: "",
      serialNo: "",
      imei1: "",
      imei2: "",
      qty: 1,
      unitPrice: 0,
      discount: 0,
      amount: 0,
    },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null);

  const formattedInvoiceNumber = formatOctaInvoiceNumber(invoiceNumber);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: "",
        description: "",
        details: "",
        modelNo: "",
        serialNo: "",
        imei1: "",
        imei2: "",
        qty: 1,
        unitPrice: 0,
        discount: 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof Omit<ItemRow, "id" | "amount">,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        const qty = Number(updated.qty) || 0;
        const unitPrice = Number(updated.unitPrice) || 0;
        const discount = Number(updated.discount) || 0;

        const baseAmount = qty * unitPrice;
        const netAmount = baseAmount * (1 - discount / 100);

        return {
          ...updated,
          amount: Math.round(netAmount * 100) / 100,
        };
      })
    );
  };

  const handleOpenDetailModal = (item: ItemRow) => {
    setDetailModal({
      id: item.id,
      modelNo: item.modelNo || "",
      serialNo: item.serialNo || "",
      imei1: item.imei1 || "",
      imei2: item.imei2 || "",
    });
  };

  const handleSaveModalDetails = (updatedData: DetailModalState) => {
    const parts = [];
    if (updatedData.modelNo.trim()) parts.push(`Model: ${updatedData.modelNo.trim()}`);
    if (updatedData.serialNo.trim()) parts.push(`S/N: ${updatedData.serialNo.trim()}`);
    if (updatedData.imei1.trim()) parts.push(`IMEI1: ${updatedData.imei1.trim()}`);
    if (updatedData.imei2.trim()) parts.push(`IMEI2: ${updatedData.imei2.trim()}`);

    const formattedString = parts.join(" \n ");

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== updatedData.id) return item;
        return {
          ...item,
          modelNo: updatedData.modelNo,
          serialNo: updatedData.serialNo,
          imei1: updatedData.imei1,
          imei2: updatedData.imei2,
          details: formattedString,
        };
      })
    );

    setDetailModal(null);
  };

  const itemQty = items.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
  const subTotal = items.reduce(
    (acc, curr) => acc + (Number(curr.qty) || 0) * (Number(curr.unitPrice) || 0),
    0
  );
  const total = items.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const amountInWords = numberToNairaWords(total);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !phoneNumber.trim()) {
      setErrorMessage("Please enter customer name and phone number.");
      return;
    }

    if (!invoiceNumber.trim() || formattedInvoiceNumber === "OCTA-") {
      setErrorMessage("Please enter a valid invoice number.");
      return;
    }

    if (items.some((item) => !item.name.trim())) {
      setErrorMessage("Please provide item names for all rows.");
      return;
    }

    startTransition(async () => {
      const res = await createInvoiceAction({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        rawInvoiceNumber: invoiceNumber.trim(),
        date,
        paymentMode,
        items: items.map(({ name, description, details, qty, unitPrice, discount }) => ({
          name,
          description,
          details,
          qty,
          unitPrice,
          discount,
        })),
      });

      if (res.success && res.data) {
        router.push(`/receipts/${res.data.invoiceId}`);
      } else {
        setErrorMessage(res.error || "Failed to generate receipt.");
      }
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-4">
      <form
        id="receiptForm"
        aria-label="Receipt Generator Form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-secondary-card shadow-xl overflow-hidden space-y-6"
      >
        <div className="bg-secondary text-white p-6 flex items-center justify-between border-b-4 border-primary">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl border border-secondary/30">
              <Image
                src="/img/Octa-logo.png"
                alt="Octavian Dynamics Logo"
                width={62}
                height={62}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Receipt Details</h2>
              <p className="text-xs text-zinc-400">Octavian Dynamics Receipt Generation Terminal</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">
            OCTA Admin
          </span>
        </div>

        <div className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border-l-4 border-primary text-primary rounded-r-lg text-sm font-medium flex items-center gap-2">
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="customerName" className="block text-xs font-bold text-secondary uppercase tracking-wider items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" /> Customer Name:
              </label>
              <input
                type="text"
                id="customerName"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-secondary font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phoneNumber" className="block text-xs font-bold text-secondary uppercase tracking-wider items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number:
              </label>
              <input
                type="text"
                id="phoneNumber"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +2349155743615"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-secondary font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invoiceNumber" className="block text-xs font-bold text-secondary uppercase tracking-wider items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-primary" /> INVOICE NO:
              </label>
              <div className="flex rounded-xl overflow-hidden border border-surface-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <span className="inline-flex items-center px-3.5 text-xs font-bold bg-secondary text-white border-r border-secondary">
                  OCTA-
                </span>
                <input
                  type="text"
                  id="invoiceNumber"
                  required
                  value={invoiceNumber.replace(/^OCTA-/i, "")}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. 1024"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-light/50 focus:bg-white outline-none text-secondary font-medium"
                />
              </div>
            </div>

            <DatePicker value={date} onChange={setDate} />
            <PaymentModeSelect value={paymentMode} onChange={setPaymentMode} />
          </div>

          <LineItemsTable
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
            onOpenDetailModal={handleOpenDetailModal}
          />

          <TotalsSummary
            itemQty={itemQty}
            subTotal={subTotal}
            total={total}
            amountInWords={amountInWords}
          />

          {/* Action Buttons Section */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/receipts")}
              className="sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-light hover:bg-zinc-200 border border-surface-border text-secondary font-bold rounded-xl shadow-sm hover:shadow transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              <History className="w-5 h-5 text-primary" /> Past Receipts
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 text-sm uppercase tracking-wider cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating Receipt...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Generate Receipt
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <DeviceDetailsModal
        initialData={detailModal}
        onClose={() => setDetailModal(null)}
        onSave={handleSaveModalDetails}
      />
    </div>
  );
}