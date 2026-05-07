export type GenerationType = 'image' | 'video';
export type AspectRatio = '1:1' | '16:9' | '9:16';

export interface Generation {
  id: string;
  url: string;
  type: GenerationType;
  prompt: string;
  aspect_ratio?: AspectRatio;
  createdAt: Date;
}

export interface GenerateRequest {
  type: GenerationType;
  prompt: string;
  aspect_ratio?: AspectRatio;
}

export interface GenerateResponse {
  url: string;
  type: GenerationType;
  prompt: string;
  error?: string;
}
