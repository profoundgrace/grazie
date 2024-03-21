import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Form, useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import classes from './Register.module.css';

export function Register({ site }) {
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
        Welcome to {site?.name ?? 'Site Name'}!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor component="button" onClick={() => navigate('/login')} size="sm">
          Login
        </Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form
          method="POST"
          onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
        >
          <TextInput
            label="Username"
            name="username"
            placeholder="random_user123"
            {...form.getInputProps('username')}
            required
          />
          <TextInput
            label="Display Name"
            name="displayName"
            placeholder="David D."
            {...form.getInputProps('displayName')}
            required
          />
          <TextInput
            label="Email address"
            mt="md"
            name="email"
            placeholder="Enter email"
            {...form.getInputProps('email')}
            type="email"
            required
          />
          <PasswordInput
            label="Password"
            mt="md"
            name="password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            required
          />
          <Button fullWidth mt="xl" type="submit">
            Register
          </Button>
        </Form>
      </Paper>
    </Container>
  );
}
