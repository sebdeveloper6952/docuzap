<script lang="ts">
	import { init } from '@nostr/ndk';
	import '@assets/css/app.css';
	import TopBar from '@components/navigation/TopBar.svelte';
	import { Toaster } from 'svelte-french-toast';
	import Icon from '@iconify/svelte';
	import BottomBar from '@lib/components/navigation/BottomBar.svelte';
	import SideBar from '@lib/components/navigation/SideBar.svelte';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import LoginModal from '@lib/components/modals/LoginModal.svelte';
	import { onMount } from 'svelte';
	import { loadTheme } from '@lib/stores/theme';

	dayjs.extend(localizedFormat);

	let showLoginModal = false;

	onMount(() => {
		loadTheme();
	});
</script>

{#await init()}
	<div class="w-full h-full flex flex-col justify-center items-center bg-background-500 text-black">
		<Icon icon="bitcoin-icons:sign-filled" width="96" height="96" />
		<p>loading...</p>
	</div>
{:then}
	<div
		class="w-full h-full flex flex-col overflow-x-hidden bg-background-500 text-black z-0 dark:bg-zinc-900 dark:text-primary-500"
	>
		<div class="block md:hidden w-full">
			<TopBar />
		</div>
		<div class="flex w-full h-full">
			<div class="fixed w-fit h-full hidden md:block z-50">
				<SideBar on:login={() => (showLoginModal = true)} />
			</div>
			<div class="md:ml-20 w-full h-full p-2">
				<slot />
			</div>
		</div>
		<div class="w-full block md:hidden">
			<BottomBar />
		</div>
	</div>
	<LoginModal
		show={showLoginModal}
		on:close={() => {
			showLoginModal = false;
		}}
	/>
{/await}

<Toaster />

<style>
	:global(html, body) {
		width: 100%;
		height: 100%;
	}
</style>
