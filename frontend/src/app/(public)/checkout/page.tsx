"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, MessageCircle, CreditCard, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getService, validateCoupon, createPurchase } from "@/lib/api";
import { Service } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    couponCode: "",
    paymentMethod: "MERCADOPAGO",
  });

  const [couponResult, setCouponResult] = useState<{
    valid: boolean;
    discount?: number;
  } | null>(null);

  useEffect(() => {
    if (!serviceId) {
      router.push("/servicios");
      return;
    }

    getService(serviceId)
      .then(setService)
      .catch(() => setError("Servicio no encontrado"))
      .finally(() => setLoading(false));
  }, [serviceId, router]);

  const handleValidateCoupon = async () => {
    if (!formData.couponCode || !serviceId) return;
    setCouponLoading(true);
    try {
      const result = await validateCoupon(formData.couponCode, serviceId);
      setCouponResult(result);
    } catch {
      setCouponResult({ valid: false });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await createPurchase({
        serviceId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        couponCode: couponResult?.valid ? formData.couponCode : undefined,
        paymentMethod: formData.paymentMethod,
      });

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        router.push(`/confirmacion?purchase=${result.purchase.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar la compra");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <p className="text-text-secondary">Servicio no encontrado</p>
      </div>
    );
  }

  const discount = couponResult?.valid ? couponResult.discount || 0 : 0;
  const finalPrice = Number(service.price) - discount;

  return (
    <div className="bg-surface-900 pt-24 sm:pt-32 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-surface-900 font-bold text-sm">
              1
            </div>
            <span className="text-accent font-medium text-sm sm:text-base">Detalles</span>
          </div>
          <div className="w-8 sm:w-16 h-px bg-surface-600" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-text-muted font-bold text-sm">
              2
            </div>
            <span className="text-text-muted text-sm sm:text-base">Pago</span>
          </div>
          <div className="w-8 sm:w-16 h-px bg-surface-600" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-text-muted font-bold text-sm">
              3
            </div>
            <span className="text-text-muted text-sm sm:text-base">Listo</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1">
            <Link
              href={`/servicio/${service.id}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Volver al servicio
            </Link>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-8">
              Finalizar Compra
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="card-dark p-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                  Datos de Contacto
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Nombre completo"
                    required
                    placeholder="Tu nombre"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                  />
                  <Input
                    label="Telefono (opcional)"
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Coupon */}
              <div className="card-dark p-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                  Codigo de Descuento
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ingresa tu codigo"
                    value={formData.couponCode}
                    onChange={(e) =>
                      setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })
                    }
                    className="input-dark flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleValidateCoupon}
                    loading={couponLoading}
                  >
                    Aplicar
                  </Button>
                </div>
                {couponResult && (
                  <p className={`mt-3 text-sm ${couponResult.valid ? "text-success" : "text-error"}`}>
                    {couponResult.valid
                      ? `Descuento aplicado: -$${discount.toLocaleString("es-AR")}`
                      : "Codigo invalido o expirado"}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="card-dark p-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-4">
                  Metodo de Pago
                </h2>
                <div className="space-y-3">
                  {[
                    { value: "MERCADOPAGO", label: "MercadoPago", desc: "Tarjeta de credito, debito o efectivo", icon: <CreditCard size={20} /> },
                    { value: "BANK_TRANSFER", label: "Transferencia Bancaria", desc: "Envianos el comprobante por WhatsApp", icon: <Building2 size={20} /> },
                    { value: "WHATSAPP_ONLY", label: "Contactar por WhatsApp", desc: "Coordina los detalles sin pagar ahora", icon: <MessageCircle size={20} /> },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        formData.paymentMethod === method.value
                          ? "border-accent bg-accent/5"
                          : "border-surface-600 hover:border-surface-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.paymentMethod === method.value ? "bg-accent/20 text-accent" : "bg-surface-700 text-text-muted"
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-text-primary">{method.label}</span>
                        <p className="text-text-muted text-sm">{method.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.paymentMethod === method.value ? "border-accent" : "border-surface-500"
                      }`}>
                        {formData.paymentMethod === method.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/30 text-error p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={submitting}
                className="w-full text-lg py-4"
              >
                {submitting ? "Procesando..." : "Confirmar Compra"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="card-dark p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
                Resumen
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">{service.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary">${Number(service.price).toLocaleString("es-AR")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Descuento</span>
                    <span className="text-success">-${discount.toLocaleString("es-AR")}</span>
                  </div>
                )}
                <div className="border-t border-surface-600 pt-3 flex justify-between">
                  <span className="font-semibold text-text-primary">Total</span>
                  <span className="text-xl font-bold text-accent">${finalPrice.toLocaleString("es-AR")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <CheckCircle size={14} />
                <span>Sesion de {service.duration} minutos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <Spinner size="lg" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
