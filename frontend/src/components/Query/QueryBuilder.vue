<template>
	<div class="flex flex-col">
		<TablePanel />
		<hr class="my-4" />
		<FilterPanel />
		<hr class="my-4" />
		<ColumnPanel />
	</div>
</template>

<script setup>
import TablePanel from '@/components/Query/Table/TablePanel.vue'
import ColumnPanel from '@/components/Query/Column/ColumnPanel.vue'
import FilterPanel from '@/components/Query/Filter/FilterPanel.vue'
</script>
