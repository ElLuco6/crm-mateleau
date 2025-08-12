import Mailjet from 'node-mailjet';
import { EmailPayload, EmailProvider } from './email.provider';

const client = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC as string,
  apiSecret: process.env.MJ_APIKEY_PRIVATE as string,
});

export class MailjetProvider implements EmailProvider {
  async send(payload: EmailPayload): Promise<void> {
    const From = {
      Email: process.env.MAIL_FROM as string,
      Name: process.env.MAIL_FROM_NAME || 'Mateleau',
    };

    const Messages = payload.to.map((rcpt:any) => {
      const base = {
        From,
        To: [{ Email: rcpt.email, Name: rcpt.name }],
        Headers: payload.headers,
        CustomCampaign: payload.tags?.join(','),
      } as any;

      // Mode template Mailjet (TemplateID) OU contenu direct (HTML/Text)
      if (payload.templateId) {
        return {
          ...base,
          TemplateID: payload.templateId,
          TemplateLanguage: true,
          Variables: payload.variables || {},
        };
      }
      return {
        ...base,
        Subject: payload.subject,
        HTMLPart: payload.html,
        TextPart: payload.text,
      };
    });

    await client.post('send', { version: 'v3.1' }).request({ Messages });
  }
}
