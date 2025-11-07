export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

export function formatKwh(value: number): string {
  if (value >= 1000000) {
    return `${formatNumber(value / 1000000, 1)} GWh`;
  }
  if (value >= 1000) {
    return `${formatNumber(value / 1000, 1)} MWh`;
  }
  return `${formatNumber(value, 0)} kWh`;
}

export function formatCO2(value: number): string {
  if (value >= 1000) {
    return `${formatNumber(value / 1000, 2)} tons`;
  }
  return `${formatNumber(value, 0)} kg`;
}

export function formatCII(value: number): string {
  return formatNumber(value, 1);
}

export function formatDelta(value: number, isPercent: boolean = false): { text: string; isPositive: boolean } {
  const isPositive = value > 0;
  const formatted = isPercent ? formatPercent(Math.abs(value)) : formatNumber(Math.abs(value), 1);
  return {
    text: `${isPositive ? "+" : "-"}${formatted}`,
    isPositive,
  };
}

export function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}${period}`;
}
