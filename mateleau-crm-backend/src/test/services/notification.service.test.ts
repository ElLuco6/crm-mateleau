// keep this at the top of your spec
const sendMock = jest.fn<Promise<void>, [any]>(); // 👈 return Promise<void>, accepts any payload

jest.mock('../../services/providers/mailjet.provider', () => ({
  MailjetProvider: jest.fn().mockImplementation(() => ({
    send: sendMock,
  })),
}));

jest.mock('../../services/DiveService', () => ({
  getDiveDetailById: jest.fn(),
}));

import { NotificationService } from '../../services/NotificationService';
import { getDiveDetailById } from '../../services/DiveService';

type GetDiveDetail = typeof getDiveDetailById;
const getDiveDetailByIdMock = getDiveDetailById as jest.MockedFunction<GetDiveDetail>; // 👈 typed alias

beforeEach(() => {
  jest.clearAllMocks();
  process.env.NODE_ENV = 'test';
});

// happy path
it('envoie 1 mail par destinataire et retourne les compteurs', async () => {
  getDiveDetailByIdMock.mockResolvedValue({
    _id: 'd123',
    name: 'Plongée du matin',
    location: 'Nice',
    date: '2025-01-01T09:00:00Z',
    duration: 60,
    maxDepth: 30,
    boat: { name: 'Blue' },
    divingGroups: [
      { divers: [{ firstName: 'A', lastName: 'A', email: 'a@a.com' }] },
      { divers: [{ email: 'b@b.com' }] },
    ],
  } as any); // 👈 cast simple si ton type Dive est strict

  sendMock.mockResolvedValue(undefined); // 👈 ok: Promise<void>

  const res = await NotificationService.notifyDiveDivers('d123', { templateId: 456 });

  expect(sendMock).toHaveBeenCalledTimes(2);
  const firstCallArg = sendMock.mock.calls[0][0];
  expect(firstCallArg.to[0].email).toBe('a@a.com');
  expect(firstCallArg.templateId).toBe(456);
  expect(res).toEqual({ sent: 2, skipped: 0, errors: 0, templateIdUsed: 456 });
});

// no recipients
it('retourne 0/0/0 s’il n’y a aucun destinataire', async () => {
  getDiveDetailByIdMock.mockResolvedValue({
    _id: 'd0',
    divingGroups: [{ divers: [{ email: '' }] }, { divers: [] }],
  } as any);

  const res = await NotificationService.notifyDiveDivers('d0', { templateId: 111 });

  expect(sendMock).not.toHaveBeenCalled();
  expect(res).toEqual({ sent: 0, skipped: 0, errors: 0 });
});
