"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";

export interface DetailModalState {
  id: string;
  modelNo: string;
  serialNo: string;
  imei1: string;
  imei2: string;
}

interface DeviceDetailsModalProps {
  initialData: DetailModalState | null;
  onClose: () => void;
  onSave: (data: DetailModalState) => void;
}

export default function DeviceDetailsModal({ initialData, onClose, onSave }: DeviceDetailsModalProps) {
  const [formData, setFormData] = useState<DetailModalState>({
    id: "",
    modelNo: "",
    serialNo: "",
    imei1: "",
    imei2: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  if (!initialData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-md w-full overflow-hidden transition-all">
        <div className="bg-secondary text-white p-4 flex justify-between items-center border-b-2 border-primary">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Set Device Identifiers</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-secondary uppercase mb-1">Model No:</label>
            <input
              type="text"
              value={formData.modelNo}
              onChange={(e) => setFormData((prev) => ({ ...prev, modelNo: e.target.value }))}
              placeholder="e.g. MacBook Pro M2 / iPhone 14 Pro"
              className="w-full p-2.5 bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-secondary font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-secondary uppercase mb-1">Serial Number (S/N):</label>
            <input
              type="text"
              value={formData.serialNo}
              onChange={(e) => setFormData((prev) => ({ ...prev, serialNo: e.target.value }))}
              placeholder="e.g. C02XL1234567"
              className="w-full p-2.5 bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-secondary font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-secondary uppercase mb-1">IMEI 1:</label>
            <input
              type="text"
              value={formData.imei1}
              onChange={(e) => setFormData((prev) => ({ ...prev, imei1: e.target.value }))}
              placeholder="e.g. 358291000000000"
              className="w-full p-2.5 bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-secondary font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-secondary uppercase mb-1">IMEI 2:</label>
            <input
              type="text"
              value={formData.imei2}
              onChange={(e) => setFormData((prev) => ({ ...prev, imei2: e.target.value }))}
              placeholder="e.g. 358291000000001"
              className="w-full p-2.5 bg-surface-light/50 border border-surface-border rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-secondary font-medium"
            />
          </div>
        </div>

        <div className="p-4 bg-surface-light border-t border-surface-border flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-zinc-100 text-secondary font-bold text-xs rounded-xl border border-surface-border transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Save Details
          </button>
        </div>
      </div>
    </div>
  );
}