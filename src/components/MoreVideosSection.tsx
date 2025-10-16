import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/store/store';
import VideoCard from './VideoCard';

const MoreVideosSection = () => {
  const { featured, loading } = useSelector((state: RootState) => state.videos);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (loading && featured.length === 0) {
    return (
      <section className="py-8 bg-muted/20">
        <div className="container px-4">
          <h2 className="text-2xl font-bold mb-6">More Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-muted animate-pulse rounded-xl" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-8 bg-muted/20 overflow-hidden">
      <motion.div
        className="container px-4"
        initial={{ opacity: 0, y: 60 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="border border-border rounded-lg p-6 bg-card shadow-md"
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.h2
            className="text-2xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            More Videos
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={visible ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.15,
                },
              },
              hidden: {},
            }}
          >
            {featured.slice(4, 20).map((video) => (
              <motion.div
                key={video.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MoreVideosSection;
