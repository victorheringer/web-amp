/**
 * Extrai o videoId de URLs do YouTube em diversos formatos
 * Suporta:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    
    // Format: youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      return urlObj.searchParams.get('v');
    }
    
    // Format: youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    
    // Format: youtube.com/embed/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      return urlObj.pathname.split('/')[2];
    }
    
    // Format: youtube.com/shorts/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/shorts/')) {
      return urlObj.pathname.split('/')[2];
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao extrair videoId:', error);
    return null;
  }
};

/**
 * Converte videoId para URL de embed do YouTube
 */
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Obtém URL da thumbnail do vídeo do YouTube
 */
export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**
 * Extrai o ID de um vídeo do SoundCloud (placeholder para implementação futura)
 */
export const extractSoundCloudId = (url: string): string | null => {
  // TODO: Implementar extração de ID do SoundCloud
  return null;
};
