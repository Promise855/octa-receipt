// src/app/receipts/[id]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoiceByIdAction } from "@/app/actions/invoiceActions";
import { formatCurrency } from "@/lib/utils";
import PrintButton from "../../../components/PrintButton";

interface InvoiceItem {
  name: string;
  description?: string;
  details?: string;
  qty: number;
  unitPrice: number;
  discount: number;
  amount: number;
}

interface Invoice {
  invoiceNumber: string;
  customerName: string;
  phoneNumber: string;
  date: string;
  items: InvoiceItem[];
  itemQty: number;
  subTotal: number;
  paymentMode: string;
  total: number;
  amountInWords: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReceiptPage({ params }: PageProps) {
  const { id } = await params;
  const response = await getInvoiceByIdAction(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const invoice = response.data as Invoice;
  const formattedDate = new Date(invoice.date).toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 print:p-0 print:bg-white">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center no-print">
        <Link
          href="/"
          className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1"
        >
          ← Create Another Receipt
        </Link>
        <PrintButton />
      </div>

      {/* Printable Receipt Container matching receipt.html */}
      <div className="container bg-white text-secondary p-8 rounded-lg border border-surface-border shadow-lg font-sans max-w-7xl mx-auto space-y-6 print:shadow-none print:border-none print:p-0">
        <header className="header flex flex-col justify-center items-center pb-4 gap-4">
          <Image
            src="/img/Octa-logo.png"
            alt="Octavian Dynamics Logo"
            aria-label="Company Logo"
            width={180}
            height={60}
            className="hero object-contain"
            priority
          />
          <div className="contact-info text-sm text-center space-y-1 text-gray-700 font-semibold">
            <p>17 Chief Benjamin Wopara Plaza, Ogbum Nagbali, Eastern Bypass, Port Harcourt, Rivers State.</p>
            <p className="text-sm">
              <a target="_blank" href="https://wa.me/+2349155743615" aria-label="WhatsApp Contact" className=" hover:underline">
                +234 915 574 3615
              </a>{" "}
              |{" "}
              <a href="mailto:octaviandynamics@gmail.com" aria-label="Email Contact" className="hover:underline">
                octaviandynamics@gmail.com
              </a>{" "}
              |{" "}
              <a href="mailto:contact@Octaviandynamics.com" className="hover:underline">
                contact@Octaviandynamics.com
              </a>
            </p>
          </div>
        </header>

        <div className="invoice-container grid grid-cols-1 md:grid-cols-2 justify-between items-center bg-surface-light p-4 rounded-md border border-surface-border text-sm print:bg-transparent print:border-b print:rounded-none">
          <div className="customer-details space-y-1">
            <p>Name: <span id="customerName" aria-label="Customer Name" className="font-semibold">{invoice.customerName}</span></p>
            <p>Phone Number: <span id="phoneNumber" aria-label="Customer Phone Number" className="font-semibold">{invoice.phoneNumber}</span></p>
          </div> 
          <div className="invoice-details space-y-1 text-left md:text-right mt-2 md:mt-0">
            <h1 className="text-lg font-bold text-primary">
              INVOICE No: <span id="invoiceNumber" aria-label="Invoice Number" className="text-secondary ">{invoice.invoiceNumber}</span>
            </h1>
            <p>Date: <span id="date" aria-label="Invoice Date" className="font-semibold">{formattedDate}</span></p>
          </div>
        </div>

        <section className="items-table overflow-x-auto">
          <div className="table-wrapper">
            <table aria-label="Invoice Items Table" className="w-full border-collapse border border-surface-border text-sm text-left">
              <thead>
                <tr className="bg-secondary text-white print:bg-gray-200 print:text-black">
                  <th className="p-2 border border-surface-border text-center w-8">S/N</th>
                  <th className="p-2 border border-surface-border text-center">Name</th>
                  <th className="p-2 border border-surface-border text-center">Item Description</th>
                  <th className="p-2 border border-surface-border text-center">Item Details</th>
                  <th className="p-2 border border-surface-border text-center w-12">Qty</th>
                  <th className="p-2 border border-surface-border text-center">(₦) Unit Price</th>
                  <th className="p-2 border border-surface-border text-center w-12">Discount (%)</th>
                  <th className="p-2 border border-surface-border text-center">Amount</th>
                </tr>
              </thead>
              <tbody id="itemRows">
                {invoice.items.map((item: { name: string; description?: string; details?: string; qty: number; unitPrice: number; discount: number; amount: number }, index: number) => (
                  <tr key={index} className="even:bg-surface-light print:even:bg-transparent">
                    <td className="p-2 border border-surface-border text-center font-bold">{index + 1}</td>
                    <td className="p-2 border border-surface-border font-medium">{item.name}</td>
                    <td className="p-2 border border-surface-border ">{item.description || "—"}</td>
                    <td className="p-2 border border-surface-border text-center whitespace-pre-line">{item.details || "—"}</td>
                    <td className="p-2 border border-surface-border text-center">{item.qty}</td>
                    <td className="p-2 border border-surface-border text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-2 border border-surface-border text-center">{item.discount}%</td>
                    <td className="p-2 border border-surface-border text-right font-bold text-primary print:text-black">
                      ₦{formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="totals-section bg-surface-light p-4 rounded-md border border-surface-border text-sm print:bg-transparent print:border-none print:p-0 space-y-2 ml-auto w-full md:w-1/2">
            <div className="totals-details grid grid-cols-1 gap-2">
                <p className="text-right">Item-Qty: <span id="itemQty" aria-label="Total Item Quantity" className="font-semibold">{invoice.itemQty}</span></p>
                <p className="text-right">Sub Total: ₦<span id="subTotal" aria-label="Sub Total" className="font-semibold">{formatCurrency(invoice.subTotal)}</span></p>
            </div>
            <div className="grid grid-cols-1 gap-2 border-t border-surface-border pt-2">
                <p className="text-right">Payment Mode: <span id="paymentMode" aria-label="Payment Mode" className="font-semibold text-primary print:text-black">{invoice.paymentMode}</span></p>
                <p className="text-right text-base font-bold text-primary print:text-black">
                Total: ₦<span id="total" aria-label="Total Amount">{formatCurrency(invoice.total)}</span>
                </p>
            </div>
            <p className="border-t border-surface-border pt-2 text-sm text-right">
                Amount In Words: <span id="amountInWords" aria-label="Amount in Words" className="italic font-medium">{invoice.amountInWords}</span>
            </p>
        </div>

        <div className="terms-section pt-4 text-sm space-y-3 text-gray-800 print:break-before-page">
          <h2 className="font-bold text-lg uppercase text-center text-secondary">Terms & Conditions</h2>
          <p className="text-justify leading-relaxed text-sm">
            New devices procured from OCTAVIAN DYNAMICS ENTERPRISES LTD fall under standard manufacturers warranty & conditions and are redeemable at manufacturer’s warranty/service centres in Nigeria.
          </p>
          <ol type="i" className="list-[lower-roman] pl-5 space-y-1.5 leading-relaxed text-justify">
            <li>All product and after-sales issues should be forwarded to manufacturers’ warranty centres for new devices or OCTAVIAN DYNAMICS ENTERPRISES LTD after-sales department for pre-owned devices.</li>
            <li>Ensure you retain the original packaging of the gadget as well as the customer pickup document as you will be required to produce these for warranty or exchange purposes.</li>
            <li>Prior to utilizing your device/gadget, it is advisable to first charge the battery for a given time period stipulated by the manufacturer. This will elongate the battery life.</li>
            <li>Warranty provided by the manufacturer does not cover non-mechanical, physical damage or liquid caused by negligent use of the device/gadget.</li>
            <li>In the event that your device has a manufacturer fault and this is identified at the place and time of purchase, the devices can be returned for replacement.</li>
            <li>Unless otherwise stated, manufacturer warranty cover over 1 (1) year for new devices and battery utilized in conjunction with the device has a warranty cover of 6 months (depending on make and model) from date of purchase. Warranty provision can be found on the reverse of the invoice. By signing this document you acknowledge that you read and understood the terms and conditions on the reverse of the invoice and you accept them.</li>
            <li>OCTAVIAN DYNAMICS ENTERPRISES LTD offers 14days warranty on all UK used devices.</li> 
            <li>Should you experience any problem with your devices you may either take it to the manufacturers closest technical service center or OCTAVIAN DYNAMICS ENTERPRISES LTD repair outlet for used devices.</li>
          </ol>
          <p className="partner-text font-bold text-center text-primary tracking-wide italic pt-2 print:text-black">Our Partner in Tech Excellence</p>
          <p className="thank-you-text text-center text-secondary font-semibold italic">Thank you for contributing to the future!</p>
        </div>
      </div>
    </main>
  );
}