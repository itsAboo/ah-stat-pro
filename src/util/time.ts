export const formatTimeAgo = (dateString: string | number | Date): string => {
  const now = Date.now();
  const created = new Date(dateString).getTime();
  const seconds = Math.floor((now - created) / 1000);

  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};
