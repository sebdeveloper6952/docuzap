<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
	import BaseModal from './BaseModal.svelte';
	import TextInput from '../forms/TextInput.svelte';
	import TextButton from '../buttons/TextButton.svelte';
	import { setSkSigner, setNip07Signer } from '@nostr/nsecSigner';
	import OutlinedButton from '../buttons/OutlinedButton.svelte';

	export let show = false;
	let loginMethod = '';
	let sk = '';

	$: loginDisabled = sk === '';

	const dispatch = createEventDispatcher();

	const onSetSk = async () => {
		await setSkSigner(sk);
		sk = '';
		dispatch('close');
	};

	const onClickExtensionMethod = async () => {
		await setNip07Signer();
		dispatch('close');
	};
</script>

<BaseModal {show} on:close>
	<div class="px-16 py-4">
		<div class="w-full flex justify-center text-gray-50">
			<Icon icon="pixelarticons:lock-open" width="48" height="48" />
		</div>
		<p class="mt-4 text-2xl font-bold text-gray-50">Login method</p>

		<div class="w-full mt-8 flex justify-center gap-2">
			<OutlinedButton on:click={() => onClickExtensionMethod()}>NIP-07 Extension</OutlinedButton>
			<OutlinedButton on:click={() => (loginMethod = 'sk')}>Private Key</OutlinedButton>
		</div>

		{#if loginMethod === 'sk'}
			<div>
				<p class="mt-4 text-gray-50">
					Your nsec will be saved in local storage, you can logout at any time.
				</p>
				<div class="mt-4">
					<text-input v-model="sk" type="password" />
				</div>
				<div class="flex flex-col gap-2 justify-center">
					<TextInput bind:value={sk} type="password" />
				</div>
				<div class="mt-4 w-full flex justify-end">
					<TextButton on:click={() => dispatch('close')}>Cancel</TextButton>
					<TextButton on:click={onSetSk} disabled={loginDisabled}>Login</TextButton>
				</div>
			</div>
		{/if}
	</div>
</BaseModal>
