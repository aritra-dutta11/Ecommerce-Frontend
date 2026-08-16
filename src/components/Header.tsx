import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const { totalItems, openCart } = useCart();

  const { token, username, logout, userId } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setSearchOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <button
          //onClick={() => onNavigate("home")}
          className="font-display text-2xl font-bold tracking-tight text-ink-900"
        >
          Maison
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <button
            //onClick={() => onNavigate("home")}
            className={`text-sm font-medium transition-colors `}
          >
            Home
          </button>

          <button
            // onClick={() => onNavigate("shop")}
            className={`text-sm font-medium transition-colors`}
          >
            Shop All
          </button>

          <button
            //onClick={() => onNavigate("shop")}
            className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            New Arrivals
          </button>

          <button
            //onClick={() => onNavigate("shop")}
            className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            Bestsellers
          </button>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            {searchOpen ? (
              <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Search products..."
                  className="w-48 rounded-full border border-ink-300 bg-white py-2 pl-4 pr-10 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-64"
                />

                <button
                  type="submit"
                  className="absolute right-3 text-ink-400"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}
          </form>

          {/* Cart */}
          <button
            onClick={() => {
              navigate(`/cart/${userId}`);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />

            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Account */}
          {token ? (
            <>
              <AccountMenu
                username={username ?? "User"}
                onSignOut={handleLogout}
              />

              {/* Mobile Account Button */}
              <button
                //onClick={() => onNavigate("auth")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-white transition-colors hover:bg-brand-600 sm:hidden"
                aria-label="Account"
              >
                <User size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="hidden items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 sm:flex"
            >
              <User size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            <button
              onClick={() => {
                //onNavigate("home");
                setMobileOpen(false);
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              Home
            </button>

            <button
              onClick={() => {
                //onNavigate("shop");
                setMobileOpen(false);
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              Shop All
            </button>

            <button
              onClick={() => {
                //onNavigate("shop");
                setMobileOpen(false);
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              New Arrivals
            </button>

            <button
              onClick={() => {
                //onNavigate("shop");
                setMobileOpen(false);
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              Bestsellers
            </button>

            {!token && (
              <button
                onClick={() => {
                  navigate("/auth");
                  setMobileOpen(false);
                }}
                className="mt-2 rounded-lg bg-ink-900 px-3 py-2.5 text-left text-sm font-semibold text-white"
              >
                Sign In / Sign Up
              </button>
            )}

            {token && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="mt-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

interface AccountMenuProps {
  username: string;
  onSignOut: () => void;
}

function AccountMenu({ username, onSignOut }: AccountMenuProps) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const initials = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        aria-label="Account menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-ink-200 bg-white p-2 shadow-lg">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-ink-900">My Account</p>

            <p className="mt-1 truncate text-sm text-ink-500">{username}</p>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
