import {
  ActionIcon,
  Alert,
  Avatar,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Radio,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { Form, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import {
  IconEdit,
  IconUpload,
  IconPhoto,
  IconX,
  IconEditOff
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { DebugCollapse } from '~/components/DebugCollapse';

const CancelActionIcon = ({ action }) => {
  return (
    <ActionIcon
      color="red"
      onClick={action}
      radius="md"
      size="md"
      variant="light"
    >
      <IconEditOff size={26} />
    </ActionIcon>
  );
};

const EditActionIcon = ({ action }) => {
  return (
    <ActionIcon onClick={action} radius="md" size="md" variant="light">
      <IconEdit size={26} />
    </ActionIcon>
  );
};

const Account = ({ account }) => {
  const [errorMsg, setError] = useState('');
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const [image, setImage] = useState();
  const [file, setFile] = useState('');
  const [fields, setFields] = useState(0);
  const [edit, setEdit] = useState({ settings: {} });

  const route = '/account/update';

  const submit = useSubmit();

  const form = useForm({
    /* initialValues: {
      
      file
    }*/
    initialValues: {
      username: account?.username,
      displayName: account?.displayName,
      email: account?.email,
      cpassword: '',
      npassword: '',
      file,
      fileType: '',
      colorScheme: account?.settings?.colorScheme ?? 'auto'
    }

    /* validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }*/
  });

  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (image) {
      fileReader = new FileReader();
      fileReader.onload = (event) => {
        const { result } = fileReader;

        if (result && !isCancel) {
          setFile(result);
          form.setFieldValue('file', result);
          form.setFieldValue('fileType', image[0].type);
        } else {
          setFile('');
        }
      };
      fileReader.readAsDataURL(image[0]);
    } else {
      setFile('');
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [image]);

  const updateAccount = async (values) => {
    const avatar = image
      ? {
          mime: image[0].type,
          base64: file.split(',')[1]
        }
      : null;
    /*const { error } = await updateAccountMutation({
      variables: { ...values, file: avatar }
    });*/

    if (error) {
      setError(JSON.stringify(error, null, 2));
    }
    refetch();
  };

  useEffect(() => {
    if (
      form?.values?.colorScheme !== undefined &&
      form.values.colorScheme !== colorScheme
    ) {
      setColorScheme(form?.values?.colorScheme);
      setFields(fields + 1);
    }
  }, [
    form.values.colorScheme,
    colorScheme,
    setColorScheme,
    setFields,
    fields,
    computedColorScheme,
    form.setFieldValue
  ]);

  const add = (field, value = '') => {
    if (field === 'password') {
      setEdit({ ...edit, password: true });
      form.setFieldValue('cpassword', value);
      form.setFieldValue('npassword', value);
    } else {
      setEdit({ ...edit, [field]: true });
      form.setFieldValue(field, value);
    }
    setFields(fields + 1);
  };
  const remove = (field) => {
    if (field === 'password') {
      setEdit({ ...edit, password: false });
      form.setFieldValue('cpassword', null);
      form.setFieldValue('npassword', null);
    } else {
      setEdit({ ...edit, [field]: false });
      form.setFieldValue(field, null);
    }
    setFields(fields - 1);
  };

  return (
    <>
      <Title>Settings</Title>
      {errorMsg ? <Alert color="red">{errorMsg}</Alert> : null}
      <Form
        method="POST"
        action={route}
        onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
      >
        <Stack>
          {edit?.file ? (
            <>
              <Group justify="space-between">
                <Text fw={500} size="lg" inline>
                  Profile Image
                </Text>
                <CancelActionIcon action={() => remove('file')} />
              </Group>
              <Dropzone
                onDrop={setImage}
                //onReject={(files) => console.log('rejected files', files)}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                maxFiles={1}
                //useFsAccessApi={false}
              >
                <Group
                  justify="center"
                  gap="xl"
                  style={{ minHeight: 220, pointerEvents: 'none' }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      size={50}
                      stroke={1.5}
                      color={
                        theme.colors[theme.primaryColor][
                          theme.colorScheme === 'dark' ? 4 : 6
                        ]
                      }
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={50}
                      stroke={1.5}
                      color={
                        theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
                      }
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={50} stroke={1.5} />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Drag an image here or click to select file
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      One image allowed, choose another to override selection
                    </Text>
                    {image ? (
                      <>
                        <Avatar
                          src={URL.createObjectURL(image[0])}
                          imageProps={{
                            onLoad: () =>
                              URL.revokeObjectURL(URL.createObjectURL(image[0]))
                          }}
                          radius={100}
                          size={40}
                          mx="auto"
                          mt={10}
                        />
                        <Avatar
                          src={URL.createObjectURL(image[0])}
                          imageProps={{
                            onLoad: () =>
                              URL.revokeObjectURL(URL.createObjectURL(image[0]))
                          }}
                          radius={100}
                          size={168}
                          mx="auto"
                          mt={10}
                        />
                        <input
                          type="hidden"
                          name="file"
                          {...form.getInputProps('file')}
                        />
                        <input
                          type="hidden"
                          name="fileType"
                          {...form.getInputProps('fileType')}
                        />
                      </>
                    ) : null}
                  </div>
                </Group>
              </Dropzone>
            </>
          ) : (
            <>
              <Group justify="space-between">
                <Text fw={500} size="lg" inline>
                  Profile Image
                </Text>
                <EditActionIcon action={() => add('file', file)} />
              </Group>
              <Avatar
                src={account?.avatar?.md}
                radius={10}
                size={200}
                mx="auto"
                mt={10}
              />
            </>
          )}
          <Divider my="sm" />
          {edit?.username ? (
            <TextInput
              label="Username"
              name="username"
              type="text"
              placeholder="Enter a Username"
              rightSection={
                <CancelActionIcon action={() => remove('username')} />
              }
              {...form.getInputProps('username')}
            />
          ) : (
            <Group justify="space-between">
              <Text fw={500} size="lg">
                Username: <Text size="sm">{account.username}</Text>
              </Text>
              <EditActionIcon
                action={() => add('username', account?.username)}
              />
            </Group>
          )}
          <Divider my="sm" />
          {edit?.displayName ? (
            <TextInput
              label="Display Name"
              name="displayName"
              type="text"
              placeholder="Enter a Display"
              rightSection={
                <CancelActionIcon action={() => remove('displayName')} />
              }
              {...form.getInputProps('displayName')}
            />
          ) : (
            <Group justify="space-between">
              <Text fw={500} size="lg">
                Display Name: <Text size="sm">{account.displayName}</Text>
              </Text>
              <EditActionIcon
                action={() => add('displayName', account?.displayName)}
              />
            </Group>
          )}
          <Divider my="sm" />
          {edit?.email ? (
            <TextInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter email"
              rightSection={<CancelActionIcon action={() => remove('email')} />}
              {...form.getInputProps('email')}
            />
          ) : (
            <Group justify="space-between">
              <Text fw={500} size="lg">
                Email: <Text size="sm">{account.email}</Text>
              </Text>
              <EditActionIcon action={() => add('email', account?.email)} />
            </Group>
          )}
          <Divider my="sm" />
          {edit?.password ? (
            <>
              <Group justify="space-between">
                <Text fw={500} size="lg">
                  Update Password
                </Text>
                <CancelActionIcon action={() => remove('password')} />
              </Group>
              <PasswordInput
                label="Current Password"
                name="cpassword"
                placeholder="Current Password"
                {...form.getInputProps('cpassword')}
              />
              <PasswordInput
                label="New Password"
                name="npassword"
                placeholder="New Password"
                {...form.getInputProps('npassword')}
              />
            </>
          ) : (
            <Group justify="space-between">
              <Text fw={500} size="lg">
                Update Password
              </Text>
              <EditActionIcon action={() => add('password', '')} />
            </Group>
          )}
          <Divider my="sm" />

          <Text fw={500} size="lg">
            Theme
          </Text>

          <Radio.Group
            name="colorScheme"
            label="Select your preferred Color Scheme"
            description={
              colorScheme === 'auto' &&
              `System Color Scheme is set to ${computedColorScheme.toUpperCase()} mode`
            }
            withAsterisk
            {...form.getInputProps('colorScheme')}
          >
            <Group mt="xs">
              <Radio value="auto" label="System Color Scheme" />
              <Radio value="light" label="Light Mode" />
              <Radio value="dark" label="Dark Mode" />
            </Group>
          </Radio.Group>
          {fields > 0 ? (
            <Group justify="flex-start" mt="md">
              <Button type="submit">Save</Button>
            </Group>
          ) : null}
        </Stack>
      </Form>
      <DebugCollapse data={form.values} />
    </>
  );
};

export default Account;
