/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Group, Pagination } from '@mantine/core';
import { useLoaderData } from '@remix-run/react';

export default function Pager() {
  const {
    pager: { count, page, total }
  } = useLoaderData();

  const prev = page - 1;
  const next = page + 1;
  const first = 1;
  const last = total;

  let queries = '';
  if (count) {
    queries = queries + `&count=${count}`;
  }

  return (
    <Pagination.Root
      total={total}
      value={page}
      getItemProps={(page) => ({
        component: 'a',
        href: `?page=${page}${queries}`
      })}
    >
      <Group gap={7} justify="center" mt="sm">
        {page !== 1 && (
          <>
            {total > 2 && (
              <Pagination.First
                component="a"
                href={`?page=${first}${queries}`}
              />
            )}

            <Pagination.Previous
              component="a"
              href={`?page=${prev}${queries}`}
            />
          </>
        )}
        <Pagination.Items />
        {page !== total && (
          <>
            <Pagination.Next component="a" href={`?page=${next}${queries}`} />
            {page !== total - 1 && (
              <Pagination.Last component="a" href={`?page=${last}${queries}`} />
            )}
          </>
        )}
      </Group>
    </Pagination.Root>
  );
}
