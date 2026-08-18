import { useState } from 'react';
import { Send, Check, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useCart } from '../cart';

interface ContactPageProps {
  onMessageSent: (msg: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => void;
}

export default function ContactPage({ onMessageSent }: ContactPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasCartItems = items.length > 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Introduce tu nombre';
    if (!form.email.trim()) e.email = 'Introduce tu email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email no válido';
    if (!form.message.trim()) e.message = 'Escribe tu mensaje';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onMessageSent(form);
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    clearCart();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal_brown-500 py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-dry_sage-400 mb-3 block">
            Estamos para ayudarte
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-khaki_beige-900 mb-3">
            Contacto
          </h1>
          <p className="text-khaki_beige-700 max-w-md mx-auto">
            Haz tu pedido o resuelve cualquier duda. Te responderemos lo antes posible.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid lg:grid-cols-5 gap-10">
        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-charcoal_brown-500 mb-4">
              Información de contacto
            </h2>
            <ul className="space-y-4">
              {[
                { icon: Phone, label: 'Teléfono', value: '+34 600 123 456' },
                { icon: Mail, label: 'Email', value: 'hola@isahome.com' },
                { icon: MapPin, label: 'Dirección', value: 'Calle Mayor 24, Madrid' },
                { icon: Clock, label: 'Horario', value: 'Lun-Vie: 10:00-20:00' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-dry_sage-200/60 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-toffee_brown-600" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ebony-500">{item.label}</p>
                    <p className="text-charcoal_brown-500">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {hasCartItems && (
            <div className="p-5 rounded-xl bg-dry_sage-200/40 border border-dry_sage-300/50">
              <h3 className="font-serif text-lg text-charcoal_brown-500 mb-3">
                Pedido desde el carrito
              </h3>
              <p className="text-sm text-ebony-600 mb-3">
                Tu mensaje se enviará con los {items.length} artículos de tu carrito
                (subtotal: <strong>€{totalPrice.toFixed(2)}</strong>).
              </p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-hide">
                {items.map((i) => (
                  <div key={`${i.product.id}-${i.selectedColor}`} className="flex justify-between text-xs text-ebony-500">
                    <span className="truncate pr-2">{i.product.name} ×{i.quantity}</span>
                    <span>€{(i.product.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="bg-khaki_beige-800/60 border border-dry_sage-300/40 rounded-2xl p-6 sm:p-8 space-y-5"
          >
            {sent && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-dry_sage-200/50 border border-dry_sage-400/40 animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-toffee_brown-500 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-charcoal_brown-500">
                  ¡Mensaje enviado! Te contactaremos pronto.
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-2 block">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-3 text-sm bg-khaki_beige-900/70 border rounded-lg focus:outline-none transition-colors text-charcoal_brown-500 ${
                    errors.name ? 'border-toffee_brown-600' : 'border-dry_sage-300/50 focus:border-toffee_brown-500'
                  }`}
                  placeholder="Tu nombre"
                />
                {errors.name && <p className="text-xs text-toffee_brown-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-2 block">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-3 text-sm bg-khaki_beige-900/70 border rounded-lg focus:outline-none transition-colors text-charcoal_brown-500 ${
                    errors.email ? 'border-toffee_brown-600' : 'border-dry_sage-300/50 focus:border-toffee_brown-500'
                  }`}
                  placeholder="tucorreo@email.com"
                />
                {errors.email && <p className="text-xs text-toffee_brown-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-ebony-500 mb-2 block">
                Teléfono
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 transition-colors text-charcoal_brown-500"
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-ebony-500 mb-2 block">
                Mensaje / Pedido *
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className={`w-full px-4 py-3 text-sm bg-khaki_beige-900/70 border rounded-lg focus:outline-none transition-colors text-charcoal_brown-500 resize-none ${
                  errors.message ? 'border-toffee_brown-600' : 'border-dry_sage-300/50 focus:border-toffee_brown-500'
                }`}
                placeholder={hasCartItems ? 'Indica cualquier detalle sobre tu pedido...' : 'Cuéntanos qué necesitas...'}
              />
              {errors.message && <p className="text-xs text-toffee_brown-600 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal_brown-500 text-khaki_beige-900 px-7 py-3.5 rounded-full text-sm tracking-wide font-medium hover:bg-charcoal_brown-400 transition-colors"
            >
              <Send className="w-4 h-4" />
              {hasCartItems ? 'Enviar Pedido' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
