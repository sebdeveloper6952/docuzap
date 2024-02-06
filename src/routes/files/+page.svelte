<script lang="ts">
	import FileInput from '@lib/components/forms/FileInput.svelte';
	import { fetchUserFiles, userFilesStore } from '@lib/nostr/subToUserFiles';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import { deleteFile } from '@lib/helpers/satellite/deleteFile';
	import { uploadFileAndPublishMetadata } from '@lib/nostr/uploadFileAndPublishMetadata';
	import toast from 'svelte-french-toast';
	import { FileMetadataEvent } from '@lib/nostr/events/fileMetadata';

	let inputFiles: FileList;
	let uploading = false;

	onMount(async () => {
		await fetchUserFiles();
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
				.finally(() => {
					uploading = false;
					fetchUserFiles();
				});
		}
	};

	const onDeleteFileEvent = async (event: FileMetadataEvent) => {
		toast
			.promise(deleteFile(event), {
				loading: 'Deleting...',
				success: 'Deleted!',
				error: 'Could not delete.'
			})
			.finally(() => {
				uploading = false;
				fetchUserFiles();
			});
	};
</script>

<div class="w-full flex justify-end">
	<FileInput bind:files={inputFiles} on:change={onUploadFile} disabled={uploading} />
</div>
<div class="w-full mt-2 flex justify-center">
	<div class="w-full md:max-w-screen-md">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
			{#each $userFilesStore as file}
				<div
					class="w-full h-48 p-1 flex flex-col justify-center items-center text-gray-500 bg-gray-200 rounded"
				>
					<div class="w-full flex justify-end gap-1">
						<a href={file.url} target="_blank" class="text-gray-400 hover:text-gray-600"
							><Icon icon="dashicons:external" width="24" height="24" /></a
						>
						<button
							on:click={() => onDeleteFileEvent(file)}
							class="text-gray-400 hover:text-red-400"
						>
							<Icon icon="dashicons:trash" width="24" height="24" />
						</button>
					</div>
					<div class="flex flex-col flex-1 justify-center items-center">
						<Icon icon="dashicons:pdf" width="48" height="48" />
						<p class="font-bold">{file.name}</p>
					</div>
					<div class="w-full flex justify-end">
						<p class="text-xs">{dayjs(file.created_at * 1000).format('lll')}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
