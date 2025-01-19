import { SavedPlaylist, BookmarkedChannel } from '../types';

// Playlist Storage
export function getSavedPlaylists(): SavedPlaylist[] {
  const playlists = localStorage.getItem('savedPlaylists');
  return playlists ? JSON.parse(playlists) : [];
}

export function savePlaylist(name: string, url: string): SavedPlaylist {
  const playlists = getSavedPlaylists();
  const newPlaylist: SavedPlaylist = {
    id: crypto.randomUUID(),
    name,
    url,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem('savedPlaylists', JSON.stringify([...playlists, newPlaylist]));
  return newPlaylist;
}

export function deletePlaylist(id: string): void {
  const playlists = getSavedPlaylists().filter(p => p.id !== id);
  localStorage.setItem('savedPlaylists', JSON.stringify(playlists));
}

// Bookmarks Storage
export function getBookmarkedChannels(): BookmarkedChannel[] {
  const bookmarks = localStorage.getItem('bookmarkedChannels');
  return bookmarks ? JSON.parse(bookmarks) : [];
}

export function saveBookmark(title: string, url: string, playlistId: string): BookmarkedChannel {
  const bookmarks = getBookmarkedChannels();
  const newBookmark: BookmarkedChannel = {
    id: crypto.randomUUID(),
    title,
    url,
    playlistId,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem('bookmarkedChannels', JSON.stringify([...bookmarks, newBookmark]));
  return newBookmark;
}

export function deleteBookmark(id: string): void {
  const bookmarks = getBookmarkedChannels().filter(b => b.id !== id);
  localStorage.setItem('bookmarkedChannels', JSON.stringify(bookmarks));
}

export function isChannelBookmarked(url: string): boolean {
  const bookmarks = getBookmarkedChannels();
  return bookmarks.some(b => b.url === url);
}