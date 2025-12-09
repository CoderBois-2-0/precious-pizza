import { queryOptions } from '@tanstack/react-query';

const msOneDay = 1000 * 60 * 60 * 24;

const defaultQueryOptions = {
  staleTime: msOneDay,
  gcTime: msOneDay,
  enabled: true,
};

export { defaultQueryOptions };
