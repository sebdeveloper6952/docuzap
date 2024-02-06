<script lang="ts">
	import Icon from '@iconify/svelte';
	import { searchProfiles } from '@lib/nostr/nip50Search';
	import type { NDKUser } from '@nostr-dev-kit/ndk';
	import { slide } from 'svelte/transition';

	export let selectedUsers = new Set<NDKUser>();
	export let showSelectedUsers = false;

	let value = '';
	let debounceTimer: ReturnType<typeof setInterval>;
	let users: NDKUser[] = [];
	let showProfiles = false;

	const search = async (q: string) => {
		if (!q) return;
		users = await searchProfiles(q);
		showProfiles = true;
	};

	const debounce = (v: string) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			search(v);
		}, 500);
	};

	const onKeyUp = (e: KeyboardEvent) => {
		debounce((e.target as HTMLInputElement).value);
	};

	const onProfileClick = (user: NDKUser) => {
		if (selectedUsers.has(user)) selectedUsers.delete(user);
		else selectedUsers.add(user);
		selectedUsers = selectedUsers;
	};

	const onRemoveSelectedProfile = (user: NDKUser) => {
		selectedUsers.delete(user);
		selectedUsers = selectedUsers;
	};
</script>

<div class="w-full relative">
	<input
		{value}
		type="text"
		on:keyup={onKeyUp}
		on:click={() => (showProfiles = !showProfiles)}
		class="w-full h-12 px-2 py-2 bg-background-500 text-black border-2 border-gray-300 rounded focus:outline-none"
		class:border-b-0={showProfiles && users.length > 0}
		class:rounded-b-none={showProfiles && users.length > 0}
	/>
	<button
		on:click={() => (showProfiles = !showProfiles)}
		class="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-200"
	>
		<Icon icon="iconamoon:search-duotone" width="24" height="24" />
	</button>
	{#if showProfiles && users && users.length > 0}
		<ul
			class="h-fit max-h-48 p-1 overflow-y-auto text-sm text-black border-2 border-t-0 border-gray-300 rounded-b"
			transition:slide
		>
			{#each users as user}
				<li>
					<button
						on:click={() => onProfileClick(user)}
						class="w-full my-1 p-1 flex gap-1 items-center rounded hover:bg-gray-200"
						class:bg-gray-200={selectedUsers.has(user)}
					>
						{#if user.profile && user.profile.image}
							<img src={user.profile?.image} alt="profile_picture" class="w-10 h-10 rounded-full" />
						{:else}
							<img
								src={'https://robohash.org/' + user.pubkey}
								alt="profile_picture"
								class="w-10 h-10 rounded-full"
							/>
						{/if}
						<div class="text-left">
							<p>{user.profile?.name?.substring(0, 32)}</p>
							<p class="text-xs text-gray-500">{user.npub}</p>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
	{#if showSelectedUsers}
		<div class="mt-2 flex gap-1 flex-wrap">
			{#each selectedUsers as user}
				<div class="p-1 flex items-center justify-center gap-1 bg-gray-300 rounded">
					<img
						src={user.profile?.image ? user.profile?.image : 'https://robohash.org/' + user.pubkey}
						alt="profile_picture"
						class="w-6 h-6 rounded-full"
					/>
					<p class="text-xs">{user.profile?.name?.substring(0, 32)}</p>
					<button on:click={() => onRemoveSelectedProfile(user)} class="ml-1 text-gray-500">
						<Icon icon="charm:cross" width="12" height="12" />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
