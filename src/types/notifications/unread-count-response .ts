export interface UnreadCountResponse  {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}