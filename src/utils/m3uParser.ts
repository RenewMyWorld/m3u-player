import { PlaylistItem } from '../types';

export async function parseM3UFromURL(url: string): Promise<PlaylistItem[]> {
  try {
    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      throw new Error('Invalid URL format. Please enter a valid URL.');
    }

    // First try direct fetch
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/plain,application/x-mpegurl,application/vnd.apple.mpegurl',
        },
      });
      
      if (response.ok) {
        const content = await response.text();
        return validateAndParseContent(content);
      }
      
      if (response.status === 403 || response.status === 401) {
        throw new Error('Access denied. The playlist might be private or require authentication.');
      }
    } catch (err) {
      console.log('Direct fetch failed, trying proxies...', err);
    }

    // Try multiple CORS proxies
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
    ];

    let lastError = null;
    
    // Try each proxy sequentially
    for (const proxy of corsProxies) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        console.log(`Trying proxy: ${proxy}`);
        
        const response = await fetch(proxyUrl, {
          headers: {
            'Accept': 'text/plain,application/x-mpegurl,application/vnd.apple.mpegurl',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const content = await response.text();
        return validateAndParseContent(content);
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    // If we get here, all attempts failed
    throw new Error(
      lastError instanceof Error 
        ? lastError.message 
        : 'Failed to fetch playlist through all available methods'
    );
  } catch (error) {
    console.error('Error fetching playlist:', error);
    
    // Provide user-friendly error messages based on error type
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error: Unable to reach the playlist URL. ' +
        'Please check your internet connection and verify the URL is accessible.'
      );
    }
    
    if (error instanceof Error) {
      throw new Error(
        'Failed to load playlist: ' + error.message
      );
    }
    
    throw new Error(
      'An unexpected error occurred while loading the playlist. ' +
      'Please try again or check the URL.'
    );
  }
}

function validateAndParseContent(content: string): PlaylistItem[] {
  // Basic validation of M3U format
  if (!content.trim()) {
    throw new Error('The playlist appears to be empty.');
  }

  if (!content.includes('#EXTM3U') && !content.includes('#EXTINF')) {
    throw new Error(
      'Invalid playlist format. The file does not appear to be a valid M3U playlist. ' +
      'Make sure the URL points to an M3U/M3U8 file.'
    );
  }

  const playlist = parseM3UContent(content);
  
  if (playlist.length === 0) {
    throw new Error('No valid entries found in the playlist. The playlist might be empty or malformed.');
  }

  return playlist;
}

function parseM3UContent(content: string): PlaylistItem[] {
  const lines = content.split(/\r?\n/);
  const playlist: PlaylistItem[] = [];
  let currentTitle = '';

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('#EXTINF:')) {
      // Extract title from EXTINF line
      const titleMatch = trimmedLine.match(/,(.+)$/);
      currentTitle = titleMatch ? titleMatch[1].trim() : 'Untitled';
    } else if (trimmedLine && !trimmedLine.startsWith('#')) {
      // Handle both absolute and relative URLs
      let url = trimmedLine;
      
      // Validate and clean URL
      try {
        // Handle relative URLs
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = new URL(url, window.location.origin).href;
        }
        
        // Test if URL is valid
        new URL(url);
        
        playlist.push({
          title: currentTitle || 'Untitled',
          url: url,
        });
      } catch (e) {
        console.warn('Invalid URL in playlist:', url);
      }
      
      currentTitle = '';
    }
  });

  return playlist;
}