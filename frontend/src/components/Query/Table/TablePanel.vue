<template>
	<div>
		<div class="space-y-2">
			<div class="flex items-center justify-between bg-white">
				<div class="font-semibold text-gray-700">Data</div>
				<Button icon="plus" @click="addingTable = true"></Button>
			</div>

			<!-- Empty List -->
			<div
				v-if="!query.tables.data?.length && !addingTable"
				class="flex flex-1 items-center justify-center font-light text-gray-400"
			>
				<p>No tables selected</p>
			</div>
			<!-- Table List -->
			<div v-else v-for="(table, idx) in query.tables.data" :key="idx">
				<Popover :hideOnBlur="false" class="flex space-x-2">
					<template #target="{ togglePopover, isOpen }">
						<div class="input-with-pills relative flex-1">
							<div class="input-pill">{{ table.label }}</div>
							<div v-if="table.join" class="input-pill px-1.5">
								<JoinLeftIcon v-if="table.join.type.value == 'left'" />
								<JoinRightIcon v-if="table.join.type.value == 'right'" />
								<JoinInnerIcon v-if="table.join.type.value == 'inner'" />
								<JoinFullIcon v-if="table.join.type.value == 'full_outer'" />
							</div>
							<div v-if="table.join" class="input-pill">
								{{ table.join.with.label }}
							</div>
							<div
								class="absolute right-0 flex items-center p-2 text-gray-500 hover:text-gray-600"
								@click.prevent.stop="removeTable(table)"
							>
								<FeatherIcon name="x" class="h-4 w-4" />
							</div>
						</div>
						<Button
							class="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100"
							icon="circle"
							@click.prevent.stop="
								() => {
									editTable = isOpen ? null : table
									togglePopover()
								}
							"
						>
						</Button>
					</template>
					<template #body="{ togglePopover, isOpen }">
						<div
							v-show="isOpen"
							class="my-2 w-[26rem] space-y-4 rounded-md border bg-white p-4 text-base shadow-md"
						>
							<div class="flex space-x-2">
								<div class="flex w-8 items-center">Join</div>
								<div class="flex-1">
									<Input
										class="h-8"
										type="text"
										placeholder="Select a table"
										v-model="table.table"
										disabled
									></Input>
								</div>
								<div class="w-[5.5rem]">
									<Autocomplete
										v-model="join.type"
										:options="joinTypeOptions"
										placeholder="Type"
									/>
								</div>
								<div class="flex-1">
									<Autocomplete
										v-model="join.with"
										:options="joinTableOptions"
										placeholder="Select a table"
										@selectOption="onJoinTableSelect"
									/>
								</div>
							</div>
							<div class="flex space-x-2">
								<div class="flex w-8 items-center">On</div>
								<div class="flex-1">
									<Autocomplete
										v-model="join.condition"
										:options="joinConditionOptions"
										placeholder="Select a condition..."
									/>
								</div>
							</div>
							<div class="flex justify-between space-x-2">
								<div class="flex items-end justify-end space-x-2">
									<Button @click="togglePopover(false)"> Close </Button>
								</div>
								<div class="flex items-end justify-end space-x-2">
									<Button
										:disabled="!editTable?.join"
										@click="clearJoin() || togglePopover()"
									>
										Clear
									</Button>
									<Button
										appearance="primary"
										:disabled="!join.with || !join.condition || !join.type"
										@click="applyJoin() || togglePopover()"
									>
										Apply
									</Button>
								</div>
							</div>
						</div>
					</template>
				</Popover>
			</div>
			<!-- New Table -->
			<div v-if="addingTable" class="flex space-x-2">
				<Autocomplete
					class="flex-1"
					ref="tableSearch"
					v-model="newTable"
					:options="newTableOptions"
					placeholder="Select a table..."
					@selectOption="addNewTable"
				/>

				<Button
					class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100"
					icon="x"
					@click.prevent.stop="addingTable = false"
				>
				</Button>
			</div>
		</div>
	</div>
</template>

<script setup>
import JoinLeftIcon from '@/components/Icons/JoinLeftIcon.vue'
import JoinRightIcon from '@/components/Icons/JoinRightIcon.vue'
import JoinInnerIcon from '@/components/Icons/JoinInnerIcon.vue'
import JoinFullIcon from '@/components/Icons/JoinFullIcon.vue'
import Autocomplete from '@/components/Controls/Autocomplete.vue'

import { computed, inject, ref, watch } from 'vue'
import { isEmptyObj } from '@/utils'

const query = inject('query')

const newTable = ref({})
const addingTable = ref(false)
const tableSearch = ref(null)
watch(addingTable, (newValue) => {
	newTable.value = {}
	if (newValue) {
		query.fetchTables.submit().then(() => {
			tableSearch.value.input.el.focus()
		})
	}
})
const newTableOptions = computed(() => {
	return query.fetchTables.data?.message.map((table) => ({
		...table,
		value: table.table,
	}))
})

const join = ref({ with: {}, condition: {}, type: {} })
const editTable = ref(null) // table that is being edited
watch(editTable, (table) => {
	join.value = { with: {}, condition: {}, type: {} }
	if (table) {
		if (table.join) {
			join.value.condition = table.join.condition
			join.value.with = table.join.with
			join.value.type = table.join.type
		}
		query.fetchJoinOptions.submit({ table })
	}
})
const joinTypeOptions = ref([
	{ label: 'Inner', value: 'inner' },
	{ label: 'Left', value: 'left' },
])
const joinOptions = computed(() => query.fetchJoinOptions.data?.message)
const joinTableOptions = computed(() => {
	return joinOptions.value?.map(({ label, table }) => {
		return { label, value: table }
	})
})
const joinConditionOptions = computed(() => {
	if (!isEmptyObj(join.value.with) && joinOptions.value) {
		return joinOptions.value
			.filter(({ table }) => {
				return table == join.value.with.value
			})
			.map(({ primary_key, foreign_key }) => ({
				label: `${primary_key} = ${foreign_key}`,
				value: `${primary_key} = ${foreign_key}`,
			}))
	}
	return []
})

function onJoinTableSelect(option) {
	join.value.with = option
	join.value.condition = {}
	if (joinConditionOptions.value.length > 1) {
		join.value.condition = joinConditionOptions.value[0]
	}
}
function applyJoin() {
	editTable.value.join = join.value
	query.updateTable.submit({ table: editTable.value })
	editTable.value = null
}
function clearJoin() {
	editTable.value.join = ''
	query.updateTable.submit({ table: editTable.value })
	editTable.value = null
}
function addNewTable(table) {
	addingTable.value = false
	table && query.addTable.submit({ table })
}
const $notify = inject('$notify')
function removeTable(table) {
	const validationError = query.tables.validateRemoveTable(table)
	if (validationError) {
		return $notify(validationError)
	}
	query.removeTable.submit({ table })
}
</script>
