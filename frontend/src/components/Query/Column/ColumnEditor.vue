<template>
	<div class="flex w-[22rem] flex-col space-y-2 rounded-md border bg-white p-4 shadow-md">
		<div class="flex h-7 items-center justify-between">
			<div class="font-semibold text-gray-700">Edit {{ columnType }}</div>
			<Button icon="x" @click="$emit('close')"> </Button>
		</div>
		<div class="flex flex-col space-y-3">
			<MetricPicker
				v-if="columnType == 'Metric'"
				:column="props.column"
				@column-select="editColumn"
				@close="$emit('close')"
			/>
			<DimensionPicker
				v-if="columnType == 'Dimension'"
				:column="props.column"
				@column-select="editColumn"
				@close="$emit('close')"
			/>
			<ColumnExpressionPicker
				v-if="columnType == 'Expression'"
				:column="props.column"
				@column-select="editColumn"
				@close="$emit('close')"
			/>
		</div>
	</div>
</template>

<script setup>
import MetricPicker from '@/components/Query/Column/MetricPicker.vue'
import DimensionPicker from '@/components/Query/Column/DimensionPicker.vue'
import ColumnExpressionPicker from '@/components/Query/Column/ColumnExpressionPicker.vue'

import { inject, ref } from 'vue'

const emit = defineEmits(['close'])
const props = defineProps({
	column: {
		type: Object,
		default: {},
		required: true,
	},
})
const query = inject('query')
const columnType = ref(
	props.column.is_expression
		? 'Expression'
		: props.column.aggregation && props.column.aggregation === 'Group By'
		? 'Dimension'
		: 'Metric'
)

const editColumn = (column) => {
	query.updateColumn.submit({ column })
	emit('close')
}
</script>
