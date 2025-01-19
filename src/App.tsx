import React, { useState, useEffect } from 'react';
import { PlaylistItem, SavedPlaylist, BookmarkedChannel } from './types';
import { parseM3UFromURL } from './utils/m3uParser';
import { VideoPlayer } from './components/VideoPlayer';
import { PlaylistView } from './components/PlaylistView';
import { SavedPlaylists } from './components/SavedPlaylists';
import { Play, FileText, Film, MonitorPlay, Bookmark, Save, ArrowLeft } from 'lucide-react';
import {
  getSavedPlaylists,
  savePlaylist,
  deletePlaylist,
  getBookmarkedChannels,
  saveBookmark,
  deleteBookmark,
} from './utils/storage';

function App() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [url, setUrl] = useState('');
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<PlaylistItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
  const [bookmarkedChannels, setBookmarkedChannels] = useState<BookmarkedChannel[]>([]);

  useEffect(() => {
    setSavedPlaylists(getSavedPlaylists());
    setBookmarkedChannels(getBookmarkedChannels());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const items = await parseM3UFromURL(url);
      setPlaylist(items);
      if (items.length > 0) {
        setCurrentVideo(items[0]);
      }
    } catch (err) {
      setError('Failed to load playlist. Make sure the URL is correct and supports CORS.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlaylist = () => {
    const name = prompt('Enter a name for this playlist:');
    if (name) {
      const newPlaylist = savePlaylist(name, url);
      setSavedPlaylists([...savedPlaylists, newPlaylist]);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    deletePlaylist(id);
    setSavedPlaylists(getSavedPlaylists());
  };

  const handleToggleBookmark = (video: PlaylistItem) => {
    const existingBookmark = bookmarkedChannels.find(b => b.url === video.url);
    if (existingBookmark) {
      deleteBookmark(existingBookmark.id);
      setBookmarkedChannels(getBookmarkedChannels());
    } else {
      const newBookmark = saveBookmark(video.title, video.url, url);
      setBookmarkedChannels([...bookmarkedChannels, newBookmark]);
    }
  };

  const handleVideoEnd = () => {
    const currentIndex = playlist.findIndex(item => item.url === currentVideo?.url);
    if (currentIndex < playlist.length - 1) {
      setCurrentVideo(playlist[currentIndex + 1]);
    }
  };

  if (!showPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="animate-fade-in-up">
              <MonitorPlay className="w-20 h-20 text-blue-400 mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                Stream Anywhere, Anytime
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto">
                Your ultimate M3U streaming companion. Load your playlists and enjoy seamless playback.
              </p>
            </div>

            <button
              onClick={() => setShowPlayer(true)}
              className="group relative inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900 animate-fade-in-up"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <Play className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20 animate-fade-in-up delay-200">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
              <Film className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Universal Compatibility</h3>
              <p className="text-blue-200">Support for all standard M3U playlists and streaming formats.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
              <Play className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seamless Playback</h3>
              <p className="text-blue-200">Enjoy uninterrupted streaming with our optimized video player.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
              <FileText className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
              <p className="text-blue-200">Simple playlist management and organization tools.</p>
            </div>
          </div>
        </div>

        <footer className="absolute bottom-0 w-full py-6 text-center text-blue-200 bg-black/20 backdrop-blur-lg">
          <p className="text-lg animate-pulse">
            Unlock endless streaming possibilities with M3U Player
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPlayer(false)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  M3U Player
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 ${
                showSaved
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="font-medium">Saved Playlists</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {showSaved ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Saved Playlists
            </h2>
            <SavedPlaylists
              playlists={savedPlaylists}
              onDelete={handleDeletePlaylist}
              onSelect={(url) => {
                setUrl(url);
                setShowSaved(false);
                handleSubmit(new Event('submit') as any);
              }}
            />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter .m3u playlist URL"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg shadow-blue-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50"
                    >
                      {loading ? 'Loading...' : 'Load Playlist'}
                    </button>
                    {url && (
                      <button
                        type="button"
                        onClick={handleSavePlaylist}
                        className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg shadow-green-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-200/50"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                    <p>{error}</p>
                  </div>
                )}
              </form>
            </div>

            {playlist.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <VideoPlayer
                      currentVideo={currentVideo}
                      onEnded={handleVideoEnd}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <PlaylistView
                    items={playlist}
                    currentVideo={currentVideo}
                    onSelectVideo={setCurrentVideo}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Enter a URL to an M3U playlist to get started
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;