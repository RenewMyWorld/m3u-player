import React from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onClick: () => void;
}

export function BookmarkButton({ isBookmarked, onClick }: BookmarkButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked
          ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark channel'}
    >
      <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  );
}