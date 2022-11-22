<template>
	<BinaryExpression v-if="type == 'BinaryExpression'" :expression="props.term" />
	<CallExpression v-else-if="type == 'CallExpression'" :expression="props.term" />
	<!-- Column -->
	<div v-else class="input-pill !h-7">
		{{ type == 'Column' ? value.column : value }}
	</div>
</template>

<script setup>
import BinaryExpression from '@/components/Query/Filter/BinaryExpression.vue'
import CallExpression from '@/components/Query/Filter/CallExpression.vue'

const props = defineProps({
	term: {
		type: Object,
		required: true,
	},
})
const type = props.term.type
const value = props.term.value
</script>
