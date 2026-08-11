// src/models/Invoice.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IInvoiceItem {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  details?: string;
  qty: number;
  unitPrice: number;
  discount: number; // Percentage discount (e.g. 10 for 10%)
  amount: number;   // Calculated: Qty * Unit Price * (1 - Discount / 100)
}

export type PaymentMode = "Bank Transfer" | "Cash" | "Card Payment" | "Not Paid";

export interface IInvoice extends Document {
  invoiceNumber: string;
  customerName: string;
  phoneNumber: string;
  customerId?: Types.ObjectId;
  date: Date;
  paymentMode: PaymentMode;
  items: IInvoiceItem[];
  itemQty: number;      // Aggregated item count
  subTotal: number;     // Total before discounts
  total: number;        // Final total amount
  amountInWords: string;
  status: "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  details: {
    type: String,
    trim: true,
    default: "",
  },
  qty: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: [0, "Unit price cannot be negative"],
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    date: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: Date.now,
    },
    paymentMode: {
      type: String,
      enum: ["Bank Transfer", "Cash", "Card Payment", "Not Paid"],
      required: [true, "Payment mode is required"],
      default: "Bank Transfer",
    },
    items: {
      type: [InvoiceItemSchema],
      validate: [
        (val: IInvoiceItem[]) => val.length > 0,
        "An invoice must have at least one item",
      ],
    },
    itemQty: {
      type: Number,
      required: true,
      default: 0,
    },
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    amountInWords: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "ISSUED", "PAID", "CANCELLED"],
      default: "ISSUED",
    },
  },
  {
    timestamps: true,
  }
);

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;