import { getVerses } from '!~/lib/kjv.server';
import {
  Anchor,
  Box,
  Button,
  Card,
  Grid,
  Highlight,
  SegmentedControl,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  Form,
  Link,
  type LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useSearchParams,
  useSubmit
} from 'react-router';
import Pager from '~/components/Pager/Pager';
import { SEO } from '~/utils/meta';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Holy Bible`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const { count, page, pagerLoader } = pagerParams(request, 25);

  const url = new URL(request.url);
  const search = url.searchParams.get('q');

  const filter = {
    search,
    ot: url.searchParams.get('testament') === 'old',
    nt: url.searchParams.get('testament') === 'new'
  };

  const verses = search
    ? await getVerses({
        filter,
        select: {
          id: true,
          bid: true,
          ch: true,
          ver: true,
          txt: true,
          coding: true,
          book: {
            select: {
              id: true,
              chs: true,
              book: true,
              abbr: true,
              slug: true
            }
          }
        },
        limit: count,
        offset: page ? (page - 1) * count : 0
      })
    : null;

  return { verses, pager: pagerLoader(verses?.totalCount) };
}

export default function Bible() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') ?? '';
  const testament = searchParams.get('testament') ?? 'all';

  const form = useForm({
    initialValues: {
      q: search,
      testament
    },
    validate: {
      q: (value) => (value.length === 0 ? 'Search is required' : null)
    }
  });

  const submit = useSubmit();

  const verses = data?.verses?.nodes;
  const pager = data?.pager;

  console.log(data);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Holy Bible</Title>
        <Title order={1}>Search</Title>
        <Grid my={10}>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Form
              method="GET"
              action="/bible/search"
              onSubmit={form.onSubmit((_v, e) => {
                form.resetTouched();
                submit(e.currentTarget);
              })}
            >
              <TextInput
                label="Search"
                name="q"
                placeholder="Search"
                {...form.getInputProps('q')}
              />
              <Box mt="md">
                <SegmentedControl
                  name="testament"
                  data={[
                    { label: 'All', value: 'all' },
                    {
                      label: 'Old Testament',
                      value: 'old'
                    },
                    {
                      label: 'New Testament',
                      value: 'new'
                    }
                  ]}
                  {...form.getInputProps('testament')}
                  onChange={(value) => form.setFieldValue('testament', value)}
                />
              </Box>
              <Button type="submit" mt="sm">
                {form.isTouched() ? 'Update Search' : 'Search'}
              </Button>
            </Form>
          </Grid.Col>
        </Grid>
        {verses?.length > 0 ? (
          <Box>
            {pager.total > 1 && <Pager />}
            {verses?.map((verse) => (
              <Card
                key={`search-${verse.id}`}
                padding="sm"
                shadow="sm"
                radius="md"
                mt="sm"
                withBorder
              >
                <Card.Section withBorder inheritPadding py="xs">
                  <Anchor
                    component={Link}
                    to={`/bible/${verse.book.slug}/${verse.ch}?search=${search}`}
                    fw={700}
                    fz="lg"
                  >
                    {verse.book.book} {verse.ch}:{verse.ver}
                  </Anchor>
                </Card.Section>
                <Highlight
                  color="rgb(241, 229, 158)"
                  highlight={search}
                  pt={10}
                >
                  {verse.txt}
                </Highlight>
              </Card>
            ))}
            {pager.total > 1 && <Pager />}
          </Box>
        ) : (
          <>{search !== '' && <Text size="lg">No results found</Text>}</>
        )}
      </Grid.Col>
    </Grid>
  );
}
