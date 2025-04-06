
/**
 * Calculates the response rate based on messages
 */
export const calculateResponseRate = (messages: any[]): number => {
  if (messages.length === 0) return 0;
  
  const outgoingMessages = messages.filter(m => m.quien_envia === 'bot').length;
  return Math.round((outgoingMessages / messages.length) * 100);
};

/**
 * Calculates API usage percentage
 */
export const calculateApiUsage = (current: number, max: number): number => {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
};

/**
 * Groups messages by day for chart visualization
 */
export const groupMessagesByDay = (messages: any[]): any[] => {
  const groupedMessages: Record<string, number> = {};
  
  // Initialize last 7 days with 0 messages
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    groupedMessages[dateStr] = 0;
  }
  
  // Count messages per day
  messages.forEach(msg => {
    const dateStr = new Date(msg.created_at).toISOString().split('T')[0];
    groupedMessages[dateStr] = (groupedMessages[dateStr] || 0) + 1;
  });
  
  // Convert to array for chart
  return Object.entries(groupedMessages)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
