// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs
} from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from '@remix-run/react';
import {
  Button,
  ColorSchemeScript,
  Container,
  Group,
  MantineProvider,
  Title,
  Text
} from '@mantine/core';
import { getUser } from '~/utils/session.server';
import { ThemeProvider } from '~/theme';
import classes from '~/styles/NotFound.module.css';
import { setting } from './lib/setting.server';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    user: await getUser(request),
    theme: { navbar: { links: await setting({ name: 'navbar.links' }) } }
  });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto">
          <ThemeProvider>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </ThemeProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

function ErrorPage({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta title="Error" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto">
          <ThemeProvider>
            {children}
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </ThemeProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return (
          <ErrorPage>
            <Container className={classes.root}>
              <div className={classes.label}>404</div>
              <Title className={classes.title}>
                Unable to find the page you requested.
              </Title>
              <Text
                c="dimmed"
                size="lg"
                ta="center"
                className={classes.description}
              >
                Please check the URL, and failing that, report the issue to us.
              </Text>
              <Group justify="center">
                <Button variant="subtle" size="md">
                  Take me back to home page
                </Button>
              </Group>
            </Container>
          </ErrorPage>
        );
      default:
        return (
          <ErrorPage>
            <Container className={classes.root}>
              <div className={classes.label}>{error.status}</div>
              <Text
                c="dimmed"
                size="lg"
                ta="center"
                className={classes.description}
              >
                {error.data.message}
              </Text>
            </Container>
          </ErrorPage>
        );
    }
  }
  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = 'Unknown error';
  if (error?.message) {
    errorMessage = error.message;
  }

  return (
    <ErrorPage>
      <Container className={classes.root}>
        <div className={classes.label}>Error</div>
        <Title className={classes.title}>Something went wrong.</Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          {errorMessage}
        </Text>
        <Group justify="center">
          <Button variant="subtle" size="md">
            Take me back to home page
          </Button>
        </Group>
      </Container>
    </ErrorPage>
  );
}
