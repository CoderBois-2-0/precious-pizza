import { useQuery } from '@tanstack/react-query';
import { defaultQueryOptions } from './index';
import CategoryClient from '@/apiClients/categoryClient';

const CATEGORY_PRIMARY_KEY = 'category';

const categoryClient = new CategoryClient();

function useCategories() {
  return useQuery({
    ...defaultQueryOptions,
    queryKey: [CATEGORY_PRIMARY_KEY],
    queryFn: () => categoryClient.getAll(),
  });
}

export { useCategories };
