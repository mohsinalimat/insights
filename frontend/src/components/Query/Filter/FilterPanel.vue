<template>
	<div class="">
		<div class="flex items-center justify-between bg-white pb-2">
			<div class="font-semibold text-gray-700">Filter</div>
			<Button icon="plus" @click="pickingFilter = true"></Button>
		</div>
		<div
			v-if="!pickingFilter && (!filters.conditions || filters.conditions.length == 0)"
			class="flex items-center justify-center font-light text-gray-400"
		>
			<p>No filters added</p>
		</div>
		<LogicalExpression
			v-if="filters.conditions?.length > 0"
			:expression="filters"
			@add-filter="showFilterPicker"
			@edit-filter="showFilterPicker"
			@remove-filter="removeFilter"
			@toggle-operator="toggleOperator"
		/>
		<div v-if="pickingFilter" class="mt-2">
			<Popover :hideOnBlur="false" class="w-full" placement="right-end">
				<template #target="{ togglePopover, isOpen }">
					<div class="flex w-full space-x-2">
						<Input
							type="text"
							readonly
							@click="togglePopover()"
							class="h-8 flex-1"
							placeholder="New filter..."
						></Input>
						<Button
							class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100"
							icon="x"
							@click.prevent.stop="pickingFilter = false"
						>
						</Button>
					</div>
				</template>
				<template #body="{ togglePopover, isOpen }">
					<div class="ml-2">
						<FilterPicker
							@close="pickingFilter = false"
							@filter-select="onFilterSelect"
							:filter="editFilter"
						/>
					</div>
				</template>
			</Popover>
		</div>
	</div>
</template>

<script setup>
import LogicalExpression from '@/components/Query/Filter/LogicalExpression.vue'
import FilterPicker from '@/components/Query/Filter/FilterPicker.vue'

import { ref, inject, computed } from 'vue'

const pickingFilter = ref(false)
const query = inject('query')
const filters = computed(() => query.filters.data || {})

const editFilter = ref(null)
const showFilterPicker = ({ condition, level, position, idx }) => {
	pickingFilter.value = true
	if (condition) {
		editFilter.value = condition
		query.filters.editFilterAt.level = level
		query.filters.editFilterAt.position = position
		query.filters.editFilterAt.idx = idx
	} else {
		editFilter.value = null
		query.filters.addNextFilterAt.level = level
		query.filters.addNextFilterAt.position = position
	}
}

function onFilterSelect(filter) {
	if (editFilter.value) {
		query.filters.edit(filter)
	} else {
		query.filters.add(filter)
	}
	editFilter.value = null
	pickingFilter.value = false
}

function removeFilter({ level, position, idx }) {
	query.filters.remove(level, position, idx)
}

function toggleOperator({ level, position }) {
	query.filters.toggleOperator(level, position)
}
</script>
