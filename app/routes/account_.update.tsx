import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { sentry } from '~/lib/sentry.server';
import { updateUser } from '~/lib/user.server';
import { createAbility, getSession } from '~/utils/session.server';
import { site } from '@/grazie';
import { jsonWithError, redirectWithToast } from 'remix-toast';

export function meta() {
  return [{ title: `Update Account${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'read', subject: 'Dashboard' });
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'read', subject: 'Dashboard' });
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId') as number;
  const updates = { id: userId };
  const username = form.get('username') as string;

  if (username) {
    updates.username = username;
  }
  const displayName = form.get('displayName') as string;

  if (displayName) {
    updates.displayName = displayName;
  }
  const email = form.get('email') as string;

  if (email) {
    updates.email = email;
  }
  const currentPassword = form.get('cpassword') as string;
  const newPassword = form.get('npassword') as string;

  if (currentPassword && newPassword) {
    updates.currentPassword = currentPassword;
    updates.newPassword = newPassword;
  }
  const colorScheme = form.get('colorScheme') as string;

  if (colorScheme) {
    updates.colorScheme = colorScheme;
  }
  const file = form.get('file') as string;
  const fileType = form.get('fileType') as string;

  if (file && fileType) {
    const avatar = {} as { mime: string; base64: string; name?: string };
    avatar.mime = fileType;
    avatar.base64 = file.split(',')[1];
    updates.avatar = avatar;
  }
  if (await updateUser(updates)) {
    return redirectWithToast(`/dashboard/account`, {
      message: 'Account Updated!',
      type: 'success'
    });
  } else {
    return jsonWithError({}, { message: 'An Error Occurred!' });
  }
}
