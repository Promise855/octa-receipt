// src/type/invoice.ts
export interface InvoiceItem {
  _id?: string;
  name: string;
  description?: string;
  details?: string;
  qty: number;
  unitPrice: number;
  discount: number;
  amount?: number;
}

export interface InvoiceRecord {
  _id: string;
  invoiceNumber?: string;
  customerName?: string;
  phoneNumber?: string;
  date?: string;
  paymentMode?: string;
  items?: InvoiceItem[];
  itemQty?: number;
  subTotal?: number;
  total?: number;
  amountInWords?: string;
  createdAt?: string;
}