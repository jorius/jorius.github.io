// The video id of a YouTube watch, short or embed URL; null for anything else.
export const youtubeId = (url: string): string | null => {
  const m = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([\w-]{11})/.exec(url);
  return m ? m[1] : null;
};
