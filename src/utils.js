// =============================================
// UTILS.JS — Funciones reutilizables
// =============================================

// ID único
export function uid(prefix = "") {
  return prefix + crypto.randomUUID();
}

// Formato moneda
export function money(n) {
  return "$ " + Number(n).toLocaleString("es-AR");
}

// Formato fecha
export function formatDate(d) {
  return new Date(d).toLocaleDateString("es-AR");
}
// UTILS.JS — helpers simples

export function uid(prefix = "") {
  return prefix + crypto.randomUUID();
}
