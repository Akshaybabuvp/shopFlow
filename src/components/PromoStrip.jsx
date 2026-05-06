const PERKS = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹999' },
  { icon: '↩', title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: '🔒', title: 'Secure Payment', desc: '100% protected checkout' },
  { icon: '💬', title: '24/7 Support', desc: 'Chat with us anytime' },
];

export default function PromoStrip() {
  return (
    <section className="bg-[#111] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PERKS.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{icon}</span>
              <div>
                <div className="text-white text-sm font-semibold">{title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
