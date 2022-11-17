<template>
	<div class="flex h-[60%] items-start p-4">
		<div class="flex h-full w-full flex-col space-y-4">
			<div class="ml-auto flex space-x-2">
				<Button
					appearance="white"
					@click="showDashboardDialog = true"
					iconLeft="bookmark"
					:disabled="chart.isDirty"
				>
					Add to Dashboard
				</Button>
				<Button
					v-if="canDownload"
					appearance="white"
					iconLeft="download"
					:disabled="chart.isDirty"
					@click="downloadChart()"
				>
					Download
				</Button>

				<Button
					appearance="primary"
					@click="saveChart"
					:loading="chart.savingDoc"
					:disabled="!chart.isDirty"
				>
					Save
				</Button>
			</div>
			<div class="flex h-[calc(100%-2rem)] items-center justify-center">
				<component
					v-if="chart.component && chart.componentProps"
					ref="eChart"
					:is="chart.component"
					v-bind="chart.componentProps"
				></component>
			</div>
		</div>
	</div>

	<Dialog
		:options="{ title: 'Add to Dashboard' }"
		v-model="showDashboardDialog"
		:dismissable="true"
	>
		<template #body-content>
			<div class="space-y-2 text-gray-600">
				<div class="text-sm font-light text-gray-500">Select a Dashboard</div>
				<Autocomplete
					ref="$autocomplete"
					placeholder="Select a dashboard"
					v-model="toDashboard"
					:options="dashboardOptions"
					:allowCreate="true"
					@createOption="(option) => _createDashboard(option)"
				/>
			</div>
		</template>
		<template #actions>
			<Button appearance="primary" @click="addToDashboard" :loading="addingToDashboard">
				Add
			</Button>
		</template>
	</Dialog>
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import Autocomplete from '@/components/Controls/Autocomplete.vue'
import { getDashboardOptions, createDashboard } from '@/utils/dashboard.js'

const query = inject('query')
const chart = computed(() => query.chart)

const $notify = inject('$notify')
const saveChart = () => {
	const onSuccess = () => {
		$notify({
			title: 'Chart Saved',
			appearance: 'success',
		})
	}
	chart.value.updateDoc({ onSuccess })
}

const showDashboardDialog = ref(false)
const toDashboard = ref({})
const dashboardOptions = ref([])
const $autocomplete = ref(null)
watch(showDashboardDialog, async (val) => {
	if (val) {
		await nextTick()
		getDashboardOptions(chart.value.name).then((options) => {
			dashboardOptions.value = options
			setTimeout(() => {
				$autocomplete.value.input.$el.blur()
				$autocomplete.value.input.$el.focus()
			}, 500)
		})
	}
})
const addingToDashboard = computed(() => chart.value.addToDashboard?.loading)
function addToDashboard() {
	const onSuccess = () => {
		$notify({
			title: 'Chart Added to Dashboard',
			appearance: 'success',
		})
		showDashboardDialog.value = false
	}
	// TODO: move default dimensions to insights_dashboard.py
	const defaultDimensions = chart.value.type == 'Number' ? { w: 4, h: 4 } : { w: 8, h: 8 }
	const dashboardName = toDashboard.value.value
	chart.value.addToDashboard(dashboardName, defaultDimensions, { onSuccess })
}

const router = useRouter()
function _createDashboard(newDashboardName) {
	if (!newDashboardName) return router.push('/dashboard')
	createDashboard(newDashboardName).then(({ name, title }) => {
		if (name && title) {
			$notify({
				title: 'Dashboard Created',
				appearance: 'success',
			})
			showDashboardDialog.value = false
			toDashboard.value = {
				value: name,
				label: title,
			}
			addToDashboard()
		}
	})
}

const eChart = ref(null)
const canDownload = computed(() => {
	return eChart.value?.$refs?.eChart?.downloadChart
})
function downloadChart() {
	if (canDownload.value) {
		eChart.value.$refs.eChart.downloadChart()
	}
}
</script>
