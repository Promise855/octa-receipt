// src/app/page.tsx
import ReceiptForm from "@/components/receipt/ReceiptForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary-card py-8 px-4">
      <ReceiptForm />
    </main>
  );
}