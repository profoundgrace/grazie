import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  ColorPicker,
  Grid,
  Group,
  List,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Tabs,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  Title,
  rem
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import type { JSONContent } from '@tiptap/core';
import type { Dispatch, SetStateAction } from 'react';
import { Fragment, memo, useEffect, useState } from 'react';
import MantineEditor from '~/components/Tiptap/Editor';
import { DebugCollapse } from '../DebugCollapse';
import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconIndentDecrease,
  IconIndentIncrease,
  IconPlus,
  IconX
} from '@tabler/icons-react';
import { getHotkeyHandler, useHotkeys } from '@mantine/hooks';

type Editor = {
  id?: number | null;
  createdAt?: string | null;
  pinned?: boolean;
  body?: {
    type?: string;
    content?: JSONContent[] | undefined;
    list?: JSONContent[] | undefined;
  };
  search?: string;
  title?: string;
  closeEditor?: Dispatch<SetStateAction<string | null>>;
  labels?: { category: { name: string } }[];
};

const SubItemList = ({ focus, form, data, path, parent }) => {
  const defaultList = {
    label: '',
    list: []
  };

  const depth = path.match('.list').length;

  const addItem = (path: string | undefined, at: number | undefined) => {
    if (path && typeof at === 'number') {
      console.log(at);
      form.insertListItem(path, defaultList, at + 1);
    } else {
      form.setFieldValue(
        `body.list.${form.values?.body?.list.length}`,
        defaultList
      );
    }
  };

  const AddItemBtn = ({
    path,
    at
  }: {
    path: string | undefined;
    at: number | undefined;
  }) => {
    return (
      <Button
        leftSection={<IconPlus />}
        onClick={() => addItem(path, at)}
        size={path ? 'compact-sm' : 'compact-md'}
        variant="transparent"
      >
        {path ? 'Insert' : 'Add'} Item
      </Button>
    );
  };

  const moveItem = (
    data: object,
    atPath: string,
    at: number,
    toPath: string,
    to: number
  ) => {
    form.insertListItem(toPath, data, to);
    form.removeListItem(atPath, at);
  };

  const IndentItemBtn = ({
    data,
    atPath,
    at,
    toPath,
    to
  }: {
    data: object;
    atPath: string;
    at: number;
    toPath: string;
    to: number;
  }) => {
    return (
      <Button
        leftSection={<IconIndentIncrease />}
        onClick={() => moveItem(data, atPath, at, toPath, to)}
        size="compact-sm"
        variant="transparent"
      >
        Indent Item
      </Button>
    );
  };

  const DeIndentItemBtn = ({
    data,
    atPath,
    at,
    toPath,
    to
  }: {
    data: object;
    atPath: string;
    at: number;
    toPath: string;
    to: number;
  }) => {
    return (
      <Button
        leftSection={<IconIndentDecrease />}
        onClick={() => moveItem(data, atPath, at, toPath, to)}
        size="compact-sm"
        variant="transparent"
      >
        De-indent Item
      </Button>
    );
  };

  return (
    <List
      type={form.values.body?.listType === 'ordered' ? 'ordered' : undefined}
      styles={{
        itemLabel: { width: '100%' },
        itemWrapper: { width: '100%' }
      }}
      withPadding
    >
      {data?.map((list: any, key: any) => (
        <Fragment key={`${path}-${key}`}>
          <List.Item
            icon={
              form.values.body.listType === 'checked-icon' &&
              (data[key]?.checked ? (
                <ActionIcon
                  color={`green.${depth + 2}`}
                  onClick={() =>
                    form.setFieldValue(`${path}.${key}.checked`, false)
                  }
                  variant="subtle"
                >
                  <IconCircleCheck />
                </ActionIcon>
              ) : (
                <ActionIcon
                  onClick={() =>
                    form.setFieldValue(`${path}.${key}.checked`, true)
                  }
                  variant="subtle"
                >
                  <IconCircleDashed />
                </ActionIcon>
              ))
            }
          >
            <Textarea
              key={`${path}-${key}-input`}
              placeholder="List Item"
              {...form.getInputProps(`${path}.${key}.label`)}
              onChange={({ currentTarget: { value } }) =>
                form.setFieldValue(`${path}.${key}.label`, value)
              }
              onFocus={() => focus.set(`${path}.${key}`)}
              onKeyDown={getHotkeyHandler([
                ['enter', () => addItem(path, key), { preventDefault: true }],
                [
                  'backspace',
                  () => {
                    if (data[key].label?.length === 0) {
                      form.removeListItem(`${path}`, key);
                    }
                  },
                  {
                    preventDefault: data[key].label?.length === 0
                  }
                ]
              ])}
              rightSection={
                focus.item === `${path}.${key}` && (
                  <ActionIcon
                    onClick={() => form.removeListItem(`${path}`, key)}
                    variant="subtle"
                  >
                    <IconX color="red" />
                  </ActionIcon>
                )
              }
              autosize
              minRows={1}
              variant="unstyled"
            />
          </List.Item>
          {focus.item === `${path}.${key}` && (
            <AddItemBtn path={path} at={key} />
          )}
          {focus.item === `${path}.${key}` && key > 0 && (
            <>
              <DeIndentItemBtn
                data={data[key]}
                at={key}
                atPath={path}
                to={data[key + 1]?.list.length}
                toPath={`${path}.${key + 1}.list`}
              />
              <IndentItemBtn
                data={data[key]}
                at={key}
                atPath={path}
                to={data[key - 1]?.list.length}
                toPath={`${path}.${key - 1}.list`}
              />
            </>
          )}
          {data[key]?.list?.length > 0 && (
            <SubItemList
              focus={focus}
              form={form}
              data={data[key]?.list}
              path={`${path}.${key}.list`}
              parent={{ path, key }}
            />
          )}
        </Fragment>
      ))}
    </List>
  );
};

