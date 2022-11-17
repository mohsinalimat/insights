<template>
	<div class="mx-auto flex h-full w-full max-w-[1440px] flex-col bg-white text-base">
		<Navbar />
		<div class="flex h-[calc(100%-2.5rem)]">
			<Sidebar v-if="!hideSidebar" />
			<div class="flex flex-1 flex-col">
				<RouterView :key="$route.fullPath" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import auth from '@/utils/auth'
import settings from '@/utils/settings'
import { setupComplete } from '@/utils/setupWizard'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideSidebar = computed(() => {
	return (
		route.meta.hideSidebar || !setupComplete.value || !auth.isLoggedIn || settings.hideSidebar
	)
})
</script>
