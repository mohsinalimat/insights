<template>
	<div class="flex h-full w-full flex-col bg-white text-base">
		<Navbar />
		<div class="flex h-[calc(100%-2.5rem)] w-full">
			<Sidebar v-if="!hideSidebar" />
			<div class="flex w-[calc(100%-3rem)] flex-col">
				<RouterView :key="$route.fullPath" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import auth from '@/utils/auth'
import { setupComplete } from '@/utils/setupWizard'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideSidebar = computed(() => {
	return route.meta.hideSidebar || !setupComplete.value || !auth.isLoggedIn
})
</script>
