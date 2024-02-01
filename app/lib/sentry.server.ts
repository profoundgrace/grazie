import { subject as Subject } from '@casl/ability';
import { getUser } from '~/lib/user.server';

export async function sentry(
  request,
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
