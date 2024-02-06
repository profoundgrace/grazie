import { subject as Subject } from '@casl/ability';

export async function sentry(
  request: Request,
  {
    action,
    subject,
    field = {}
  }: { action: string; subject: string; field?: object }
) {
  if (!request.ability.can(action, Subject(subject, field))) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found'
    });
  }
}
