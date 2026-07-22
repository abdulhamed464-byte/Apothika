export function generateSKU(
  category: string,
  brand: string
): string {

  const cat = category
    ? category.substring(0, 3).toUpperCase()
    : "GEN";

  const br = brand
    ? brand.substring(0, 3).toUpperCase()
    : "PRD";

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `${cat}-${br}-${random}`;
}