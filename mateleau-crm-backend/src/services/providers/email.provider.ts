export type EmailRecipient = { email: string; name?: string };

export type EmailPayload = {
  to: EmailRecipient[];
  subject?: string;
  html?: string;
  text?: string;
  tags?: string[];
  headers?: Record<string, string>;
  templateId?: number;            
  variables?: Record<string, any>; 
};

export interface EmailProvider {
  send(payload: EmailPayload): Promise<void>;
}
