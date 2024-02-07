<script lang="ts">
	import Icon from '@iconify/svelte';
	import SimpleFile from '@lib/components/SimpleFile.svelte';
	import UserPill from '@lib/components/UserPill.svelte';
	import FilledButton from '@lib/components/buttons/FilledButton.svelte';
	import FileInput from '@lib/components/forms/FileInput.svelte';
	import type { FileMetadataEvent } from '@lib/nostr/events/fileMetadata';
	import type { SignRequestEvent } from '@lib/nostr/events/signRequest';
	import { fetchFileMetadataEvent } from '@lib/nostr/fetchFileMetadataEvent';
	import { fetchSignRequestEvent } from '@lib/nostr/fetchSignRequestEvent';
	import { getEventIdFromDecodeResult, safeDecode } from '@lib/nostr/nip19';
	import { publishSignedRequest } from '@lib/nostr/publishSignedRequest';
	import { uploadFileAndPublishMetadata } from '@lib/nostr/uploadFileAndPublishMetadata';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { signResponseStore } from '@lib/nostr/subToSignResponse';
	import type { NDKEventStore } from '@nostr-dev-kit/ndk-svelte';
	import type { SignResponseEvent } from '@lib/nostr/events/signResponse';
	import dayjs from 'dayjs';
	import { get } from 'svelte/store';
	import { deleteEvents } from '@lib/nostr/deleteEvent.js';

	export let data;

	let eventId = getEventIdFromDecodeResult(safeDecode(data.request));
	let event: SignRequestEvent | null;
	let fileMetadataEvent: FileMetadataEvent | null;
	let inputFiles: FileList;
	let uploading = false;
	let uploaded = false;
	let uploadedFileMetadataEventId = '';
	let responseStore: NDKEventStore<SignResponseEvent>;

	$: subTitleText = event?.isForUser
		? 'Your signature is requested on the following file(s)'
		: 'You requested a signature on the following file(s)';

	onMount(async () => {
		if (eventId) {
			event = await fetchSignRequestEvent(eventId);
			await event?.init();
			event = event;

			fileMetadataEvent = await fetchFileMetadataEvent(event?.fileMetadataEventId!);

			responseStore = signResponseStore(eventId, event?.isForUser!);
			responseStore.ref();
		}
	});

	onDestroy(() => {
		responseStore.unref();
	});

	const onUploadFile = async () => {
		if (inputFiles && inputFiles.length === 1) {
			uploading = true;
			toast
				.promise(uploadFileAndPublishMetadata(inputFiles[0]), {
					loading: 'Uploading...',
					success: 'Uploaded!',
					error: 'Could not upload.'
				})
				.then((eventId: string) => {
					uploadedFileMetadataEventId = eventId;
				})
				.finally(() => {
					uploading = false;
					uploaded = true;
				});
		}
	};

	const onSubmit = async () => {
		const e = await publishSignedRequest(event?.id!, uploadedFileMetadataEventId);
	};
</script>

{#if event}
	<div class="w-full flex justify-center">
		<div class="w-full md:max-w-screen-md p-4 rounded-3xl bg-primary-100/10">
			<div class="flex items-center gap-1">
				<Icon icon="fluent:signature-16-regular" width="24" height="24" />
				<p class="text-xl font-bold">Signature Request</p>
			</div>
			<p class=" my-4 font-bold">{subTitleText}</p>
			{#if fileMetadataEvent}
				<div class="mt-4 grid grid-cols-1 md:grid-cols-3">
					<SimpleFile file={fileMetadataEvent} />
				</div>
			{/if}

			{#if !event.isForUser}
				<div class="mt-4">
					<p class=" my-4 font-bold">From the following user(s)</p>
					{#each event.signers as user}
						<UserPill {user} />
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-4 w-full flex justify-center">
		<div class="w-full md:max-w-screen-md p-4 rounded-3xl bg-primary-100/10">
			<!-- submitted signatures area -->
			<div class="flex items-center gap-2">
				<Icon icon="solar:users-group-rounded-bold-duotone" width="24" height="24" />
				<p class="text-xl font-bold">Submitted Signatures</p>
			</div>
			<div class="mt-4 w-full flex justify-center">
				{#if !$responseStore || $responseStore.length === 0}
					<div class="w-full flex flex-col items-center">
						<Icon icon="solar:clock-square-line-duotone" width="48" height="48" />
						<p>Signature submissions will appear here</p>
					</div>
				{:else}
					{#each $responseStore as response}
						<!-- response card / list item -->
						{#await response.init() then}
							<div class="w-full p-4 bg-primary-500/10 rounded-3xl">
								<div class="">
									<div class="flex items-center gap-2">
										<p>Signed by</p>
										<UserPill user={response.author} />
										<div class="grow"></div>
										<div class="flex items-center gap-1">
											<a
												href={response.fileUrl}
												target="_blank"
												class="text-primary-900/75 hover:text-primary-900"
											>
												<Icon icon="dashicons:external" width="24" height="24" />
											</a>
											<button
												on:click={() => deleteEvents([response.id])}
												class="text-primary-900/75 hover:text-primary-900"
											>
												<Icon icon="dashicons:trash" width="16" height="16" />
											</button>
										</div>
									</div>
									<div class="mt-2">
										<p class="text-xs">{dayjs(response.created_at * 1000).format('lll')}</p>
									</div>
								</div>
							</div>
							<!-- end response card / list item -->
						{/await}
					{/each}
				{/if}
			</div>
			<!-- end submitted sigs -->

			<!-- upload a signature -->
			{#if event.isForUser && responseStore && $responseStore.length === 0}
				{#if uploaded}
					<div class="mt-4 w-full flex justify-center">
						<div class="flex flex-col items-center">
							<FilledButton on:click={() => onSubmit()}>
								<div class="flex justify-center gap-2">
									<p>Sign and submit</p>
									<Icon icon="fa6-solid:file-signature" width="24" height="24" />
								</div>
							</FilledButton>
						</div>
					</div>
				{:else}
					<div class="mt-4 w-full flex justify-center">
						<div class="flex flex-col items-center">
							<FileInput bind:files={inputFiles} on:change={onUploadFile} />
						</div>
					</div>
				{/if}
			{/if}
			<!-- end upload a sig -->
		</div>
	</div>
{/if}
