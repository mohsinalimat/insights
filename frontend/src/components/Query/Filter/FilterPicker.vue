<template>
	<div class="flex w-[24rem] flex-col space-y-2 rounded-md border bg-white p-4 shadow-md">
		<Tabs :tabs="tabs" @switch="switchTab" />
		<SimpleFilterPicker
			v-if="activeTab === 'Simple'"
			:filter="props.filter"
			@filter-select="(args) => $emit('filter-select', args)"
		/>
		<FilterExpressionPicker
			v-if="activeTab === 'Expression'"
			:filter="props.filter"
			@filter-select="(args) => $emit('filter-select', args)"
		/>
	</div>
</template>

<script setup>
import Tabs from '@/components/Tabs.vue'
import SimpleFilterPicker from '@/components/Query/Filter/SimpleFilterPicker.vue'
import FilterExpressionPicker from '@/components/Query/Filter/FilterExpressionPicker.vue'

import { ref, computed } from 'vue'

const props = defineProps(['filter'])
defineEmits(['filter-select', 'close'])

const tabs = ref([
	{
		label: 'Simple',
		active: true,
	},
	{
		label: 'Expression',
		active: false,
	},
])
const activeTab = computed(() => tabs.value.find((tab) => tab.active).label)
function switchTab(tab) {
	tabs.value.forEach((tab) => (tab.active = false))
	tab.active = true
}
</script>
