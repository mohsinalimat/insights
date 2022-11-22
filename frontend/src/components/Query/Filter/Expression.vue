<template>
	<div class="w-full">
		<Popover :hideOnBlur="false" class="w-full" placement="right-start">
			<template #target="{ togglePopover, isOpen }">
				<div
					class="input-with-pills relative flex w-full pr-8"
					@click.prevent.stop="togglePopover()"
				>
					<BinaryExpression
						v-if="expression.type == 'BinaryExpression'"
						:expression="expression"
					/>
					<CallExpression
						v-else-if="expression.type == 'CallExpression'"
						:expression="expression"
					/>
					<div
						class="absolute right-0 flex items-center p-2 text-gray-500 hover:text-gray-600"
					>
						<FeatherIcon
							name="x"
							class="h-4 w-4 text-gray-500 hover:text-gray-700"
							@click.prevent.stop="$emit('remove')"
						/>
					</div>
				</div>
			</template>
			<template #body="{ togglePopover, isOpen }">
				<div class="ml-2">
					<FilterPicker @close="togglePopover()" :filter="props.expression" />
				</div>
			</template>
		</Popover>
	</div>
</template>

<script setup>
import BinaryExpression from '@/components/Query/Filter/BinaryExpression.vue'
import CallExpression from '@/components/Query/Filter/CallExpression.vue'
import FilterPicker from '@/components/Query/Filter/FilterPicker.vue'
import { inject, reactive, unref } from 'vue'

defineEmits(['edit', 'remove'])
const props = defineProps({
	expression: {
		type: Object,
		required: true,
		validate: (value) => value.type === 'BinaryExpression' || value.type === 'CallExpression',
	},
})

let expression = reactive(unref(props.expression))

const isStringOrNumber = (arg) => arg.type == 'String' || arg.type == 'Number'
const isSimpleFilter =
	(expression.type == 'BinaryExpression' &&
		expression.left.type == 'Column' &&
		isStringOrNumber(expression.right)) ||
	(expression.type == 'CallExpression' &&
		expression.arguments[0].type == 'Column' &&
		expression.arguments.slice(1).every(isStringOrNumber))

const query = inject('query')
if (isSimpleFilter) {
	const simpleFilter = query.filters.convertIntoSimpleFilter(expression)
	if (simpleFilter) {
		expression = reactive({
			type: 'BinaryExpression',
			left: {
				type: 'Column',
				value: {
					table: simpleFilter.column?.table_label,
					column: simpleFilter.column?.label,
				},
			},
			operator: simpleFilter.operator.label, // TODO: store proper label
			right: {
				type: 'String',
				value: simpleFilter.value.label,
			},
		})
	}
}
</script>
