"use client";

import React, { useState } from "react";
import { CreditCard, Landmark, Banknote, AlertCircle, ChevronDown, Check } from "lucide-react";
import { PaymentMode } from "@/models/Invoice";

const PAYMENT_MODES: { value: PaymentMode; label: string; icon: React.ElementType }[] = [
  { value: "Bank Transfer", label: "Bank Transfer", icon: Landmark },
  { value: "Cash", label: "Cash", icon: Banknote },
  { value: "Card Payment", label: "Card Payment", icon: CreditCard },
  { value: "Not Paid", label: "Not Paid", icon: AlertCircle },
];

interface PaymentModeSelectProps {
  value: PaymentMode;
  onChange: (value: PaymentMode) => void;
}

export default function PaymentModeSelect({ value, onChange }: PaymentModeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedConfig = PAYMENT_MODES.find((p) => p.value === value) || PAYMENT_MODES[0];
  const SelectedIcon = selectedConfig.icon;

  return (
    <div className="md:col-span-2 space-y-1.5 relative">
      <label htmlFor="paymentMode" className="block text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
        <CreditCard className="w-3.5 h-3.5 text-primary" /> Payment Mode:
      </label>

      <button
        type="button"
        id="paymentMode"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-secondary font-medium hover:bg-surface-light cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <SelectedIcon className="w-4 h-4 text-primary" />
          <span>{selectedConfig.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-surface-border rounded-xl shadow-xl z-20 py-1.5 overflow-hidden transition-all duration-150 animate-in fade-in-50 zoom-in-95">
          {PAYMENT_MODES.map((option) => {
            const OptionIcon = option.icon;
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-secondary hover:bg-surface-light hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <OptionIcon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-zinc-500"}`} />
                  <span>{option.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}