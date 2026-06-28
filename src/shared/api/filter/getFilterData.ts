import type { FilterItem } from '@/shared/api/types/Filter/FilterItem'
import filterData from '@/shared/temp/filterData.json'

export interface FilterDataResponse {
	filterItems: FilterItem[]
}

const filterDataResponse = filterData as FilterDataResponse

export const filterDataQueryKey = ['filter-data'] as const

export const getFilterData = async (): Promise<FilterDataResponse> =>
	Promise.resolve(filterDataResponse)
