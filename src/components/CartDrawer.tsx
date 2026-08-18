import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../cart';
import type { CartItem } from '../types';

interface CartDrawerProps {
  whatsappPhone: string;
}

const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

function formatWhatsAppPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('00') ? digits.slice(2) : digits;
}

function buildWhatsAppMessage(items: CartItem[], totalPrice: number) {
  const lines = items.map((item, index) => {
    const unitPrice = formatCurrency(item.product.price);
    const lineTotal = formatCurrency(item.product.price * item.quantity);

    return [
      `${index + 1}. *${item.product.name}*`,
      `   Cantidad: ${item.quantity}`,
      `   Color: ${item.selectedColor}`,
      `   Precio unitario: ${unitPrice}`,
      `   Subtotal: ${lineTotal}`,
    ].join('\n');
  });

  return [
    '*Nuevo pedido - Isa Home*',
    '',
    'Hola, me gustaría realizar este pedido:',
    '',
    '*Productos*',
    ...lines,
    '',
    `*Total estimado:* ${formatCurrency(totalPrice)}`,
    '',
    'Quedo atento/a para confirmar disponibilidad, método de pago y detalles de entrega.',
    'Gracias.',
  ].join('\n');
}

export default function CartDrawer({ whatsappPhone }: CartDrawerProps) {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const whatsappNumber = formatWhatsAppPhone(whatsappPhone);

  const handleWhatsAppCheckout = () => {
    if (!whatsappNumber) return;

    const message = buildWhatsAppMessage(items, totalPrice);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal_brown-500/40 backdrop-blur-sm z-50 animate-fade-in"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-khaki_beige-900 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-dry_sage-300/40">
          <h3 className="font-serif text-xl text-charcoal_brown-500">
            Tu Carrito {totalItems > 0 && `(${totalItems})`}
          </h3>
          <button onClick={closeCart} className="p-2 rounded-full hover:bg-dry_sage-200/60 transition-colors">
            <X className="w-5 h-5 text-charcoal_brown-500" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="w-16 h-16 text-dry_sage-400 mb-4" strokeWidth={1} />
            <p className="font-serif text-xl text-charcoal_brown-500 mb-2">Carrito vacío</p>
            <p className="text-sm text-ebony-600">Aún no has añadido productos.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="flex gap-4 pb-4 border-b border-dry_sage-300/30 last:border-0"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-charcoal_brown-500 leading-tight mb-1 truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs text-ebony-600">Color:</span>
                      <span
                        className="w-4 h-4 rounded-full border border-dry_sage-400/40"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-dry_sage-400/40 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal_brown-500 hover:bg-dry_sage-200/50 rounded-full transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center text-charcoal_brown-500">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal_brown-500 hover:bg-dry_sage-200/50 rounded-full transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-serif text-lg text-charcoal_brown-500">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                    className="self-start p-1 text-ebony-400 hover:text-toffee_brown-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-dry_sage-300/40 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ebony-600">Subtotal</span>
                <span className="font-serif text-2xl text-charcoal_brown-500">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleWhatsAppCheckout}
                disabled={!whatsappNumber}
                className="w-full py-3.5 bg-charcoal_brown-500 text-khaki_beige-900 rounded-full text-sm tracking-wide font-medium hover:bg-charcoal_brown-400 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar pedido por WhatsApp
              </button>
              {!whatsappNumber && (
                <p className="text-xs text-center text-toffee_brown-600">
                  Configura el teléfono de WhatsApp en Admin para activar pedidos.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
