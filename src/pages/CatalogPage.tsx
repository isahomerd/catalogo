import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Product } from '../types';

interface CatalogPageProps {
  products: Product[];
  categories: string[];
  onProductClick: (product: Product) => void;
}

export default function CatalogPage({ products, categories, onProductClick }: CatalogPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'sales' | 'price-asc' | 'price-desc'>('sales');

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'Todas') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => b.sales - a.sales);
    }
    return result;
  }, [activeCategory, search, sortBy]);

  const allCats = ['Todas', ...categories];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal_brown-500 py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-dry_sage-400 mb-3 block">
            Nuestra Colección
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-khaki_beige-900 mb-3">
            Catálogo
          </h1>
          <p className="text-khaki_beige-700 max-w-md mx-auto">
            Explora nuestra selección de artículos para el hogar, organizados por categoría.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-16 z-30 bg-khaki_beige-900/95 backdrop-blur-md border-b border-dry_sage-300/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ebony-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-full focus:outline-none focus:border-toffee_brown-500 transition-colors text-charcoal_brown-500 placeholder:text-ebony-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-ebony-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-full px-4 py-2.5 focus:outline-none focus:border-toffee_brown-500 transition-colors text-charcoal_brown-500 cursor-pointer"
              >
                <option value="sales">Más vendidos</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
            {allCats.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-charcoal_brown-500 text-khaki_beige-900'
                    : 'bg-khaki_beige-800/60 text-ebony-600 hover:bg-dry_sage-200/60 border border-dry_sage-300/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-charcoal_brown-500 mb-2">
              No se encontraron productos
            </p>
            <p className="text-sm text-ebony-500">
              Prueba con otra búsqueda o categoría.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-ebony-500 mb-6">
              {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onProductClick(product)}
                  className="group text-left rounded-2xl overflow-hidden bg-khaki_beige-800/60 border border-dry_sage-300/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-dry_sage-200/40">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {product.colors.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-xs uppercase tracking-widest text-toffee_brown-600">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-lg text-charcoal_brown-500 mt-1 mb-2 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="font-serif text-xl text-toffee_brown-500">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
