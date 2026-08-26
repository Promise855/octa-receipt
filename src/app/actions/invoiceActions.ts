// src/app/actions/invoiceActions.ts
"use server";

import { dbConnect } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Invoice, { IInvoiceItem, PaymentMode } from "@/models/Invoice";
import { formatOctaInvoiceNumber, numberToNairaWords } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { InvoiceRecord } from "@/type/invoice";

export interface CreateInvoiceInput {
  customerName: string;
  phoneNumber: string;
  rawInvoiceNumber: string; // User input from physical receipt pad (e.g., "1024")
  date: string;
  paymentMode: PaymentMode;
  items: Omit<IInvoiceItem, "amount">[];
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Server Action: Creates a new invoice record in MongoDB Atlas.
 * Enforces physical invoice number validation and customer record syncing.
 */
export async function createInvoiceAction(
  input: CreateInvoiceInput
): Promise<ActionResponse<{ invoiceId: string; invoiceNumber: string }>> {
  try {
    await dbConnect();

    // 1. Basic Field Validations
    if (!input.customerName || !input.phoneNumber || !input.rawInvoiceNumber) {
      return { success: false, error: "Missing required customer or invoice number fields." };
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "At least one item line must be added to the invoice." };
    }

    // 2. Format Physical Invoice Number & Check Duplicate in MongoDB
    const formattedInvoiceNumber = formatOctaInvoiceNumber(input.rawInvoiceNumber);

    if (formattedInvoiceNumber === "OCTA-") {
      return { success: false, error: "Please enter a valid physical invoice number." };
    }

    const existingInvoice = await Invoice.findOne({ invoiceNumber: formattedInvoiceNumber });
    if (existingInvoice) {
      return {
        success: false,
        error: `Invoice number "${formattedInvoiceNumber}" already exists in the database. Please verify your physical receipt.`,
      };
    }

    // 3. Line Items & Aggregate Calculations
    let calculatedSubTotal = 0;
    let calculatedTotal = 0;
    let totalQty = 0;

    const processedItems = input.items.map((item) => {
      const qty = Number(item.qty) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;

      const baseAmount = qty * unitPrice;
      const discountedAmount = baseAmount * (1 - discount / 100);

      calculatedSubTotal += baseAmount;
      calculatedTotal += discountedAmount;
      totalQty += qty;

      return {
        name: item.name.trim(),
        description: item.description?.trim() || "",
        details: item.details?.trim() || "",
        qty,
        unitPrice,
        discount,
        amount: Math.round(discountedAmount * 100) / 100,
      };
    });

    const finalSubTotal = Math.round(calculatedSubTotal * 100) / 100;
    const finalTotal = Math.round(calculatedTotal * 100) / 100;
    const amountWords = numberToNairaWords(finalTotal);

    // 4. Upsert Customer in MongoDB
    const cleanPhone = input.phoneNumber.trim();
    const cleanName = input.customerName.trim();

    let customer = await Customer.findOne({ phoneNumber: cleanPhone });
    if (!customer) {
      customer = await Customer.create({
        name: cleanName,
        phoneNumber: cleanPhone,
      });
    } else if (customer.name !== cleanName) {
      customer.name = cleanName;
      await customer.save();
    }

    // 5. Save New Invoice to MongoDB Atlas
    const newInvoice = await Invoice.create({
      invoiceNumber: formattedInvoiceNumber,
      customerName: cleanName,
      phoneNumber: cleanPhone,
      customerId: customer._id,
      date: new Date(input.date),
      paymentMode: input.paymentMode,
      items: processedItems,
      itemQty: totalQty,
      subTotal: finalSubTotal,
      total: finalTotal,
      amountInWords: amountWords,
      status: "ISSUED",
    });

    revalidatePath("/invoices");
    revalidatePath("/receipts");

    return {
      success: true,
      data: {
        invoiceId: newInvoice._id.toString(),
        invoiceNumber: newInvoice.invoiceNumber,
      },
    };
  } catch (err: unknown) {
    console.error("Error creating invoice:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to save invoice record.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Retrieves a single invoice by MongoDB ID or Invoice Number.
 */
export async function getInvoiceByIdAction(
  idOrNumber: string
): Promise<ActionResponse<InvoiceRecord>> {
  try {
    await dbConnect();

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrNumber);
    const query = isMongoId
      ? { _id: idOrNumber }
      : { invoiceNumber: formatOctaInvoiceNumber(idOrNumber) };

    const invoice = await Invoice.findOne(query).lean();

    if (!invoice) {
      return { success: false, error: "Invoice record not found." };
    }

    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (err: unknown) {
    console.error("Error fetching invoice:", err);
    return { success: false, error: "Failed to load invoice." };
  }
}

/**
 * Server Action: Lists or searches recent receipts.
 */
export async function getInvoicesAction(
  searchQuery?: string
): Promise<ActionResponse<InvoiceRecord[]>> {
  try {
    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (searchQuery && searchQuery.trim() !== "") {
      const regex = new RegExp(searchQuery.trim(), "i");
      filter.$or = [
        { invoiceNumber: regex },
        { customerName: regex },
        { phoneNumber: regex },
      ];
    }

    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(invoices)) };
  } catch (err: unknown) {
    console.error("Error fetching invoices list:", err);
    return { success: false, error: "Failed to retrieve invoice list." };
  }
}