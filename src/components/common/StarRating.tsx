import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showScore?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 20,
  interactive = false,
  onChange,
  showScore = false,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            style={{
              padding: 0,
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              color: isFilled ? '#f5a623' : '#6b4d35',
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (interactive) (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              if (interactive) (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#f5a623' : 'none'}
              stroke="#f5a623"
              strokeWidth={1.8}
            />
          </button>
        );
      })}
      {showScore && (
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f5a623', marginLeft: '4px' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
