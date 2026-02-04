export interface Channel {
  id: string;
  name: string;
  imageUrl: string;
  postCount: number;
}

export interface PostHistory {
  id: string;
  channelId: string;
  channelName: string;
  channelImage: string;
  timestamp: number;
}