<template>
	<div
		v-if="columns.length == 0"
		class="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-gray-200 text-sm font-light text-gray-400"
	>
		<p>No columns selected</p>
	</div>
	<div
		v-else-if="columns.length > 0"
		class="flex h-full w-full flex-col overflow-x-scroll overflow-y-scroll scrollbar-hide"
	>
		<Draggable
			class="w-full"
			v-model="columns"
			group="columns"
			item-key="name"
			@sort="updateColumnOrder"
		>
			<template #item="{ element: column }">
				<div
					class="mb-2 flex h-9 w-full items-center space-x-1"
					@click.prevent.stop="
						() => {
							$emit('edit-column', column)
							newColumnType =
								column.aggregation == 'Group By' ? 'Dimension' : 'Metric'
						}
					"
				>
					<DragHandleIcon
						class="h-4 w-4 rotate-90 cursor-grab self-center text-gray-400"
					/>
					<div class="input-with-pills flex-1">
						<div v-if="column.aggregation" class="input-pill text-orange-400">
							{{ column.aggregation }}
						</div>
						<div class="input-pill">{{ column.label }}</div>
						<div
							class="!ml-auto flex items-center px-1 text-gray-500 hover:text-gray-600"
							@click.prevent.stop="query.removeColumn.submit({ column })"
						>
							<FeatherIcon name="x" class="h-4 w-4" />
						</div>
					</div>
				</div>
			</template>
		</Draggable>
	</div>
</template>

<script setup>
import Draggable from 'vuedraggable'
import DragHandleIcon from '@/components/Icons/DragHandleIcon.vue'

import { inject, unref, ref, watch } from 'vue'
import { ellipsis } from '@/utils'

const query = inject('query')
defineEmits(['edit-column'])

const columns = ref(unref(query.columns.data))
watch(
	() => query.columns.data,
	(newColumns) => {
		columns.value = newColumns
	}
)

function updateColumnOrder(e) {
	if (e.oldIndex != e.newIndex) {
		query.moveColumn.submit({
			from_index: e.oldIndex,
			to_index: e.newIndex,
		})
	}
}
</script>
