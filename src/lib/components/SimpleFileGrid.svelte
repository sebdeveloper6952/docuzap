<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { FileMetadataEvent } from '@lib/nostr/events/fileMetadata';

	export let files: FileMetadataEvent[] = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
	{#each files as file}
		<div
			class="w-fit max-w-48 h-48 px-8 py-1 flex flex-col justify-center items-center text-gray-500 bg-primary-100/25 rounded relative"
		>
			<div class="w-full flex justify-end gap-1 absolute top-1 right-1">
				<a href={file.url} target="_blank" class="text-primary-900/75 hover:text-primary-900"
					><Icon icon="dashicons:external" width="24" height="24" /></a
				>
			</div>
			<div class="flex flex-col flex-1 justify-center items-center text-primary-900/75">
				<Icon icon="dashicons:pdf" width="48" height="48" />
				<p class="text-xs font-bold">{file.name}</p>
			</div>
		</div>
	{/each}
</div>
