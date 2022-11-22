<template>
	<div class="">
		<div v-if="!editingColumn" class="">
			<div class="flex items-center justify-between bg-white pb-2">
				<div class="font-semibold text-gray-700">Summarize</div>
				<Button icon="plus" @click="addingColumn = true"></Button>
			</div>
			<div class="h-[calc(100%-2.5rem)] w-full">
				<div
					v-if="!query.columns?.data.length && !addingColumn"
					class="flex items-center justify-center font-light text-gray-400"
				>
					<p>No columns added</p>
				</div>
				<ColumnList
					@edit-column="(column) => ([editColumn, editingColumn] = [column, true])"
				></ColumnList>
			</div>
		</div>
		<div v-if="addingColumn">
			<Popover :hideOnBlur="false" class="w-full" placement="right-start">
				<template #target="{ togglePopover, isOpen }">
					<div class="flex w-full space-x-2">
						<DragHandleIcon
							class="h-4 w-4 rotate-90 cursor-grab self-center text-gray-400"
						/>
						<Input
							type="text"
							readonly
							@click="togglePopover()"
							class="h-8 flex-1"
							placeholder="New column..."
						></Input>
						<Button
							class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100"
							icon="x"
							@click.prevent.stop="addingColumn = false"
						>
						</Button>
					</div>
				</template>
				<template #body>
					<div class="ml-2">
						<ColumnPicker @close="addingColumn = false" />
					</div>
				</template>
			</Popover>
		</div>
	</div>
</template>

<script setup>
import DragHandleIcon from '@/components/Icons/DragHandleIcon.vue'
import ColumnList from '@/components/Query/Column/ColumnList.vue'
import ColumnPicker from '@/components/Query/Column/ColumnPicker.vue'

import { inject, ref } from 'vue'

const query = inject('query')
const addingColumn = ref(false)
const editColumn = ref({})
const editingColumn = ref(false)
</script>
