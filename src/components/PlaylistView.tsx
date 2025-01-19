import React from 'react';
import { PlaylistItem } from '../types';
import { Play, Pause } from 'lucide-react';

interface PlaylistViewProps {
  items: PlaylistItem[];
  currentVideo: PlaylistItem | null;
  onSelectVideo: (video: PlaylistItem) => void;
}

export function PlaylistView({ items, currentVideo, onSelectVideo }: PlaylistViewProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Playlist
      </h3>
      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectVideo(item)}
            className={`w-full p-4 flex items-center gap-3 rounded-xl transition-all duration-300 ${
              currentVideo?.url === item.url
                ? 'bg-blue-50 text-blue-700 shadow-md shadow-blue-100'
                : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
            }`}
          >
            <div className="flex-shrink-0">
              {currentVideo?.url === item.url ? (
                <Pause className="w-5 h-5 text-blue-600" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </div>
            <span className="text-left truncate font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}