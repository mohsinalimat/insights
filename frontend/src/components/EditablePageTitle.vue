<script setup>
import { ref } from 'vue'

defineEmits(['update'])
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
})

const oldTitle = ref(props.title)
const title = ref(props.title)
const editing = ref(false)
</script>

<template>
	<div class="flex w-full items-center space-x-2">
		<span
			v-if="!editing"
			class="flex overflow-hidden text-ellipsis whitespace-nowrap py-1 text-3xl font-medium"
		>
			{{ title }}
		</span>
		<Button
			v-if="!editing"
			icon="edit"
			appearance="minimal"
			@click="
				() => {
					editing = true
					oldTitle = title
					$nextTick(() => $refs.titleInput.$el.focus())
				}
			"
		></Button>
		<Input
			v-if="editing"
			ref="titleInput"
			type="text"
			:value="title"
			@input="(val) => (title = val)"
			:size="title.length + 1"
			class="text-3xl font-medium"
		/>
		<Button
			v-if="editing"
			icon="x"
			@click="
				() => {
					editing = false
					title = oldTitle
				}
			"
		></Button>
		<Button
			v-if="editing"
			icon="check"
			appearance="primary"
			@click="
				() => {
					$emit('update', title)
					editing = false
				}
			"
		></Button>
	</div>
</template>
