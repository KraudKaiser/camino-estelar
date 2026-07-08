"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Service } from "@/lib/types";
import { API_URL } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch(`${API_URL}/api/admin/services`, { credentials: "include" });
    const data = await res.json();
    setServices(data.services || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este servicio?")) return;
    await fetch(`${API_URL}/api/admin/services/${id}`, { method: "DELETE", credentials: "include" });
    fetchServices();
  };

  const handleSave = async (formData: any) => {
    const url = editing
      ? `${API_URL}/api/admin/services/${editing.id}`
      : `${API_URL}/api/admin/services`;
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setEditing(null);
    fetchServices();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">Servicios</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} icon={<Plus size={18} />}>
          Nuevo
        </Button>
      </div>

      {showForm && (
        <ServiceForm service={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-600/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Precio</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Duracion</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600/30">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4 text-text-primary font-medium">{service.name}</td>
                  <td className="px-5 py-4 text-accent font-semibold">${Number(service.price).toLocaleString("es-AR")}</td>
                  <td className="px-5 py-4 text-text-secondary">{service.duration} min</td>
                  <td className="px-5 py-4">
                    <Badge variant={service.isActive ? "success" : "default"}>
                      {service.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => { setEditing(service); setShowForm(true); }} className="text-text-muted hover:text-accent transition-colors p-2">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="text-text-muted hover:text-error transition-colors p-2">
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

function ServiceForm({ service, onSave, onCancel }: { service: Service | null; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    shortDesc: service?.shortDesc || "",
    price: String(service?.price || 0),
    originalPrice: service?.originalPrice != null ? String(service.originalPrice) : "",
    duration: String(service?.duration || 30),
    imageUrl: service?.imageUrl || "",
    isActive: service?.isActive ?? true,
    sortOrder: String(service?.sortOrder || 0),
    features: service?.features?.map((f) => f.text).join("\n") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      duration: Number(formData.duration),
      sortOrder: Number(formData.sortOrder) || 0,
      features: formData.features.split("\n").filter((f) => f.trim()),
    });
  };

  return (
    <div className="card-dark p-6 mb-6">
      <h2 className="font-display text-lg font-semibold text-text-primary mb-6">
        {service ? "Editar Servicio" : "Nuevo Servicio"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Nombre *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Precio *" type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          <Input label="Precio Original" type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
          <Input label="Duracion (min) *" type="number" required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
        </div>
        <Input label="Descripcion Corta" value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Descripcion Completa *</label>
          <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-dark resize-none" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Features (una por linea)</label>
          <textarea rows={4} value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="input-dark resize-none" placeholder="Feature 1&#10;Feature 2" />
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
