import Navbar from '@/components/App/Navbar';
import SecondaryNav from '@/components/App/SecondaryNav';
import FeaturedSection from '@/components/Layout/FeaturedSection';
import MoreVideosSection from '@/components/Layout/MoreVideosSection';
import Footer from '@/components/App/Footer';

const HomePage = () => {
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

export default HomePage;
