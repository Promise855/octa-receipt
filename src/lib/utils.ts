// src/lib/utils.ts

/**
 * Formats user input from physical receipt pads to enforce the standard "OCTA-" prefix.
 * Examples:
 *   "1024"      -> "OCTA-1024"
 *   "octa-0045" -> "OCTA-0045"
 *   "OCTA-789"  -> "OCTA-789"
 */
export function formatOctaInvoiceNumber(input: string): string {
  if (!input) return "OCTA-";
  const trimmed = input.trim();
  if (trimmed.toUpperCase().startsWith("OCTA-")) {
    return `OCTA-${trimmed.slice(5).trim()}`;
  }
  return `OCTA-${trimmed}`;
}

/**
 * Formats numbers into Nigerian Naira standard currency format.
 * Example: 250000 -> "250,000.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Converts numeric currency amounts into written Naira words for print compliance.
 * Example: 150000 -> "One Hundred and Fifty Thousand Naira Only"
 */
const UNITS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const TEENS = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertHundreds(num: number): string {
  let str = "";
  if (num >= 100) {
    str += UNITS[Math.floor(num / 100)] + " Hundred";
    num %= 100;
    if (num > 0) str += " and ";
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) str += "-" + UNITS[num];
  } else if (num >= 10) {
    str += TEENS[num - 10];
  } else if (num > 0) {
    str += UNITS[num];
  }
  return str;
}

export function numberToNairaWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return "Zero Naira Only";

  const rounded = Math.floor(Math.abs(amount));
  if (rounded === 0) return "Zero Naira Only";

  const billions = Math.floor(rounded / 1000000000);
  const millions = Math.floor((rounded % 1000000000) / 1000000);
  const thousands = Math.floor((rounded % 1000000) / 1000);
  const remainder = rounded % 1000;

  let words = "";
  if (billions > 0) words += convertHundreds(billions) + " Billion ";
  if (millions > 0) words += convertHundreds(millions) + " Million ";
  if (thousands > 0) words += convertHundreds(thousands) + " Thousand ";
  if (remainder > 0) {
    if (words !== "" && remainder < 100) words += "and ";
    words += convertHundreds(remainder);
  }

  return `${words.trim()} Naira Only`;
}