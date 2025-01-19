import React from 'react';
import { SavedPlaylist } from '../types';
import { FileText, Trash2, Copy, ExternalLink } from 'lucide-react';

interface SavedPlaylistsProps {
  playlists: SavedPlaylist[];
  onDelete: (id: string) => void;
  onSelect: (url: string) => void;
}

export function SavedPlaylists({ playlists, onDelete, onSelect }: SavedPlaylistsProps) {
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No saved playlists yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{playlist.name}</h3>
              <p className="text-sm text-gray-500 truncate mb-2">{playlist.url}</p>
              <p className="text-xs text-gray-400">
                Saved on {new Date(playlist.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => copyToClipboard(playlist.url)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => onSelect(playlist.url)}
                className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors"
                title="Load Playlist"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(playlist.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}