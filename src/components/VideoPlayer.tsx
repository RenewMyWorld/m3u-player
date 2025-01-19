import React from 'react';
import { PlaylistItem } from '../types';
import { BookmarkButton } from './BookmarkButton';
import { isChannelBookmarked } from '../utils/storage';

interface VideoPlayerProps {
  currentVideo: PlaylistItem | null;
  onEnded: () => void;
  onToggleBookmark: (video: PlaylistItem) => void;
}

export function VideoPlayer({ currentVideo, onEnded, onToggleBookmark }: VideoPlayerProps) {
  if (!currentVideo) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No video selected</p>
      </div>
    );
  }

  const isBookmarked = isChannelBookmarked(currentVideo.url);

  return (
    <div className="w-full">
      <video
        className="w-full aspect-video bg-black rounded-lg"
        controls
        autoPlay
        src={currentVideo.url}
        onEnded={onEnded}
      >
        <p>Your browser doesn't support HTML5 video playback.</p>
      </video>
      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
        <BookmarkButton
          isBookmarked={isBookmarked}
          onClick={() => onToggleBookmark(currentVideo)}
        />
      </div>
    </div>
  );
}