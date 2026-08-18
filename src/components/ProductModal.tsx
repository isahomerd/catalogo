import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../cart';
import { formatCurrency } from '../utils/format';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedColor(product.colors[0]);
      setActiveImage(0);
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 bg-charcoal_brown-500/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-khaki_beige-900 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-in scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-khaki_beige-900/80 backdrop-blur flex items-center justify-center hover:bg-dry_sage-200/80 transition-colors"
          >
            <X className="w-5 h-5 text-charcoal_brown-500" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6 md:p-8">
              <div className="aspect-square rounded-xl overflow-hidden bg-dry_sage-200/40 mb-4">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === i
                        ? 'border-toffee_brown-500'
                        : 'border-transparent hover:border-dry_sage-400/60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col">
              <span className="text-xs uppercase tracking-widest text-toffee_brown-600 mb-2">
                {product.category}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal_brown-500 mb-3 leading-tight">
                {product.name}
              </h2>
              <p className="font-serif text-3xl text-toffee_brown-500 mb-5">
                {formatCurrency(product.price)}
              </p>

              <p className="text-sm leading-relaxed text-ebony-600 mb-6">
                {product.description}
              </p>

              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-ebony-500 mb-3 block">
                  Color
                </span>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-charcoal_brown-500 scale-110'
                          : 'border-dry_sage-400/40 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-ebony-500 mb-3 block">
                  Cantidad
                </span>
                <div className="flex items-center gap-3 border border-dry_sage-400/40 rounded-full w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-charcoal_brown-500 hover:bg-dry_sage-200/50 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-charcoal_brown-500 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-charcoal_brown-500 hover:bg-dry_sage-200/50 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-ebony-400 mt-2">{product.stock} unidades disponibles</p>
              </div>

              <button
                onClick={handleAdd}
                disabled={added}
                className="mt-auto w-full py-3.5 bg-charcoal_brown-500 text-khaki_beige-900 rounded-full text-sm tracking-wide font-medium hover:bg-charcoal_brown-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Añadido al carrito
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Añadir al Carrito
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
