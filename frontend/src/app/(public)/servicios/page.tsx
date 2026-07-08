import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { getServices } from "@/lib/api";
import { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  let services: Service[] = [];

  try {
    services = await getServices();
  } catch {
    // Services will be empty
  }

  return (
    <div className="bg-surface-900 pt-24 sm:pt-32">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Explora nuestras consultas y encuentra la que mejor se adapte a tus necesidades
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="text-text-muted" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No hay servicios disponibles
            </h2>
            <p className="text-text-secondary">
              Pronto publicaremos nuestros servicios. Contactanos por WhatsApp para mas informacion.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const hasDiscount = service.originalPrice !== null;

  return (
    <Link href={`/servicio/${service.id}`} className="group">
      <div className="card-dark overflow-hidden h-full flex flex-col">
        {service.imageUrl ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-800/60 to-transparent" />
          </div>
        ) : (
          <div className="relative aspect-[16/10] bg-surface-700 flex items-center justify-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Star className="text-accent" size={28} />
            </div>
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-display text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors duration-300">
            {service.name}
          </h3>
          <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-2">
            {service.shortDesc || service.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-accent">
                ${Number(service.price).toLocaleString("es-AR")}
              </span>
              {hasDiscount && (
                <span className="text-sm text-text-muted line-through">
                  ${Number(service.originalPrice).toLocaleString("es-AR")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-text-muted text-sm">
              <Clock size={14} />
              <span>{service.duration}m</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
