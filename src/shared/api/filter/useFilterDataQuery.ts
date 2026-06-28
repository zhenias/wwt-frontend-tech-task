import { useQuery } from '@tanstack/react-query'

import { filterDataQueryKey, getFilterData } from './getFilterData'

export const useFilterDataQuery = () =>
	useQuery({
		queryKey: filterDataQueryKey,
		queryFn: getFilterData,
		staleTime: Number.POSITIVE_INFINITY
	})
