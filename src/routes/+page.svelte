<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import FilledButton from '@lib/components/buttons/FilledButton.svelte';
	import { signRequestStore } from '@lib/nostr/subToSignRequest';
	import { SignRequestEvent } from '@lib/nostr/events/signRequest';
	import dayjs from 'dayjs';
	import { nip19 } from 'nostr-tools';
	import { onDestroy, onMount } from 'svelte';
	import { deleteEvents } from '@lib/nostr/deleteEvent';

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

<div class="mt-4">
	<div class="w-full flex flex-col items-center">
		<div class="w-full md:max-w-screen-md flex flex-col gap-2">
			<div class="relative overflow-x-auto">
				<table class="w-full text-sm text-left rtl:text-right text-gray-500">
					<thead class="text-xs text-gray-700 uppercase bg-gray-200">
						<tr>
							<th scope="col" class="px-6 py-3">Date</th>
							<th scope="col" class="px-6 py-3">Type</th>
							<th scope="col" class="px-6 py-3">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each $signRequestsStore as event}
							<tr class="bg-white border-b">
								<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									{dayjs(event.created_at * 1000).format('lll')}
								</th>
								<td class="px-6 py-4">
									{#if event.isForUser}
										<div class="flex items-center gap-2">
											<Icon icon="solar:arrow-right-up-line-duotone" width="16" height="16" />
											<p class="text-md">Your signature is requested</p>
										</div>
									{:else}
										<div class="flex items-center gap-2">
											<Icon icon="solar:arrow-right-up-line-duotone" width="16" height="16" />
											<p class="text-md">You requested to sign</p>
										</div>
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
			</div>
		</div>
	</div>
</div>
