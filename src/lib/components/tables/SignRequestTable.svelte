<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { SignRequestEvent } from '@lib/nostr/events/signRequest';
	import dayjs from 'dayjs';
	import FilledButton from '../buttons/FilledButton.svelte';
	import { deleteEvents } from '@lib/nostr/deleteEvent';
	import { nip19 } from 'nostr-tools';
	import { goto } from '$app/navigation';
	import { signRequestStore } from '@lib/nostr/subToSignRequest';
	import { onDestroy, onMount } from 'svelte';

	let signRequestsStore = signRequestStore();

	onMount(async () => {
		signRequestsStore.ref();
	});

	onDestroy(() => {
		signRequestsStore.unref();
	});

	const onDetailsClick = (event: SignRequestEvent) => {
		const nevent = nip19.neventEncode({
			id: event.id,
			author: event.author.pubkey,
			kind: event.kind,
			relays: [event.relay?.url!]
		});
		goto('/requests/' + nevent);
	};
</script>

<div class="relative overflow-x-auto">
	{#if $signRequestsStore.length === 0}
		<div class="w-full p-4 flex justify-center">
			<p class="text-gray-500">No requests yet</p>
		</div>
	{:else}
		<table class="w-full text-sm text-left rtl:text-right text-gray-500">
			<thead class="text-xs text-gray-700 uppercase bg-primary-500/10">
				<tr>
					<th scope="col" class="px-6 py-3">Date</th>
					<th scope="col" class="px-6 py-3">Type</th>
					<th scope="col" class="px-6 py-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each $signRequestsStore as event}
					<tr class="bg-white border-b">
						<th scope="row" class="px-6 py-4 font-medium text-xs text-gray-900 whitespace-nowrap">
							{dayjs(event.created_at * 1000).format('lll')}
						</th>
						<td class="px-6 py-4 text-xs text-gray-900">
							{#if event.isForUser}
								<p>Your signature is requested</p>
							{:else}
								<p>You requested to sign</p>
							{/if}
						</td>

						<td class="px-6 py-4 flex items-center gap-2">
							<FilledButton on:click={() => onDetailsClick(event)}>Details</FilledButton>
							<button on:click={() => deleteEvents([event.id])}>
								<Icon icon="dashicons:trash" width="16" height="16" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
