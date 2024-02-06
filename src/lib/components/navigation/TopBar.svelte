<script lang="ts">
	import { userStore, logout } from '@nostr/nsecSigner';
	import Icon from '@iconify/svelte';
	import OutlinedButton from '../buttons/OutlinedButton.svelte';
	import LoginModal from '../modals/LoginModal.svelte';
	import UserAvatar from '../UserAvatar.svelte';

	let showDropdown = false;
	let showNsecModal = false;
	let sk = '';

	const onLogout = () => {
		logout();
		showDropdown = !showDropdown;
	};
</script>

<div class="p-2 flex items-center relative">
	<a href="/" class="flex gap-2">
		<Icon icon="fluent:signature-16-regular" width="24" height="24" />
		<p class="font-bold">DocuZap</p>
	</a>
	<div class="grow"></div>
	{#if $userStore}
		<button
			on:click={() => {
				showDropdown = !showDropdown;
			}}
		>
			<UserAvatar />
		</button>
	{:else}
		<OutlinedButton
			on:click={() => {
				showNsecModal = true;
			}}>Login</OutlinedButton
		>
	{/if}

	{#if showDropdown}
		<div class="flex flex-col bg-gray-300 rounded-md absolute top-14 right-2 z-50">
			<button
				on:click={onLogout}
				class="py-1 px-12 flex gap-2 hover:bg-zinc-700 cursor-pointer rounded-md"
			>
				<p>Logout</p>
			</button>
		</div>
	{/if}

	<LoginModal show={showNsecModal} on:close={() => (showNsecModal = false)} />
</div>
