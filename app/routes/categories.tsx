import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import CategoryCard from '~/components/Category/CategoryCard';
import { getCategories } from '~/lib/category.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Categories${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const categories = await getCategories({});

  const data = { categories };

  return json(data);
}

export default function Categories() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const categories =
    data?.categories?.nodes?.length > 0 ? (
      data?.categories?.nodes?.map((category) => (
        <CategoryCard key={category.id} data={category} />
      ))
    ) : (
      <h4>No Categories Stored</h4>
    );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Categories</Title>
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab
              value="create"
              onClick={() => navigate('/category/create')}
            >
              Create
            </Tabs.Tab>
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="browse" py={10}>
            {categories}
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
