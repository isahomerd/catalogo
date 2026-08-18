import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../cart';

interface NavbarProps {
  current: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ current, onNavigate }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { id: 'home', label: 'Inicio' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'contact', label: 'Contacto' },
  ];

  const go = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-khaki_beige-900/95 backdrop-blur-md border-b border-dry_sage-300/40">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button onClick={() => go('home')} className="flex items-center gap-2 group">
          <span className="font-serif text-2xl font-semibold tracking-wide text-charcoal_brown-500">
            Isa
          </span>
          <span className="font-serif text-2xl font-light tracking-wide text-toffee_brown-500 italic">
            Home
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`text-sm tracking-wide transition-colors relative py-1 ${
                current === l.id
                  ? 'text-charcoal_brown-500 font-medium'
                  : 'text-ebony-600 hover:text-charcoal_brown-500'
              }`}
            >
              {l.label}
              {current === l.id && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-toffee_brown-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative p-2 rounded-full hover:bg-dry_sage-200/60 transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag className="w-5 h-5 text-charcoal_brown-500" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-toffee_brown-500 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-dry_sage-200/60"
            aria-label="Menú"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-charcoal_brown-500" />
            ) : (
              <Menu className="w-5 h-5 text-charcoal_brown-500" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-dry_sage-300/40 bg-khaki_beige-900 animate-fade-in">
          <div className="px-5 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`text-left py-2.5 text-sm transition-colors ${
                  current === l.id
                    ? 'text-charcoal_brown-500 font-medium'
                    : 'text-ebony-600'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
