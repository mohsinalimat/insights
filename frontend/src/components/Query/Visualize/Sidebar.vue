<template>
	<div class="flex h-full w-full flex-col">
		<div class="mb-4 space-y-3">
			<div class="font-semibold text-gray-700">Chart Type</div>
			<ChartSelector
				v-if="types?.length > 0"
				:chartTypes="types"
				:invalidTypes="invalidTypes"
				:currentType="chart.type"
				@chartTypeChange="setVizType"
			/>
		</div>

		<div class="flex-1 space-y-4 overflow-y-scroll">
			<div class="font-semibold text-gray-700">Chart Options</div>
			<ChartOptions :chartType="chart.type" />
		</div>
	</div>
</template>

<script setup>
import ChartSelector from '@/components/Query/Visualize/ChartSelector.vue'
import ChartOptions from '@/components/Query/Visualize/ChartOptions.vue'
import { types } from '@/utils/charts'

import { inject, computed, provide } from 'vue'
const query = inject('query')
const chart = computed(() => query.chart)
provide('chart', chart)

const invalidTypes = computed(() => {
	// TODO: change based on data
	return ['Funnel', 'Row']
})
const setVizType = (type) => {
	if (!invalidTypes.value.includes(type)) {
		chart.value.setType(type)
	}
}
</script>
