// __tests__/mailjet.provider.test.ts
import type { EmailPayload } from '../../../services/providers/email.provider'; // <-- ajuste le chemin

// Mock Mailjet une seule fois (au top du fichier)
jest.mock('node-mailjet', () => {
  const requestMock = jest.fn().mockResolvedValue({});
  const postMock = jest.fn().mockReturnValue({ request: requestMock });

  // constructeur "par défaut" retourné par `new Mailjet(...)`
  const MailjetCtor = jest.fn(() => ({ post: postMock }));

  // on expose les mocks pour les assertions
  (MailjetCtor as any).__postMock = postMock;
  (MailjetCtor as any).__requestMock = requestMock;

  return { __esModule: true, default: MailjetCtor };
});

describe('MailjetProvider', () => {
  beforeEach(() => {
    jest.resetModules(); // IMPORTANT: réinitialise le cache des modules

    // Var d’env lues au top-level dans le provider
    process.env.MJ_APIKEY_PUBLIC  = 'pub';
    process.env.MJ_APIKEY_PRIVATE = 'priv';
    process.env.MAIL_FROM         = 'noreply@test.tld';
    process.env.MAIL_FROM_NAME    = 'Sender';
  });

  it('envoie via TemplateID (TemplateLanguage + Variables + CustomCampaign + Headers)', async () => {
    // importe APRÈS avoir défini les env
    const MailjetDefault: any = (await import('node-mailjet')).default;
    const { MailjetProvider } = await import('../../../services/providers/mailjet.provider');

    const provider = new MailjetProvider();

    const payload: EmailPayload = {
      to: [{ email: 'a@b.c', name: 'Alice' }],
      templateId: 123,
      variables: { firstName: 'Alice' },
      tags: ['welcome', 'v1'],
      headers: { 'X-Test': '1' },
    };

    await provider.send(payload);

    // appel POST correct
    expect(MailjetDefault.__postMock).toHaveBeenCalledWith('send', { version: 'v3.1' });

    // contenu de la requête
    const sentBody = MailjetDefault.__requestMock.mock.calls[0][0];
    expect(Array.isArray(sentBody.Messages)).toBe(true);
    expect(sentBody.Messages).toHaveLength(1);

    expect(sentBody.Messages[0]).toMatchObject({
      From: { Email: 'noreply@test.tld', Name: 'Sender' },
      To: [{ Email: 'a@b.c', Name: 'Alice' }],
      Headers: { 'X-Test': '1' },
      CustomCampaign: 'welcome,v1',
      TemplateID: 123,
      TemplateLanguage: true,
      Variables: { firstName: 'Alice' },
    });

    // pas de contenu direct quand TemplateID est utilisé
    expect(sentBody.Messages[0]).not.toHaveProperty('Subject');
    expect(sentBody.Messages[0]).not.toHaveProperty('HTMLPart');
    expect(sentBody.Messages[0]).not.toHaveProperty('TextPart');
  });

  it('envoie contenu direct (Subject/HTMLPart/TextPart) sans TemplateID', async () => {
    const MailjetDefault: any = (await import('node-mailjet')).default;
    const { MailjetProvider } = await import('../../../services/providers/mailjet.provider');

    const provider = new MailjetProvider();

    const payload: EmailPayload = {
      to: [
        { email: 'b@c.d', name: 'Bob' },
        { email: 'c@d.e' }, // name optionnel
      ],
      subject: 'Hello',
      html: '<p>Hello</p>',
      text: 'Hello',
      headers: { 'X-Env': 'test' },
    };

    await provider.send(payload);

    const sentBody = MailjetDefault.__requestMock.mock.calls[0][0];
    expect(sentBody.Messages).toHaveLength(2); // 1 message par destinataire

    // 1er message
    expect(sentBody.Messages[0]).toMatchObject({
      From: { Email: 'noreply@test.tld', Name: 'Sender' },
      To: [{ Email: 'b@c.d', Name: 'Bob' }],
      Subject: 'Hello',
      HTMLPart: '<p>Hello</p>',
      TextPart: 'Hello',
      Headers: { 'X-Env': 'test' },
    });

    // 2e message
    expect(sentBody.Messages[1]).toMatchObject({
      To: [{ Email: 'c@d.e', Name: undefined }],
      Subject: 'Hello',
      HTMLPart: '<p>Hello</p>',
      TextPart: 'Hello',
    });

    // pas de TemplateID quand on est en contenu direct
    expect(sentBody.Messages[0]).not.toHaveProperty('TemplateID');
  });
});
