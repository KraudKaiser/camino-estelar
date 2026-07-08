import Link from "next/link";
import { MessageCircle, Clock, Star, Shield } from "lucide-react";
import { getServices } from "@/lib/api";
import { Service } from "@/lib/types";
import { WHATSAPP_PHONE } from "@/lib/constants";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const dynamic = "force-dynamic";

export default async function Home() {
  let services: Service[] = [];

  try {
    services = await getServices();
  } catch {
    // Services will be empty
  }

  return (
    <div className="bg-surface-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-900/70 via-surface-900/50 to-surface-900" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary mb-6 animate-fade-in-slow">
            Camino <span className="text-accent">Estelar</span>
          </h1>
          <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-slow" style={{ animationDelay: "0.2s" }}>
            Guia espiritual, bienestar interior y crecimiento personal.
            Descubre tu camino con orientacion profesional y cercana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-slow" style={{ animationDelay: "0.4s" }}>
            <Link href="/servicios" className="btn-primary text-lg">
              Ver Servicios
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg"
            >
              <MessageCircle size={20} className="inline mr-2" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Sections */}
      {services.length > 0 && (
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16 sm:mb-24">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                  Nuestros Servicios
                </h2>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                  Cada servicio esta disenado para guiarte en tu proceso personal
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-16 sm:space-y-24">
              {services.map((service, index) => (
                <ScrollReveal key={service.id} delay={index * 100}>
                  <ServiceSection service={service} reversed={index % 2 === 1} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="section-padding bg-surface-800/50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                Por que elegirnos
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Nuestra experiencia y compromiso te brindan la mejor atencion
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="card-dark p-8 text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="text-accent" size={28} />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                  Experiencia
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Anos de practica y formacion continua en guia espiritual y bienestar personal.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="card-dark p-8 text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="text-accent" size={28} />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                  Atencion Personalizada
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Cada consulta es unica. Escuchamos tus necesidades para ofrecerte la mejor guia.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="card-dark p-8 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-accent" size={28} />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                  Confianza
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Un espacio seguro y respetuoso para tu proceso personal y espiritual.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-6">
              Comienza tu proceso hoy
            </h2>
            <p className="text-text-secondary text-lg mb-10">
              Reserva tu sesion o contactanos por WhatsApp para mas informacion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/servicios" className="btn-primary text-lg">
                Ver Servicios
              </Link>
              <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg"
              >
                <MessageCircle size={20} className="inline mr-2" />
                WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

function ServiceSection({ service, reversed }: { service: Service; reversed: boolean }) {
  const hasDiscount = service.originalPrice !== null;

  return (
    <div className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-12 items-center`}>
      <div className="w-full lg:w-3/5">
        {service.imageUrl ? (
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 to-transparent" />
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-800 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-accent" size={36} />
              </div>
              <p className="text-text-muted text-sm">{service.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full lg:w-2/5 space-y-6">
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
          {service.name}
        </h3>
        <p className="text-text-secondary leading-relaxed">
          {service.shortDesc || service.description}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-accent">
            ${Number(service.price).toLocaleString("es-AR")}
          </span>
          {hasDiscount && (
            <span className="text-lg text-text-muted line-through">
              ${Number(service.originalPrice).toLocaleString("es-AR")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-text-muted text-sm">
          <Clock size={16} />
          <span>{service.duration} minutos</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href={`/servicio/${service.id}`} className="btn-primary">
            Ver Detalles
          </Link>
          <Link href={`/checkout?service=${service.id}`} className="btn-secondary">
            Contratar
          </Link>
        </div>
      </div>
    </div>
  );
}
