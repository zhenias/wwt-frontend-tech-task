import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterType } from '@/shared/api/types/Filter'
import type { FilterItem } from '@/shared/api/types/Filter/FilterItem'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterModalProps {
	isOpen: boolean
	filterItems: FilterItem[]
	appliedFilters: SearchRequestFilter
	onClose: () => void
	onApply: (filters: SearchRequestFilter) => void
}

const cloneFilters = (filters: SearchRequestFilter): SearchRequestFilter =>
	filters.map(filter => ({
		id: filter.id,
		type: filter.type,
		optionsIds: [...filter.optionsIds]
	}))

const toggleOption = (
	filters: SearchRequestFilter,
	groupId: string,
	optionId: string
): SearchRequestFilter => {
	const nextFilters = cloneFilters(filters)
	const groupIndex = nextFilters.findIndex(filter => filter.id === groupId)

	if (groupIndex === -1) {
		return [
			...nextFilters,
			{
				id: groupId,
				type: FilterType.OPTION,
				optionsIds: [optionId]
			}
		]
	}

	const currentGroup = nextFilters[groupIndex]
	const hasOption = currentGroup.optionsIds.includes(optionId)

	currentGroup.optionsIds = hasOption
		? currentGroup.optionsIds.filter(id => id !== optionId)
		: [...currentGroup.optionsIds, optionId]

	return nextFilters.filter(filter => filter.optionsIds.length > 0)
}

const useDraftFilters = (
	isOpen: boolean,
	appliedFilters: SearchRequestFilter
) => {
	const [draftFilters, setDraftFilters] = useState<SearchRequestFilter>([])

	useEffect(() => {
		if (!isOpen) {
			return
		}

		setDraftFilters(cloneFilters(appliedFilters))
	}, [appliedFilters, isOpen])

	return { draftFilters, setDraftFilters }
}

export const FilterModal = ({
	isOpen,
	filterItems,
	appliedFilters,
	onClose,
	onApply
}: FilterModalProps) => {
	const { t } = useTranslation('filter')
	const { draftFilters, setDraftFilters } = useDraftFilters(
		isOpen,
		appliedFilters
	)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const draftById = useMemo(
		() => new Map(draftFilters.map(filter => [filter.id, filter])),
		[draftFilters]
	)

	const handleOverlayClick = () => {
		setIsConfirmOpen(false)
		onClose()
	}

	const handleOptionToggle = (groupId: string, optionId: string) => {
		setDraftFilters(current => toggleOption(current, groupId, optionId))
	}

	const handleApplyClick = () => {
		setIsConfirmOpen(true)
	}

	const handleConfirm = () => {
		onApply(cloneFilters(draftFilters))
		setIsConfirmOpen(false)
		onClose()
	}

	const handleCancelConfirm = () => {
		setIsConfirmOpen(false)
		onClose()
	}

	if (!isOpen) {
		return null
	}

	return (
		<div
			aria-hidden={!isOpen}
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
			onClick={handleOverlayClick}
			role="presentation"
		>
			<div
				aria-labelledby="filter-modal-title"
				aria-modal="true"
				className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
				onClick={event => event.stopPropagation()}
				role="dialog"
			>
				<header className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5">
					<div className="text-center w-[100%]">
						<h2
							className="text-2xl font-semibold text-slate-900"
							id="filter-modal-title"
						>
							{t('modalTitle')}
						</h2>
					</div>
					<button
						aria-label={t('closeModal')}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
						onClick={handleOverlayClick}
						type="button"
					>
						<span
							aria-hidden="true"
							className="text-xl leading-none"
						>
							×
						</span>
					</button>
				</header>

				<div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">
					<div className="space-y-4">
						{filterItems.map(filterItem => {
							const selectedGroup = draftById.get(filterItem.id)

							return (
								<section
									className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
									key={filterItem.id}
								>
									<div className="mb-4">
										<h3 className="text-lg font-semibold text-slate-900">
											{filterItem.name}
										</h3>
									</div>

									<div className="grid gap-3 md:grid-cols-2">
										{filterItem.options.map(option => {
											const isChecked = selectedGroup?.optionsIds.includes(
												option.id
											)

											return (
												<label
													className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
													key={option.id}
												>
													<input
														checked={Boolean(isChecked)}
														className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
														onChange={() =>
															handleOptionToggle(filterItem.id, option.id)
														}
														type="checkbox"
													/>
													<span className="space-y-1">
														<span className="block font-medium text-slate-900">
															{option.name}
														</span>
													</span>
												</label>
											)
										})}
									</div>
								</section>
							)
						})}
					</div>
				</div>

				<footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
					<button
						className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
						onClick={handleOverlayClick}
						type="button"
					>
						{t('cancel')}
					</button>
					<button
						className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition hover:bg-slate-700"
						onClick={handleApplyClick}
						type="button"
					>
						{t('apply')}
					</button>
				</footer>
			</div>

			{isConfirmOpen ? (
				<div
					className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4"
					onClick={event => event.stopPropagation()}
				>
					<div
						aria-labelledby="confirm-dialog-title"
						aria-modal="true"
						className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
						role="dialog"
					>
						<h3
							className="text-xl font-semibold text-slate-900"
							id="confirm-dialog-title"
						>
							{t('confirmTitle')}
						</h3>
						<p className="mt-3 text-sm leading-6 text-slate-500">
							{t('confirmDescription')}
						</p>
						<div className="mt-6 flex items-center justify-end gap-3">
							<button
								className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
								onClick={handleCancelConfirm}
								type="button"
							>
								{t('oldFilter')}
							</button>
							<button
								className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-500"
								onClick={handleConfirm}
								type="button"
							>
								{t('confirm')}
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}
