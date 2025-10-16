import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchVideosBySearch } from '@/features/videos';

const Searchbar = () => {
  const dispatch = useAppDispatch();
  const { searchHistory } = useAppSelector((state) => state.videos);

  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setShowHistory(false);

    try {
      await dispatch(fetchVideosBySearch(query.trim()));
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleSelectHistory = async (term: string) => {
    setQuery(term);
    setShowHistory(false);
    setIsLoading(true);

    try {
      await dispatch(fetchVideosBySearch(term));
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <Input
        placeholder="Search NFL highlights..."
        value={query}
        onFocus={() => setShowHistory(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowHistory(true);
        }}
        onKeyDown={handleKeyPress}
        disabled={isLoading}
        className="pr-12 bg-muted border-border transition-all"
      />

      <Button
        size="icon"
        variant="ghost"
        disabled={isLoading}
        onClick={handleSearch}
        className={`absolute right-0 top-0 h-full transition-all ${
          isLoading
            ? 'cursor-wait opacity-70'
            : 'hover:bg-accent hover:text-accent-foreground active:scale-95'
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-accent-foreground" />
        ) : (
          <Search className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        )}
      </Button>

      {showHistory && searchHistory.length > 0 && !isLoading && (
        <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1">
          {searchHistory.map((term) => (
            <button
              key={term}
              onClick={() => handleSelectHistory(term)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent/10 truncate"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
