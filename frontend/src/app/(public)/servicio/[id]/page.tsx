import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { getService, getServices } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let service;

  try {
    service = await getService(params.id);
  } catch {
    notFound();
  }

  let relatedServices: any[] = [];
  try {
    const allServices = await getServices();
    relatedServices = allServices.filter((s: any) => s.id !== service.id).slice(0, 2);
  } catch {
    // Ignore
  }

  const hasDiscount = service.originalPrice !== null;

  return (
    <div className="bg-surface-900 pt-20">
      {/* Hero Image */}
      {service.imageUrl && (
        <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Volver a Servicios
        </Link>

        <div className={`${service.imageUrl ? "-mt-24 relative z-10" : ""}`}>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            {service.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-accent">
                ${Number(service.price).toLocaleString("es-AR")}
              </span>
              {hasDiscount && (
                <span className="text-lg text-text-muted line-through">
                  ${Number(service.originalPrice).toLocaleString("es-AR")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock size={18} />
              <span>{service.duration} minutos</span>
            </div>
          </div>

          {/* Description */}
          <div className="card-dark p-6 sm:p-8 mb-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
              Sobre este servicio
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="card-dark p-6 sm:p-8 mb-8">
              <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                Que incluye
              </h2>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-3">
                    <CheckCircle className="text-accent mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-text-secondary">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/checkout?service=${service.id}`} className="btn-primary text-lg flex-1 text-center">
              Contratar Servicio
            </Link>
            <a
              href={`https://wa.me/5491112345678?text=${encodeURIComponent(`Hola! Me interesa el servicio: ${service.name}. Quisiera mas informacion.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg flex-1 text-center"
            >
              <MessageCircle size={20} className="inline mr-2" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="section-padding bg-surface-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-8 text-center">
              Otros servicios
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedServices.map((related: any) => (
                <Link key={related.id} href={`/servicio/${related.id}`} className="group">
                  <div className="card-dark p-6 flex items-center gap-4">
                    {related.imageUrl && (
                      <img
                        src={related.imageUrl}
                        alt={related.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                        {related.name}
                      </h3>
                      <p className="text-text-secondary text-sm truncate">
                        {related.shortDesc}
                      </p>
                    </div>
                    <span className="text-accent font-bold flex-shrink-0">
                      ${Number(related.price).toLocaleString("es-AR")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
