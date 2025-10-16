import Navbar from '@/components/Navbar';
import SecondaryNav from '@/components/SecondaryNav';
import FeaturedSection from '@/components/FeaturedSection';
import MoreVideosSection from '@/components/MoreVideosSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SecondaryNav />
      <FeaturedSection />
      <MoreVideosSection />
      <Footer />
    </div>
  );
};

export default Index;
