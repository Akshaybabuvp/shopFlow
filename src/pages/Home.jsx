import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoStrip from '../components/PromoStrip';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PromoStrip />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
}
