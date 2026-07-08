"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Service } from "@/lib/types";
import { getAdminServices, createService, updateService, deleteService } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";

interface ServiceFormData {
  name: string;
  description: string;
  shortDesc: string;
  price: number;
  originalPrice: number | null;
  duration: number;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  features: string[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getAdminServices();
      setServices(data);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este servicio?")) return;
    await deleteService(id);
    fetchServices();
  };

  const handleSave = async (formData: ServiceFormData) => {
    const payload = { ...formData } as unknown as Partial<Service>;
    if (editing) {
      await updateService(editing.id, payload);
    } else {
      await createService(payload as Omit<Service, "id" | "createdAt" | "updatedAt">);
    }
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

function ServiceForm({ service, onSave, onCancel }: { service: Service | null; onSave: (data: ServiceFormData) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: service?.name || "",
    description: service?.description || "",
    shortDesc: service?.shortDesc || "",
    price: Number(service?.price) || 0,
    originalPrice: service?.originalPrice != null ? Number(service.originalPrice) : null,
    duration: Number(service?.duration) || 30,
    imageUrl: service?.imageUrl || "",
    isActive: service?.isActive ?? true,
    sortOrder: service?.sortOrder || 0,
    features: service?.features?.map((f) => f.text) || [],
  });
  const [featuresText, setFeaturesText] = useState(
    service?.features?.map((f) => f.text).join("\n") || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      features: featuresText.split("\n").filter((f) => f.trim()),
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
          <Input label="Precio *" type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
          <Input label="Precio Original" type="number" value={formData.originalPrice ?? ""} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : null })} />
          <Input label="Duracion (min) *" type="number" required value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} />
        </div>
        <Input label="Descripcion Corta" value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Descripcion Completa *</label>
          <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-dark resize-none" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Features (una por linea)</label>
          <textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="input-dark resize-none" placeholder="Feature 1&#10;Feature 2" />
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
