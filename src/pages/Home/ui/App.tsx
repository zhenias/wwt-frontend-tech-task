import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilterDataQuery } from '@/shared/api/filter/useFilterDataQuery'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '@/shared/store/filterStore'

import { FilterModal } from './FilterModal'

const formatFilters = (filters: SearchRequestFilter) =>
	JSON.stringify(filters, null, 2)

export const App = () => {
	const { t } = useTranslation('filter')
	const { data, isLoading, isError } = useFilterDataQuery()
	const appliedFilters = useFilterStore(state => state.appliedFilters)
	const setAppliedFilters = useFilterStore(state => state.setAppliedFilters)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	const handleApply = (filters: SearchRequestFilter) => {
		setAppliedFilters(filters)
	}

	return (
		<main className="min-h-dvh bg-slate-100 px-4 py-8 text-slate-900">
			<section className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<h1 className="text-3xl font-semibold">{t('pageTitle')}</h1>
						<p className="text-sm leading-6 text-slate-500">
							{t('pageDescription')}
						</p>
					</div>
					<button
						className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-700"
						onClick={openModal}
						type="button"
					>
						{t('openModal')}
					</button>
				</header>

				<section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
					<h2 className="text-lg font-semibold">{t('selectedFiltersTitle')}</h2>
					<div className="mt-3">
						{isLoading ? (
							<p className="text-sm text-slate-500">{t('loadingFilters')}</p>
						) : null}
						{isError ? (
							<p className="text-sm text-rose-600">{t('loadingError')}</p>
						) : null}
						{data ? (
							<p className="text-sm text-slate-500">
								{t('loadedFilterGroups', {
									count: data.filterItems.length
								})}
							</p>
						) : null}
						<pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm leading-6 text-emerald-300">
							{formatFilters(appliedFilters)}
						</pre>
					</div>
				</section>
			</section>

			{data ? (
				<FilterModal
					appliedFilters={appliedFilters}
					filterItems={data.filterItems}
					isOpen={isModalOpen}
					onApply={handleApply}
					onClose={closeModal}
				/>
			) : null}
		</main>
	)
}
