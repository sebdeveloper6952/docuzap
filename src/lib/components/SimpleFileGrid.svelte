<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { FileMetadataEvent } from '@lib/nostr/events/fileMetadata';

	export let files: FileMetadataEvent[] = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
	{#each files as file}
		<div
			class="w-fit h-48 px-8 py-1 flex flex-col justify-center items-center text-gray-500 bg-gray-200 border-2 border-gray-200 rounded relative"
		>
			<div class="w-full flex justify-end gap-1 absolute top-1 right-1">
				<a href={file.url} target="_blank" class="text-gray-400 hover:text-gray-600"
					><Icon icon="bitcoin-icons:export-outline" width="24" height="24" /></a
				>
			</div>
			<div class="flex flex-col flex-1 justify-center items-center">
				<Icon icon="dashicons:pdf" width="48" height="48" />
				<p class="text-xs font-bold">{file.name}</p>
			</div>
		</div>
	{/each}
</div>
