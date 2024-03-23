import { subject as Subject } from '@casl/ability';
import { status } from './error.server';
export async function sentry(
  request: Request,
  {
    action,
    subject,
    object = {}
  }: { action: string; subject: string; object?: object },
  { reject = true } = {}
) {
  if (!request.ability.can(action, Subject(subject, object))) {
    if (reject) {
      return status(404);
    } else {
      return false;
    }
  } else {
    return true;
  }
}
