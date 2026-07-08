"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_PHONE } from "@/lib/constants";

interface WhatsAppButtonProps {
  phone?: string;
}

export default function WhatsAppButton({ phone = WHATSAPP_PHONE }: WhatsAppButtonProps) {
  const message = encodeURIComponent("Hola! Me gustaria obtener mas informacion sobre sus servicios.");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-success rounded-full animate-pulse-soft opacity-30" />
        <div className="relative flex items-center justify-center w-14 h-14 bg-success rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
          <MessageCircle className="text-white" size={26} />
        </div>
      </div>
    </a>
  );
}
