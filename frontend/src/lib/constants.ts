export const WHATSAPP_PHONE = "5491112345678";

export const BANK_TRANSFER_DETAILS = {
  bankName: "Banco Nacion",
  accountHolder: "Camino Estelar S.R.L.",
  cbu: "0110123432101234567890",
  alias: "CAMINOESTELAR",
} as const;

export const NAV_LINKS = [
  { href: "/servicios", label: "Servicios" },
] as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MERCADOPAGO: "MercadoPago",
  BANK_TRANSFER: "Transferencia",
  WHATSAPP_ONLY: "WhatsApp",
};

export const PAYMENT_STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
  PENDING: { label: "Pendiente", variant: "warning" },
  COMPLETED: { label: "Completada", variant: "success" },
  FAILED: { label: "Fallida", variant: "error" },
  CANCELLED: { label: "Cancelada", variant: "default" },
};
