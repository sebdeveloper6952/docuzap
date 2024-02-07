<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { logout, userStore } from '@lib/nostr/nsecSigner';
	import UserAvatar from '../UserAvatar.svelte';
	import { navigationItems } from '@lib/helpers/navigationItems';
	import { createEventDispatcher } from 'svelte';
	import { themeStore, toggleTheme } from '@lib/stores/theme';

	const dispatch = createEventDispatcher();
</script>

<div class="flex h-full">
	<aside
		class="w-20 flex h-full flex-col items-center bg-primary-100/10 dark:text-gray-100 dark:bg-primary-900/10"
	>
		<div
			class="w-full py-2 flex flex-col h-[4.5rem] items-center justify-center text-black dark:border-gray-500 dark:text-gray-300"
		>
			<Icon icon="fluent:signature-16-regular" width="48" height="48" />
			<p class="text-xs font-bold">DocuZap</p>
		</div>
		<nav class="w-full flex flex-1 flex-col gap-y-8 pt-10">
			{#each navigationItems as item}
				<a
					href={item.path}
					class="flex flex-col justify-center items-center border-none hover:text-primary-500 text-gray-500 relative group dark:text-gray-500 dark:hover:text-primary-500"
					class:!text-primary-500={$page.url.pathname === item.path}
					class:!border-r-4={$page.url.pathname === item.path}
				>
					<Icon icon={item.icon} width="32" height="32" />
					<div class="absolute inset-y-0 left-16 hidden items-center group-hover:flex">
						<div
							class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg dark:bg-zinc-700 dark:text-gray-100"
						>
							<div class="absolute inset-0 -left-1 flex items-center">
								<div class="h-2 w-2 rotate-45 bg-white dark:bg-zinc-700"></div>
							</div>
							<p>{item.name}</p>
						</div>
					</div>
				</a>
			{/each}
			<div class="w-full flex justify-center relative group">
				<a
					href="/new"
					class="w-10 h-10 flex flex-col justify-center items-center border-none bg-primary-100 text-primary-900 rounded"
				>
					<Icon icon="fluent:add-20-filled" width="24" height="24" />
				</a>
				<div class="absolute inset-y-0 left-16 hidden items-center group-hover:flex">
					<div
						class="relative whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 drop-shadow-lg dark:bg-zinc-700 dark:text-gray-100"
					>
						<div class="absolute inset-0 -left-1 flex items-center">
							<div class="h-2 w-2 rotate-45 bg-white dark:bg-zinc-700"></div>
						</div>
						<p>New Request</p>
					</div>
				</div>
			</div>
		</nav>
		<div class="flex flex-col items-center gap-y-4 py-4">
			<button
				on:click={toggleTheme}
				class="flex flex-col justify-center items-center border-none text-gray-500 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-500"
			>
				{#if $themeStore}
					<Icon icon="solar:sun-2-line-duotone" width="24" height="24" />
				{:else}
					<Icon icon="solar:moon-bold-duotone" width="24" height="24" />
				{/if}
			</button>
			{#if $userStore}
				<button
					on:click={() => logout()}
					class="flex flex-col justify-center items-center border-none text-gray-500 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-500"
				>
					<Icon icon="solar:logout-2-bold-duotone" width="24" height="24" />
				</button>
			{:else}
				<button
					on:click={() => {
						dispatch('login');
					}}
					class="flex flex-col justify-center items-center border-none text-zinc-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-500"
				>
					<Icon icon="solar:login-2-bold-duotone" width="24" height="24" />
					<p class="text-xs">Login</p>
				</button>
			{/if}
			<UserAvatar />
		</div>
	</aside>
</div>
