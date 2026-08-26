export interface InvoiceItem {
  _id?: string;
  name: string;
  description?: string;
  details?: string;
  qty: number;
  unitPrice: number;
  discount?: number;
}

export interface InvoiceRecord {
  _id: string;
  customerName?: string;
  phoneNumber?: string;
  invoiceNumber?: string;
  date?: string;
  paymentMode?: string;
  items?: InvoiceItem[];
  createdAt?: string;
}