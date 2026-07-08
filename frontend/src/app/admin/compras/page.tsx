"use client";

import { useEffect, useState } from "react";
import { Purchase } from "@/lib/types";
import { getAdminPurchases, updatePurchaseStatus } from "@/lib/api";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPurchases(); }, []);

  const fetchPurchases = async () => {
    try {
      const data = await getAdminPurchases();
      setPurchases(data);
    } catch {
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await updatePurchaseStatus(id, status);
    fetchPurchases();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-8">Compras</h1>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-600/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Fecha</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Servicio</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Monto</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Pago</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600/30">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4 text-text-secondary text-sm">
                    {new Date(purchase.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-text-primary font-medium text-sm">{purchase.customerName}</div>
                    <div className="text-text-muted text-xs">{purchase.customerEmail}</div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary text-sm">{purchase.service?.name}</td>
                  <td className="px-5 py-4 text-accent font-semibold text-sm">
                    ${Number(purchase.finalPrice).toLocaleString("es-AR")}
                  </td>
                  <td className="px-5 py-4 text-text-secondary text-sm">
                    {PAYMENT_METHOD_LABELS[purchase.paymentMethod] || purchase.paymentMethod}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={PAYMENT_STATUS_CONFIG[purchase.paymentStatus]?.variant || "default"}>
                      {PAYMENT_STATUS_CONFIG[purchase.paymentStatus]?.label || purchase.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {purchase.paymentStatus === "PENDING" && (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => updateStatus(purchase.id, "COMPLETED")} className="text-success hover:text-success/80 text-sm font-medium transition-colors">
                          Aprobar
                        </button>
                        <button onClick={() => updateStatus(purchase.id, "CANCELLED")} className="text-error hover:text-error/80 text-sm font-medium transition-colors">
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {purchases.length === 0 && (
          <div className="text-center py-12 text-text-muted">No hay compras registradas</div>
        )}
      </div>
    </div>
  );
}
