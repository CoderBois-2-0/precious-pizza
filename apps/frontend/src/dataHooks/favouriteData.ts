import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryOptions } from './index';
import FavouriteClient, {
  type IAPIFavourite,
  type IAPIFavouritePost,
} from '@/apiClients/favouriteClient';

const FAVOURITES_PRIMARY_KEY = 'favourites';

const favouriteClient = new FavouriteClient();

function useFavourites() {
  return useQuery({
    ...defaultQueryOptions,
    queryKey: [FAVOURITES_PRIMARY_KEY],
    queryFn: () => favouriteClient.getAll(),
  });
}

function useCreateFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFavourite: IAPIFavouritePost) =>
      favouriteClient.create(newFavourite),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

function useDeleteFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favouriteID: IAPIFavourite['id']) =>
      favouriteClient.delete(favouriteID),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export { useFavourites, useCreateFavourite, useDeleteFavourite };
