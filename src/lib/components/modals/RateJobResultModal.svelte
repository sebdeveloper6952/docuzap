<script lang="ts">
	import Icon from '@iconify/svelte';
	import BaseModal from './BaseModal.svelte';
	import TextButton from '../buttons/TextButton.svelte';
	import { createEventDispatcher } from 'svelte';
	import { publishCustomerFeedbackEvent } from '@lib/nostr/nip90';
	import type { NDKKind } from '@nostr-dev-kit/ndk';
	import { success } from '@lib/helpers/toast';
	import TextInput from '../forms/TextInput.svelte';

	export let show = false;
	export let eventId = '';
	export let authorPubkey = '';

	let likedJob = true;
	let additionalFeedback = '';

	const dispatch = createEventDispatcher();

	const onSubmit = async () => {
		await publishCustomerFeedbackEvent(
			likedJob ? '+' : '-',
			additionalFeedback,
			eventId,
			authorPubkey,
			6500 as NDKKind
		);
		dispatch('close');
		success('Rating submitted!');
	};
</script>

<BaseModal {show}>
	<div class="px-4 py-4">
		<div class="px-16">
			<div class="w-full flex justify-center">
				<Icon icon="pixelarticons:heart" width="48" height="48" />
			</div>
			<p class="mt-4 text-2xl font-bold">Rate job result</p>
			<p class="mt-4">Help other users by rating this DVM job:</p>
			<div class="mt-4 w-full flex justify-center">
				<button on:click={() => (likedJob = true)} class:text-orange-700={likedJob}
					><Icon icon="iconamoon:like-thin" width="48" height="48" /></button
				>
				<button
					on:click={() => (likedJob = false)}
					class:text-orange-700={!likedJob}
					class="rotate-180"><Icon icon="iconamoon:like-thin" width="48" height="48" /></button
				>
			</div>
			<div class="mt-4 w-full flex flex-col gap-1 items-start">
				<p class="text-xs text-gray-500">Additional Feedback:</p>
				<TextInput bind:value={additionalFeedback} />
			</div>
		</div>
		<div class="mt-4 w-full flex justify-end">
			<TextButton
				on:click={() => {
					dispatch('close');
				}}>Cancel</TextButton
			>
			<TextButton on:click={onSubmit}>Submit</TextButton>
		</div>
	</div>
</BaseModal>
