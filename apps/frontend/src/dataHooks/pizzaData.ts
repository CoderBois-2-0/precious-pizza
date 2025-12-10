import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { defaultQueryOptions } from './index';
import type { IAPIPizza, IAPIPizzaPost } from '@/apiClients/pizzaClient';
import PizzaClient from '@/apiClients/pizzaClient';

const PIZZA_PRIMARY_KEY = 'pizza';

const pizzaClient = new PizzaClient();

function usePizzas(categoryID: string) {
  return useQuery({
    ...defaultQueryOptions,
    queryKey: [PIZZA_PRIMARY_KEY, categoryID],
    queryFn: () => pizzaClient.getAll(categoryID),
  });
}

function useCreatePizza() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPizza: IAPIPizzaPost) => pizzaClient.create(newPizza),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [PIZZA_PRIMARY_KEY] }),
  });
}

function useDeletePizza() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pizzaID: IAPIPizza['id']) => pizzaClient.delete(pizzaID),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [PIZZA_PRIMARY_KEY] }),
  });
}

export { usePizzas, useCreatePizza, useDeletePizza };
