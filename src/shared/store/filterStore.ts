import { create } from 'zustand'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterStoreState {
	appliedFilters: SearchRequestFilter
	setAppliedFilters: (filters: SearchRequestFilter) => void
}

export const useFilterStore = create<FilterStoreState>(set => ({
	appliedFilters: [],
	setAppliedFilters: filters => set({ appliedFilters: filters })
}))
