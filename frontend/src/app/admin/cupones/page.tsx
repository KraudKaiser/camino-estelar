"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Coupon } from "@/lib/types";
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";

interface CouponFormData {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase: number | null;
  maxUses: number | null;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const data = await getAdminCoupons();
      setCoupons(data);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este cupon?")) return;
    await deleteCoupon(id);
    fetchCoupons();
  };

  const handleSave = async (formData: CouponFormData) => {
    if (editing) {
      await updateCoupon(editing.id, formData);
    } else {
      await createCoupon(formData as Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usedCount">);
    }
    setShowForm(false);
    setEditing(null);
    fetchCoupons();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">Cupones</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} icon={<Plus size={18} />}>
          Nuevo
        </Button>
      </div>

      {showForm && (
        <CouponForm coupon={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-600/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Codigo</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Descuento</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Usos</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Vigente Hasta</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600/30">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-text-primary">{coupon.code}</td>
                  <td className="px-5 py-4 text-accent font-semibold">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {new Date(coupon.validUntil).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={coupon.isActive ? "success" : "default"}>
                      {coupon.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => { setEditing(coupon); setShowForm(true); }} className="text-text-muted hover:text-accent transition-colors p-2">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} className="text-text-muted hover:text-error transition-colors p-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CouponForm({ coupon, onSave, onCancel }: { coupon: Coupon | null; onSave: (data: CouponFormData) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<CouponFormData>({
    code: coupon?.code || "",
    discountType: coupon?.discountType || "PERCENTAGE",
    discountValue: coupon?.discountValue || 10,
    minPurchase: coupon?.minPurchase != null ? Number(coupon.minPurchase) : null,
    maxUses: coupon?.maxUses != null ? Number(coupon.maxUses) : null,
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    validUntil: coupon?.validUntil ? new Date(coupon.validUntil).toISOString().split("T")[0] : "",
    isActive: coupon?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="card-dark p-6 mb-6">
      <h2 className="font-display text-lg font-semibold text-text-primary mb-6">
        {coupon ? "Editar Cupon" : "Nuevo Cupon"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Codigo *" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Tipo de Descuento *</label>
            <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "PERCENTAGE" | "FIXED" })} className="input-dark w-full">
              <option value="PERCENTAGE">Porcentaje (%)</option>
              <option value="FIXED">Monto Fijo ($)</option>
            </select>
          </div>
          <Input label="Valor del Descuento *" type="number" required value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} />
          <Input label="Compra Minima" type="number" value={formData.minPurchase ?? ""} onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value ? Number(e.target.value) : null })} />
          <Input label="Maximo de Usos" type="number" value={formData.maxUses ?? ""} onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? Number(e.target.value) : null })} />
          <Input label="Fecha Fin *" type="date" required value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded bg-surface-700 border-surface-600 text-accent focus:ring-accent" />
          <span className="text-sm text-text-secondary">Activo</span>
        </label>
        <div className="flex gap-3 pt-2">
          <Button type="submit">Guardar</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
