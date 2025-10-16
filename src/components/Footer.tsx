export const Footer = () => {
  return (
    <footer className="border-t border-border/50 mt-12 sm:mt-20 py-6 sm:py-8 relative">
      <div className="container mx-auto px-4 text-center flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-1">
          <p className="text-muted-foreground text-xs sm:text-sm">
            HailMaryTV •{' '}
            <a
              href="https://miltonr87.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              Milton Rodrigues – 2025
            </a>
          </p>
        </div>
        <p className="text-muted-foreground/60 text-[10px] sm:text-xs mt-1">
          All NFL highlights and clips are property of their respective rights
          holders. This is a fan-made project built with React & YouTube API.
        </p>
      </div>
    </footer>
  );
};
