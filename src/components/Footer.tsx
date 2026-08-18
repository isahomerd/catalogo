import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import type { SiteContact } from '../types';

interface FooterProps {
  contact: SiteContact;
  onNavigate: (page: string) => void;
}

export default function Footer({ contact, onNavigate }: FooterProps) {
  return (
    <footer className="bg-charcoal_brown-500 text-khaki_beige-800 mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="font-serif text-3xl font-semibold text-khaki_beige-900">
              Isa
            </span>
            <span className="font-serif text-3xl font-light italic text-dry_sage-600">
              Home
            </span>
          </div>
          <p className="text-sm leading-relaxed text-khaki_beige-700 max-w-md">
            Artículos para el hogar seleccionados a mano. Diseño atemporal,
            materiales nobles y la calidez que tu hogar merece.
          </p>
          {(contact.instagramUrl || contact.facebookUrl) && (
            <div className="flex gap-3 mt-5">
              {contact.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-dry_sage-600/50 flex items-center justify-center hover:bg-dry_sage-600/20 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-dry_sage-600/50 flex items-center justify-center hover:bg-dry_sage-600/20 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-serif text-lg text-khaki_beige-900 mb-4">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => onNavigate('home')} className="text-khaki_beige-700 hover:text-dry_sage-600 transition-colors">
                Inicio
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('catalog')} className="text-khaki_beige-700 hover:text-dry_sage-600 transition-colors">
                Catálogo
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="text-khaki_beige-700 hover:text-dry_sage-600 transition-colors">
                Contacto
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="text-khaki_beige-700 hover:text-dry_sage-600 transition-colors">
                Admin
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-khaki_beige-900 mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm text-khaki_beige-700">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" /> {contact.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" /> {contact.email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {contact.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dry_sage-600/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 text-center text-xs text-khaki_beige-700">
          © 2026 Isa Home. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
