import Navbar from '@/components/Navbar';
import SecondaryNav from '@/components/SecondaryNav';
import FeaturedSection from '@/components/FeaturedSection';
import MoreVideosSection from '@/components/MoreVideosSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SecondaryNav />
      <FeaturedSection />
      <MoreVideosSection />
    </div>
  );
};

export default Index;
