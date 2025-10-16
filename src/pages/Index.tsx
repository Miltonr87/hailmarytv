import Navbar from '@/components/App/Navbar';
import SecondaryNav from '@/components/App/SecondaryNav';
import FeaturedSection from '@/components/Video/FeaturedSection';
import MoreVideosSection from '@/components/Video/MoreVideosSection';
import Footer from '@/components/App/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <SecondaryNav />
      <main className="flex-grow">
        <FeaturedSection />
        <MoreVideosSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
