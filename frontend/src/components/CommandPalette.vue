<template>
	<div
		v-show="show"
		class="absolute z-10 flex h-full w-full justify-center pt-20 text-base backdrop-blur-sm"
	>
		<div class="max-h-[28rem] w-[38rem] rounded-md border bg-white shadow-md">
			<input
				ref="searchInput"
				v-model="searchTerm"
				class="flex h-12 w-full items-center rounded-t-md border-b px-4 focus:outline-none"
				placeholder="Search..."
			/>
			<div class="mt-2 flex flex-col px-2">
				<div v-if="commands.length > 0">
					<div class="text-sm text-gray-500">Navigation</div>
					<div
						v-for="(command, idx) in commands"
						class="-mx-2 flex h-10 cursor-pointer items-center space-x-2 px-2"
						@mouseenter="activeIndex = idx"
						:class="[activeIndex === idx ? 'bg-gray-50' : '']"
						@click="
							() => {
								show = false
								command.action()
							}
						"
					>
						<FeatherIcon
							:name="command.icon || 'arrow-right'"
							class="h-4 w-4 text-gray-500"
						/>
						<div class="flex items-baseline">
							<span>{{ command.title }}</span>
							<span class="ml-2 text-sm text-gray-500">
								{{ command.description }}
							</span>
						</div>
					</div>
				</div>
				<div v-else class="text-sm text-gray-500">No results found</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import useCommandPalette from '@/utils/commandPalette'

const keys = useMagicKeys()
const CmdShiftP = keys['Meta+Shift+P']
const escape = keys['Escape']
const searchInput = ref()

const show = ref(false)
watch(CmdShiftP, (pressed) => {
	if (pressed) {
		show.value = true
	}
})
watch(escape, (pressed) => {
	if (pressed && show.value) {
		show.value = false
	}
})

watch(show, (value) => {
	if (value) {
		nextTick(() => {
			searchInput.value.focus()
		})
	}
})

const commandPalette = useCommandPalette()
const searchTerm = ref('')
const commands = computed(() => {
	return commandPalette.search(searchTerm.value)
})

const activeIndex = ref(0)
const ArrowDown = keys['ArrowDown']
const ArrowUp = keys['ArrowUp']

watch(ArrowDown, (pressed) => {
	if (pressed && show.value) {
		activeIndex.value = Math.min(commands.value.length - 1, activeIndex.value + 1)
	}
})
watch(ArrowUp, (pressed) => {
	if (pressed && show.value) {
		activeIndex.value = Math.max(0, activeIndex.value - 1)
	}
})

const enter = keys['Enter']
watch(enter, (pressed) => {
	if (pressed && show.value) {
		show.value = false
		commands.value[activeIndex.value].action()
	}
})
</script>