import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Collections', to: '/collections' },
    { label: 'New Arrivals', to: '/products' },
    { label: 'Sale', to: '/products' },
  ],
  Support: [
    { label: 'FAQ', to: '/' },
    { label: 'Shipping', to: '/' },
    { label: 'Returns', to: '/' },
    { label: 'Contact', to: '/' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Privacy', to: '/' },
  ],
};

const SOCIALS = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: '#',
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.141-.828 3.33-.236.995.498 1.806 1.476 1.806 1.771 0 3.132-1.867 3.132-4.562 0-2.387-1.715-4.055-4.163-4.055-2.836 0-4.498 2.127-4.498 4.326 0 .857.33 1.775.741 2.276a.3.3 0 01.069.284c-.076.315-.244 1.001-.277 1.14-.044.184-.146.222-.338.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#111] text-gray-400 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top: brand + links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl text-white block mb-3">
              ShopFlow
            </span>
            <p className="text-sm leading-relaxed text-gray-500 mb-5 max-w-xs">
              Thoughtfully curated products for modern living. Quality you can
              feel.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-500 hover:text-amber-300 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <span>
            © {new Date().getFullYear()} ShopFlow. All rights reserved.
          </span>
          <div className="flex gap-5">
            <Link to="/" className="hover:text-gray-400 transition-colors">
              Terms
            </Link>
            <Link to="/" className="hover:text-gray-400 transition-colors">
              Privacy
            </Link>
            <Link to="/" className="hover:text-gray-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
