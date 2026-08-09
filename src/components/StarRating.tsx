import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export default function StarRating({ rating, size = 16, showValue = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, rating - (star - 1)));
          return (
            <div key={star} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="text-ink-300 absolute inset-0" fill="currentColor" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="text-amber-400" fill="currentColor" />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-ink-500">{rating.toFixed(1)}</span>}
    </div>
  );
}
