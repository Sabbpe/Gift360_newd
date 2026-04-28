import { Link, useLocation } from 'wouter';
import { Home, Search, Store, ShoppingCart } from 'lucide-react';

const navItems = [
  { id: 'home',       label: 'Home',       Icon: Home,         href: '/' },
  { id: 'categories', label: 'Categories', Icon: Search,       href: '/categories' },
  { id: 'brands',     label: 'Brands',     Icon: Store,        href: '/brands' },
  { id: 'cart',       label: 'Cart',       Icon: ShoppingCart, href: '/cart' },
];

export default function MobileBottomNav() {
  const [location] = useLocation();

  const isActive = (href: string) =>
    href === '/' ? location === '/' : location.startsWith(href);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid #F3F4F6",
        boxShadow: "0 -4px 20px rgba(109,40,217,0.06)",
      }}>
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ id, label, Icon, href }) => {
          const active = isActive(href);
          return (
            <Link key={id} href={href} className="flex-1">
              <div className="flex flex-col items-center justify-center py-2 gap-0.5 relative">
                {/* Active top indicator */}
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ width: 32, height: 3, background: "#7C3AED" }}
                  />
                )}
                <div
                  className="flex items-center justify-center transition-all"
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: active ? "rgba(124,58,237,0.10)" : "transparent",
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    color={active ? "#7C3AED" : "#9CA3AF"}
                    fill={active ? "rgba(124,58,237,0.15)" : "none"}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold font-sans"
                  style={{ color: active ? "#7C3AED" : "#9CA3AF" }}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
