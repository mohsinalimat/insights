<template>
	<ExpressionTerm :term="props.expression.left" />
	<div class="input-pill text-green-600">
		{{ props.expression.operator }}
	</div>
	<ExpressionTerm :term="props.expression.right" />
</template>

<script setup>
import ExpressionTerm from '@/components/Query/Filter/ExpressionTerm.vue'

const props = defineProps({
	expression: {
		type: Object,
		required: true,
	},
})
</script>
