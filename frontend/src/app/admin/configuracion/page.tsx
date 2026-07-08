"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { API_URL } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

export default function AdminConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    const res = await fetch(`${API_URL}/api/admin/config`, { credentials: "include" });
    const data = await res.json();
    setConfig(data.config || {});
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    await fetch(`${API_URL}/api/admin/config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ config }),
    });
    setMessage("Configuracion guardada");
    setSaving(false);
  };

  const updateConfig = (key: string, value: string) => {
    setConfig({ ...config, [key]: value });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-8">Configuracion</h1>

      <div className="space-y-6 max-w-2xl">
        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-5">General</h2>
          <Input label="Nombre del Sitio" value={config.site_name || ""} onChange={(e) => updateConfig("site_name", e.target.value)} />
        </div>

        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-5">WhatsApp</h2>
          <div className="space-y-4">
            <Input label="Numero de WhatsApp" value={config.whatsapp_number || ""} onChange={(e) => updateConfig("whatsapp_number", e.target.value)} placeholder="5491112345678" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={config.whatsapp_enabled === "true"} onChange={(e) => updateConfig("whatsapp_enabled", e.target.checked ? "true" : "false")} className="w-4 h-4 rounded bg-surface-700 border-surface-600 text-accent focus:ring-accent" />
              <span className="text-sm text-text-secondary">Habilitar contacto por WhatsApp</span>
            </label>
          </div>
        </div>

        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-5">Transferencia Bancaria</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={config.bank_transfer_enabled === "true"} onChange={(e) => updateConfig("bank_transfer_enabled", e.target.checked ? "true" : "false")} className="w-4 h-4 rounded bg-surface-700 border-surface-600 text-accent focus:ring-accent" />
              <span className="text-sm text-text-secondary">Habilitar transferencia bancaria</span>
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nombre del Banco" value={config.bank_name || ""} onChange={(e) => updateConfig("bank_name", e.target.value)} />
              <Input label="Titular" value={config.account_holder || ""} onChange={(e) => updateConfig("account_holder", e.target.value)} />
              <Input label="CBU" value={config.cbu || ""} onChange={(e) => updateConfig("cbu", e.target.value)} />
              <Input label="Alias" value={config.alias || ""} onChange={(e) => updateConfig("alias", e.target.value)} />
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-success/10 border border-success/30 text-success p-4 rounded-xl text-sm">
            {message}
          </div>
        )}

        <Button onClick={handleSave} loading={saving} icon={<Save size={18} />}>
          Guardar Configuracion
        </Button>
      </div>
    </div>
  );
}
