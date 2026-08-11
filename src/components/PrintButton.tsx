// src/components/PrintButton.tsx
"use client";

import React from "react";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  className?: string;
}

export default function PrintButton({ className }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ||
        "flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow transition-all text-xs uppercase tracking-wider cursor-pointer print:hidden"
      }
    >
      <Printer className="w-4 h-4" /> Print / Download PDF
    </button>
  );
}