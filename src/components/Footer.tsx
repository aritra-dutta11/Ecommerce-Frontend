import { Share2, AtSign, Bird, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-900 text-ink-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Maison</h3>
            <p className="mt-3 text-sm text-ink-400">
              Curated essentials for modern living. Thoughtfully designed, built to last.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-600" aria-label="Instagram"><Share2 size={18} /></a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-600" aria-label="Twitter"><Bird size={18} /></a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-600" aria-label="Contact"><AtSign size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="transition-colors hover:text-white">All Products</a></li>
              <li><a href="#" className="transition-colors hover:text-white">New Arrivals</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Bestsellers</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Sale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="transition-colors hover:text-white">Help Center</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Returns</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Newsletter</h4>
            <p className="mt-3 text-sm text-ink-400">Get 10% off your first order.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-500"
                aria-label="Subscribe"
              >
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">© 2026 Maison. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-ink-500">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
