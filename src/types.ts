export interface PlaylistItem {
  title: string;
  url: string;
}

export interface SavedPlaylist {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface BookmarkedChannel {
  id: string;
  title: string;
  url: string;
  playlistId: string;
  createdAt: string;
}