const ListEditor = ({ form }: { form: any }) => {
  const defaultList = {
    label: '',
    list: []
  };

  const [focusedItem, setFocusedItem] = useState(null);

  const addItem = (path: string | undefined, at: number | undefined) => {
    if (path && typeof at === 'number') {
      console.log(at);
      form.insertListItem(path, defaultList, at + 1);
    } else {
      form.setFieldValue(
        `body.list.${form.values?.body?.list.length}`,
        defaultList
      );
    }
  };

  const AddItemBtn = ({
    path,
    at
  }: {
    path: string | undefined;
    at: number | undefined;
  }) => {
    return (
      <Button
        leftSection={<IconPlus />}
        onClick={() => addItem(path, at)}
        size={path ? 'compact-sm' : 'compact-md'}
        variant="transparent"
      >
        {path ? 'Insert' : 'Add'} Item
      </Button>
    );
  };

  const moveItem = (
    data: object,
    atPath: string,
    at: number,
    toPath: string,
    to: number
  ) => {
    form.insertListItem(toPath, data, to);
    form.removeListItem(atPath, at);
  };

  const IndentItemBtn = ({
    data,
    atPath,
    at,
    toPath,
    to
  }: {
    data: object;
    atPath: string;
    at: number;
    toPath: string;
    to: number;
  }) => {
    return (
      <Button
        leftSection={<IconIndentIncrease />}
        onClick={() => moveItem(data, atPath, at, toPath, to)}
        size="compact-sm"
        variant="transparent"
      >
        Indent Item
      </Button>
    );
  };

  return (
    <Box>
      <Group>
        <Text>List Type</Text>
        <SegmentedControl
          value={form.values.body?.listType ?? 'unordered'}
          onChange={(value) => form.setFieldValue(`body.listType`, value)}
          data={[
            { label: 'Unordered', value: 'unordered' },
            { label: 'Ordered', value: 'ordered' },
            // { label: 'Icon', value: 'icon' },
            { label: 'Checked Icon', value: 'checked-icon' }
          ]}
        />
      </Group>
      {false &&
        (form.values.body?.listType === 'icon' ||
          form.values.body?.listType === 'checked-icon') && (
          <Box>
            <Text>Icon Color</Text>
            <ColorPicker
              value={form.values.body?.iconColor ?? undefined}
              onChange={(value) => form.setFieldValue(`body.iconColor`, value)}
            />
          </Box>
        )}
      <List
        type={form.values.body?.listType === 'ordered' ? 'ordered' : undefined}
        styles={{
          itemLabel: { width: '100%' },
          itemWrapper: { width: '100%' }
        }}
      >
        {form.values?.body?.list?.map((list: any, key: any) => (
          <Fragment key={`list-${key}`}>
            <List.Item
              icon={
                form.values.body.listType === 'checked-icon' &&
                (form.values.body?.list[key]?.checked ? (
                  <ActionIcon
                    color="green.5"
                    onClick={() =>
                      form.setFieldValue(`body.list.${key}.checked`, false)
                    }
                    variant="subtle"
                  >
                    <IconCircleCheck />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    onClick={() =>
                      form.setFieldValue(`body.list.${key}.checked`, true)
                    }
                    variant="subtle"
                  >
                    <IconCircleDashed />
                  </ActionIcon>
                ))
              }
            >
              <Textarea
                placeholder="List Item"
                {...form.getInputProps(`body.list.${key}.label`)}
                onChange={({ currentTarget: { value } }) =>
                  form.setFieldValue(`body.list.${key}.label`, value)
                }
                onFocus={() => setFocusedItem(`body.list.${key}`)}
                onKeyDown={getHotkeyHandler([
                  ['enter', () => addItem(key), { preventDefault: true }],
                  [
                    'backspace',
                    () => {
                      if (form.values.body.list[key].label?.length === 0) {
                        form.removeListItem(`body.list`, key);
                      }
                    },
                    {
                      preventDefault:
                        form.values.body.list[key].label?.length === 0
                    }
                  ]
                ])}
                rightSection={
                  focusedItem === `body.list.${key}` && (
                    <ActionIcon
                      onClick={() => form.removeListItem(`body.list`, key)}
                      variant="subtle"
                    >
                      <IconX color="red" />
                    </ActionIcon>
                  )
                }
                autosize
                minRows={1}
                variant="unstyled"
              />
            </List.Item>
            {focusedItem === `body.list.${key}` &&
              key !== form.values?.body?.list?.length - 1 && (
                <AddItemBtn path="body.list" at={key} />
              )}
            {focusedItem === `body.list.${key}` && key > 0 && (
              <IndentItemBtn
                data={form.values.body.list[key]}
                at={key}
                atPath={`body.list`}
                to={form.values.body.list[key - 1]?.list.length}
                toPath={`body.list.${key - 1}.list`}
              />
            )}
            {form.values?.body?.list[key]?.list?.length > 0 && (
              <SubItemList
                focus={{ item: focusedItem, set: setFocusedItem }}
                form={form}
                data={form.values?.body?.list[key]?.list}
                path={`body.list.${key}.list`}
                parent={{ path: 'body.list', key }}
              />
            )}
          </Fragment>
        ))}
      </List>
      <AddItemBtn />
    </Box>
  );
};

