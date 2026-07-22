export function isValidBarcode(barcode: string): boolean {
  const value = barcode.trim();

  if (!value) return false;

  // Digits only
  if (!/^\d+$/.test(value)) {
    return false;
  }

  // Supported barcode lengths
  return [8, 12, 13, 14].includes(value.length);
}

export function barcodeType(barcode: string): string {
  switch (barcode.length) {
    case 8:
      return "EAN-8";

    case 12:
      return "UPC-A";

    case 13:
      return "EAN-13";

    case 14:
      return "GTIN-14";

    default:
      return "Unknown";
  }
}