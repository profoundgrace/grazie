import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Form, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import classes from './Login.module.css';

export function Login() {
  const navigate = useNavigate();
  const { error } = useLoaderData();

  const submit = useSubmit();

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  });
  return (
    <Container size={420}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor
          component="button"
          onClick={() => navigate('/register')}
          size="sm"
        >
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form
          method="POST"
          onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
        >
          <TextInput
            required
            label="Email address"
            type="email"
            name="email"
            placeholder="Enter email"
            data-autofocus
            {...form.getInputProps('email')}
          />
          <PasswordInput
            required
            label="Password"
            name="password"
            placeholder="Password"
            {...form.getInputProps('password')}
            mt="md"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor
              component="button"
              onClick={() => navigate('/user/reset')}
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Form>
      </Paper>
    </Container>
  );
}
