import { Fieldset, TextInput, Textarea } from '@mantine/core';

export function SEO({ form }) {
  return (
    <Fieldset legend="Search Engine Optimization" mt={20}>
      <TextInput
        label="SEO Title"
        type="text"
        placeholder="Title"
        {...form.getInputProps('meta.seo.title')}
      />
      <TextInput
        label="SEO Keywords or Phrase"
        type="text"
        placeholder="Keywords"
        {...form.getInputProps('meta.seo.keywords')}
      />
      <Textarea
        label="SEO Description"
        placeholder="Description"
        {...form.getInputProps('meta.seo.description')}
      />
      <input
        type="hidden"
        name="meta"
        value={JSON.stringify(form.values.meta)}
      />
    </Fieldset>
  );
}
