import { useQuery } from '@tanstack/react-query';
import { defaultQueryOptions } from './index';
import FavouriteClient from '@/apiClients/favouriteClient';

const FAVOURITES_PRIMARY_KEY = 'favourites';

const favouriteClient = new FavouriteClient();

function useFavourites() {
  return useQuery({
    ...defaultQueryOptions,
    queryKey: [FAVOURITES_PRIMARY_KEY],
    queryFn: () => favouriteClient.getAll(),
  });
}

export { useFavourites };
