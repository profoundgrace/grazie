import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  MultiSelect,
  Select,
  Stack,
  Switch,
  TagsInput,
  TextInput,
  Title
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useLoaderData, useSubmit } from '@remix-run/react';
import type { JSONContent } from '@tiptap/core';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import MantineEditor from '~/components/Tiptap/Editor';

interface Editor {
  id?: string | null;
  createdAt?: string | null;
  published?: boolean;
  publishedAt?: string | null;
  status?: string;
  summary?: string;
  body?: { type?: string; content?: JSONContent[] | undefined };
  title?: string;
  closeEditor?: Dispatch<SetStateAction<string | null>>;
  stream?: { id: string; name: string };
  slug?: string | null;
  slugFormat?: string | null;
  categories?: { slug: string }[];
}

const ArticleEditor = ({
  id = null,
  createdAt = null,
  published = false,
  publishedAt = null,
  status = '',
  summary = '',
  body = { type: 'doc' },
  title = '',
  slug,
  slugFormat,
  categories,
  closeEditor = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      createdAt,
      published,
      publishedAt,
      status,
      summary,
      body,
      title,
      slug,
      slugFormat: slugFormat ?? 'title-id',
      categories:
        categories?.length > 0
          ? categories.map((cat: { slug: string }) => cat.slug)
          : []
    }
  });

  const loaderData = useLoaderData();
  const { categories: categoriesList } = loaderData;

  const [catSearchValue, setCatSearchValue] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/posts/create' : '/posts/update';

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>Post Editor</Title>
          </Card.Section>
          <Card.Section p={10}>
            {errorMsg ? (
              <Alert title="Error" color="red">
                {errorMsg}
              </Alert>
            ) : null}
            <Form
              method="POST"
              action={route}
              onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
            >
              <Stack>
                {id && <input type="hidden" name="id" value={id} />}
                <TextInput
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  {...form.getInputProps('title')}
                />
                <MantineEditor name="body" form={form} />
                <input
                  type="hidden"
                  name="body"
                  value={JSON.stringify(form.values.body)}
                />
                <Switch
                  name="published"
                  checked={form?.values?.published}
                  size="lg"
                  onLabel="Published"
                  offLabel="Draft"
                  onChange={(event) =>
                    form.setFieldValue('published', event.currentTarget.checked)
                  }
                />
                {form.values.published && (
                  <DateTimePicker
                    name="publishedAt"
                    valueFormat="DD MMM YYYY hh:mm A"
                    label="Schedule Published Date (optional)"
                    placeholder="Pick date and time"
                    {...form.getInputProps('publishedAt')}
                  />
                )}
                <Select
                  name="slugFormat"
                  label="URL Format"
                  placeholder="Select URL Format"
                  {...form.getInputProps('slugFormat')}
                  data={[
                    { value: '', label: 'Select URL Format' },
                    {
                      value: 'custom',
                      label: `Custom (/your-slug-here)`
                    },
                    {
                      value: 'date-id',
                      label: `Date-ID (/yyyy-mm-dd-id)`
                    },
                    {
                      value: 'date-title',
                      label: `Date-Title (/yyyy-mm-dd-title)`
                    },
                    {
                      value: 'id',
                      label: `ID (/id)`
                    },
                    {
                      value: 'id-title',
                      label: `ID-Title (/id-title)`
                    },
                    {
                      value: 'title',
                      label: `Title (/title)`
                    },
                    {
                      value: 'title-id',
                      label: `Title-ID (/title-id)`
                    }
                  ]}
                />
                <TextInput
                  label="URL Slug"
                  name="slug"
                  type="text"
                  placeholder={
                    form.values.slugFormat === 'custom'
                      ? 'Add a Custom URL Slug'
                      : form.values?.slug ?? 'System Generated'
                  }
                  {...form.getInputProps('slug')}
                  onChange={({ currentTarget: { value } }) =>
                    form.setFieldValue('slug', value)
                  }
                  disabled={!(form.values.slugFormat === 'custom')}
                />
                <TagsInput
                  data={
                    categoriesList?.nodes?.length > 0
                      ? categoriesList?.nodes?.map(
                          (cat: {
                            name: string;
                            slug: string;
                            parent: { name: string };
                          }) => ({
                            value: cat.slug,
                            label: cat.name
                          })
                        )
                      : []
                  }
                  label="Categories"
                  name="categories"
                  onSearchChange={setCatSearchValue}
                  placeholder="Categories"
                  searchValue={catSearchValue}
                  {...form.getInputProps('categories')}
                />
              </Stack>
              <Group align="center" mt="md">
                <Button type="submit">Save</Button>
                <Button onClick={() => closeEditor('')}>Cancel</Button>
              </Group>
            </Form>
            <pre>{JSON.stringify(form.values, null, 2)}</pre>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default ArticleEditor;
