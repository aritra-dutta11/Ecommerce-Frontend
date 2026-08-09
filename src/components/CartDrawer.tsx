import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Your Cart {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-100">
              <ShoppingBag size={32} className="text-ink-400" />
            </div>
            <div>
              <p className="font-display text-lg font-medium text-ink-900">Your cart is empty</p>
              <p className="mt-1 text-sm text-ink-500">Browse our collection and find something you love.</p>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-ink-100">
                      <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-medium text-ink-900">{item.product.name}</h3>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-ink-400 transition-colors hover:text-error-500"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <span className="text-sm text-ink-500">{formatPrice(item.product.price)}</span>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-ink-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="font-semibold text-ink-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-200 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-ink-600">Subtotal</span>
                <span className="font-display text-xl font-semibold text-ink-900">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-ink-500">Shipping and taxes calculated at checkout.</p>
              <button
                onClick={onCheckout}
                className="w-full rounded-full bg-ink-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Checkout — {formatPrice(subtotal)}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
