"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight, Copy, Check } from "lucide-react";
import { API_URL } from "@/lib/api";
import { Purchase } from "@/lib/types";
import Spinner from "@/components/ui/Spinner";

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("purchase");

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!purchaseId) {
      router.push("/");
      return;
    }

    fetch(`${API_URL}/api/purchases/${purchaseId}`)
      .then((res) => res.json())
      .then((data) => setPurchase(data.purchase))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [purchaseId, router]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <p className="text-text-secondary">Compra no encontrada</p>
      </div>
    );
  }

  const getWhatsAppLink = () => {
    const phone = "5491112345678";
    const message = encodeURIComponent(
      `Hola! Realice una compra de "${purchase.service?.name}". Mi nombre es ${purchase.customerName}. Quisiera coordinar mi sesion.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <div className="bg-surface-900 pt-24 sm:pt-32 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping opacity-20" />
            <div className="relative w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
              <Check className="text-success" size={36} strokeWidth={3} />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            {purchase.paymentMethod === "WHATSAPP_ONLY"
              ? "Solicitud Enviada"
              : "Compra Realizada"}
          </h1>
          <p className="text-text-secondary text-lg">
            {purchase.paymentMethod === "WHATSAPP_ONLY"
              ? "Pronto nos comunicaremos contigo para coordinar los detalles."
              : "Recibiras un email con los detalles de tu compra."}
          </p>
        </div>

        {/* Order Summary */}
        <div className="card-dark p-6 sm:p-8 mb-6">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
            Resumen de tu compra
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Servicio</span>
              <span className="text-text-primary font-medium">{purchase.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Monto</span>
              <span className="text-accent font-bold text-lg">
                ${Number(purchase.finalPrice).toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Metodo de pago</span>
              <span className="text-text-primary">
                {purchase.paymentMethod === "MERCADOPAGO" && "MercadoPago"}
                {purchase.paymentMethod === "BANK_TRANSFER" && "Transferencia Bancaria"}
                {purchase.paymentMethod === "WHATSAPP_ONLY" && "Contacto por WhatsApp"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Estado</span>
              <span className={`font-medium ${purchase.paymentStatus === "COMPLETED" ? "text-success" : "text-accent"}`}>
                {purchase.paymentStatus === "PENDING" && "Pendiente"}
                {purchase.paymentStatus === "COMPLETED" && "Completada"}
              </span>
            </div>
            <div className="border-t border-surface-600 pt-3 flex justify-between">
              <span className="text-text-secondary">Numero de compra</span>
              <span className="text-text-primary font-mono text-sm">{purchase.id.slice(0, 12)}...</span>
            </div>
          </div>
        </div>

        {/* Bank Transfer Instructions */}
        {purchase.paymentMethod === "BANK_TRANSFER" && (
          <div className="card-dark p-6 sm:p-8 mb-6 border-accent/20">
            <h3 className="font-display text-lg font-semibold text-accent mb-4">
              Datos para la transferencia
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Banco</span>
                <span className="text-text-primary">Banco Nacion</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Titular</span>
                <span className="text-text-primary">Camino Estelar S.R.L.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">CBU</span>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-mono text-sm">0110123432101234567890</span>
                  <button
                    onClick={() => handleCopy("0110123432101234567890")}
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Alias</span>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-mono">CAMINOESTELAR</span>
                  <button
                    onClick={() => handleCopy("CAMINOESTELAR")}
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="border-t border-surface-600 pt-3">
                <p className="text-text-secondary text-sm">
                  Realiza la transferencia por <span className="text-accent font-semibold">${Number(purchase.finalPrice).toLocaleString("es-AR")}</span> y envianos el comprobante por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 text-center"
          >
            <MessageCircle size={20} className="inline mr-2" />
            Abrir WhatsApp
          </a>
          <Link href="/servicios" className="btn-secondary flex-1 text-center">
            Ver mas Servicios
            <ArrowRight size={18} className="inline ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <Spinner size="lg" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
