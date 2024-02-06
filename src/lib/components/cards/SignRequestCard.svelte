<script lang="ts">
	import type { SignRequestEvent } from '@lib/nostr/subToSignRequest';
	import PubkeyAvatar from '../PubkeyAvatar.svelte';
	import Icon from '@iconify/svelte';
	import FilledButton from '../buttons/FilledButton.svelte';
	import { modifyPdf } from '@lib/helpers/pdf/modifyPdf';
	import { uploadFile } from '@lib/helpers/satellite/uploadFile';
	import { hashFile } from '@lib/helpers/hashFile';
	import { publishFileMetadata } from '@lib/nostr/publishFileMetadata';
	import { publishSignedRequest } from '@lib/nostr/publishSignedRequest';
	import { deleteEvents } from '@lib/nostr/deleteEvent';

	export let event: SignRequestEvent;
	let loading = false;
	let fileMetadataEventId = '';

	const onSign = async (signRequestEventId: string, signeePk: string, url: string) => {
		try {
			loading = true;
			const response = await fetch('https://corsproxy.io/?' + url);
			const pdfBytes = await response.arrayBuffer();
			const newPdfBytes = await modifyPdf(pdfBytes);

			const newPdfFile = new File([newPdfBytes], 'response.pdf', { type: 'application/pdf' });

			const uploadResponse = await uploadFile(newPdfFile);
			const fileHash = await hashFile(newPdfFile);

			const fileMetadataEvent = await publishFileMetadata(
				uploadResponse.url,
				uploadResponse.url,
				uploadResponse.mimeType,
				uploadResponse.serverHash,
				fileHash
			);
			fileMetadataEventId = fileMetadataEvent.id;

			const signedEvent = await publishSignedRequest(
				signRequestEventId,
				fileMetadataEvent.id,
				signeePk
			);
		} finally {
			loading = false;
		}
	};
</script>

<div
	class="p-4 flex flex-col rounded text-black dark:text-primary-100 bg-gray-200 dark:bg-primary-900/10 break-all relative"
>
	<button on:click={() => deleteEvents([event.id])} class="absolute top-1 right-1 text-gray-400">
		<Icon icon="dashicons:trash" width="16" height="16" />
	</button>
	<div class="w-full flex justify-between">
		<div class="flex gap-2 items-center">
			{#if event.isForUser}
				<PubkeyAvatar user={event.author} />
				<p>has requested to sign:</p>
			{:else}
				<p>You have requested to sign</p>
			{/if}
		</div>
	</div>

	{#await event.init() then}
		{#if event.isForUser && event.hashMatches && event.fileUrl && !event.signedEvent}
			<div class="w-full flex justify-end">
				<FilledButton
					on:click={async () => {
						await onSign(event.id, event.author.pubkey, event.fileUrl ?? '');
					}}
				>
					<div class="w-full flex gap-1 justify-center">
						<Icon icon="bitcoin-icons:key-filled" width="24" height="24" />
						<p>Sign</p>
					</div>
				</FilledButton>
			</div>
		{/if}
		{#if event.signedEvent}
			<div class="mt-4 p-4 bg-background-500 rounded">
				<div class="flex text-green-600">
					<Icon icon="bitcoin-icons:verify-filled" width="24" height="24" />
					<p>Signed</p>
				</div>
				<PubkeyAvatar user={event.signedEvent.author} />
				{#if event.signedResponseUrl}
					<a href={event.signedResponseUrl} target="_blank" class="w-fit flex gap-1 items-center">
						<p>View PDF</p>
						<Icon icon="bitcoin-icons:export-filled" width="24" height="24" />
					</a>
				{/if}
			</div>
		{/if}
	{/await}
</div>
