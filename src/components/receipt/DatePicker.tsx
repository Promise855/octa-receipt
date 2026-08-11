"use client";

import React, { useRef } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export default function DatePicker({ value, onChange, id = "date" }: DatePickerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Select Date";
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return dateString;
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-1.5 relative">
      <label htmlFor={id} className="block text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-primary" /> Date:
      </label>

      <div
        onClick={() => dateInputRef.current?.showPicker?.()}
        className="relative w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-surface-light/50 border border-surface-border rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all text-secondary font-medium hover:bg-surface-light cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{formatDisplayDate(value)}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-secondary transition-colors" />

        <input
          ref={dateInputRef}
          type="date"
          id={id}
          required
          aria-required="true"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
}