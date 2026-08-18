import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../cart";
import logo from "../assets/logo.png";

interface NavbarProps {
  current: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ current, onNavigate }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { id: "home", label: "Inicio" },
    { id: "catalog", label: "Catálogo" },
    { id: "contact", label: "Contacto" },
  ];

  const go = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md bg-khaki_beige-900/95 border-dry_sage-300/40">
      <nav className="flex justify-between items-center px-5 mx-auto max-w-7xl h-16 sm:px-8">
        <button onClick={() => go("home")} className="flex items-center group">
          <img
            src={logo}
            alt="Isa Home"
            className="object-contain w-auto h-10"
          />
        </button>

        <div className="hidden gap-8 items-center md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`text-sm tracking-wide transition-colors relative py-1 ${
                current === l.id
                  ? "text-charcoal_brown-500 font-medium"
                  : "text-ebony-600 hover:text-charcoal_brown-500"
              }`}
            >
              {l.label}
              {current === l.id && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-toffee_brown-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={openCart}
            className="relative p-2 rounded-full transition-colors hover:bg-dry_sage-200/60"
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
            className="p-2 rounded-full md:hidden hover:bg-dry_sage-200/60"
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
        <div className="border-t md:hidden border-dry_sage-300/40 bg-khaki_beige-900 animate-fade-in">
          <div className="flex flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`text-left py-2.5 text-sm transition-colors ${
                  current === l.id
                    ? "text-charcoal_brown-500 font-medium"
                    : "text-ebony-600"
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
