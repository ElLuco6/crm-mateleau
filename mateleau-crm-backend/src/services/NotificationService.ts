// src/services/notification/notification.service.ts
import { MailjetProvider } from './providers/mailjet.provider';
import { getDiveDetailById } from './DiveService';

type Recipient = { email: string; name?: string };
const isProd = process.env.NODE_ENV === 'production';

function formatFr(date: string | Date) {
  return new Date(date).toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

export class NotificationService {
  /**
   * Envoie un rappel par email à TOUS les plongeurs d'une plongée (guides/staff exclus).
   * Utilise un template Mailjet (TemplateID requis).
   */
  static async notifyDiveDivers(
    diveId: string,
    opts?: { templateId?: number } // optionnel
  ): Promise<{ sent: number; skipped: number; errors: number; templateIdUsed?: number }> {
    const dive: any = await getDiveDetailById(diveId);

    // destinataires = uniquement les divers avec email
    const recipients = new Map<string, { email: string; name?: string }>();
    for (const g of dive.divingGroups ?? []) {
      for (const dv of g.divers ?? []) {
        if (dv?.email) {
          const name = [dv.firstName, dv.lastName].filter(Boolean).join(' ') || undefined;
          recipients.set(dv.email, { email: dv.email, name });
        }
      }
    }
    if (recipients.size === 0) return { sent: 0, skipped: 0, errors: 0 };

    // 1) template: env par défaut; 2) override seulement si pas en prod
    const envTpl = Number(process.env.MJ_TEMPLATE_DIVE_REMINDER);
    const templateIdUsed = !isProd && opts?.templateId ? opts.templateId : envTpl;

    if (!templateIdUsed || !Number.isFinite(templateIdUsed)) {
      throw new Error('Missing Mailjet template id: set MJ_TEMPLATE_DIVE_REMINDER in .env');
    }

    const provider = new MailjetProvider();

    const baseVars = {
      recipientName: '',
      name: dive.name,
      location: dive.location,
      date_fr: formatFr(dive.date),
      maxDepth: dive.maxDepth,
      duration: dive.duration,
      boat: dive.boat ? { name: dive.boat.name } : null,
      year: String(new Date().getFullYear()),
    };

    let sent = 0, errors = 0;
    for (const rcpt of recipients.values()) {
      try {
        await provider.send({
          to: [rcpt],
          templateId: templateIdUsed,
          variables: { ...baseVars, recipientName: rcpt.name || 'Plongeur' },
          tags: ['dive-reminder', 'diver', String(dive._id)],
        });
        sent++;
      } catch {
        errors++;
      }
    }

    const skipped = Math.max(0, recipients.size - sent);
    return { sent, skipped, errors, templateIdUsed };
  }
}