const NoteEditor = ({
  id = null,
  createdAt = null,
  pinned = false,
  body = { type: 'doc', content: [], list: [] },
  search = '',
  title = '',
  labels,
  closeEditor
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      createdAt,
      pinned,
      body: typeof body === 'string' ? JSON.parse(body) : body,
      search,
      title,
      labels:
        labels && labels?.length > 0
          ? labels.map((cat) => cat.category.name)
          : []
    }
  });

  const loaderData = useLoaderData();
  const { labels: labelsList } = loaderData;

  const [catSearchValue, setCatSearchValue] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/note/create' : '/note/update';

  const submit = useSubmit();

  const navigate = useNavigate();

  const DiscardBtn = () => (
    <Button color="red" onClick={() => navigate('/notes')} variant="light">
      Discard
    </Button>
  );

  const CancelBtn = ({ id }: { id: number }) => (
    <Button
      color="yellow"
      onClick={() => navigate(`/note/${id}`)}
      variant="light"
    >
      Cancel
    </Button>
  );

  const CloseBtn = () => {
    return closeEditor ? (
      <Button color="yellow" onClick={() => closeEditor('')} variant="light">
        Cancel
      </Button>
    ) : null;
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>Note Editor</Title>
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
                <Tabs defaultValue="text" keepMounted={false}>
                  <Tabs.List grow>
                    <Tabs.Tab value="text">Text</Tabs.Tab>
                    <Tabs.Tab value="list">List</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="text" py={10}>
                    <MantineEditor name="body" form={form} withSearch />
                  </Tabs.Panel>
                  <Tabs.Panel value="list" py={10}>
                    <ListEditor form={form} />
                  </Tabs.Panel>
                </Tabs>
                <input
                  type="hidden"
                  name="body"
                  value={JSON.stringify(form.values.body)}
                />
                <input type="hidden" name="search" value={form.values.search} />
                <Switch
                  name="pinned"
                  checked={form?.values?.pinned}
                  size="lg"
                  onLabel="Pinned"
                  offLabel="Unpinned"
                  onChange={(event) =>
                    form.setFieldValue('pinned', event.currentTarget.checked)
                  }
                />
                <TagsInput
                  data={
                    labelsList?.nodes?.length > 0
                      ? labelsList?.nodes?.map(
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
                  label="Labels"
                  name="labels"
                  onSearchChange={setCatSearchValue}
                  placeholder="Labels"
                  searchValue={catSearchValue}
                  {...form.getInputProps('labels')}
                />
              </Stack>
              <Group align="center" mt="md">
                <Button color="green" type="submit" variant="light">
                  {id ? 'Update' : 'Save'}
                </Button>
                {closeEditor && <CloseBtn />}
                {!id && !closeEditor && <DiscardBtn />}
                {id && !closeEditor && <CancelBtn id={id} />}
              </Group>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default NoteEditor;
