import { ArrowRight, Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import type { HomeContent, Product } from '../types';
import { products } from '../data';

interface HomePageProps {
  content: HomeContent;
  onNavigate: (page: string) => void;
  onProductClick: (product: Product) => void;
}

export default function HomePage({ content, onNavigate, onProductClick }: HomePageProps) {
  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img
          src={content.imageUrl}
          alt={content.imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal_brown-500/70 via-charcoal_brown-500/40 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center">
          <div className="max-w-xl animate-slide-up">
            <span className="text-xs uppercase tracking-[0.3em] text-dry_sage-400 mb-4 block">
              {content.eyebrow}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-khaki_beige-900 leading-tight mb-5">
              {content.title}
            </h1>
            <p className="text-khaki_beige-800 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              {content.description}
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center gap-2 bg-khaki_beige-900 text-charcoal_brown-500 px-7 py-3.5 rounded-full text-sm tracking-wide font-medium hover:bg-dry_sage-200 transition-colors group"
            >
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: 'Envío a toda España', desc: 'Entrega en 48-72h' },
          { icon: ShieldCheck, title: 'Calidad garantizada', desc: 'Materiales premium' },
          { icon: Heart, title: 'Hecho a mano', desc: 'Piezas únicas' },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-4 p-5 rounded-xl bg-khaki_beige-800/60 border border-dry_sage-300/40"
          >
            <div className="w-11 h-11 rounded-full bg-dry_sage-200/60 flex items-center justify-center shrink-0">
              <f.icon className="w-5 h-5 text-toffee_brown-600" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-charcoal_brown-500 leading-tight">{f.title}</h3>
              <p className="text-sm text-ebony-600">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Most Sold */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-toffee_brown-600 mb-1 block">
              Lo más comprado
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal_brown-500">
              Favoritos de nuestros clientes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-toffee_brown-600 hover:text-charcoal_brown-500 transition-colors"
          >
            Ver todo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts.map((product, idx) => (
            <button
              key={product.id}
              onClick={() => onProductClick(product)}
              className={`group text-left rounded-2xl overflow-hidden bg-khaki_beige-800/60 border border-dry_sage-300/40 hover:shadow-lg transition-all duration-300 ${
                idx === 0 ? 'lg:col-span-1 lg:row-span-1' : ''
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-dry_sage-200/40">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {idx === 0 && (
                  <span className="absolute top-3 left-3 bg-toffee_brown-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Top 1
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-khaki_beige-900/85 backdrop-blur text-charcoal_brown-500 text-xs px-2.5 py-1 rounded-full">
                  {product.sales} ventas
                </span>
              </div>
              <div className="p-5">
                <span className="text-xs uppercase tracking-widest text-toffee_brown-600">
                  {product.category}
                </span>
                <h3 className="font-serif text-xl text-charcoal_brown-500 mt-1 mb-2 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-toffee_brown-500">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-ebony-500 group-hover:text-toffee_brown-600 transition-colors flex items-center gap-1">
                    Ver detalle <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="rounded-3xl bg-charcoal_brown-500 px-8 py-14 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-khaki_beige-900 mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-khaki_beige-700 mb-7 max-w-lg mx-auto">
            Escríbenos y te ayudaremos a encontrar la pieza perfecta para tu hogar.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-2 bg-khaki_beige-900 text-charcoal_brown-500 px-7 py-3.5 rounded-full text-sm tracking-wide font-medium hover:bg-dry_sage-200 transition-colors"
          >
            Contáctanos <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
