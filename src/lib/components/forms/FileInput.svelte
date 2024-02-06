<script lang="ts">
	import Icon from '@iconify/svelte';

	export let files: FileList;
	export let disabled = false;
</script>

<div class="w-fit flex items-center gap-1">
	<label
		for="fileInput"
		class="px-2 py-1 flex gap-1 rounded text-white bg-primary-500 hover:bg-orange-600 hover:cursor-pointer"
	>
		<p>Upload file</p>
		<Icon icon="solar:cloud-upload-line-duotone" width="24" height="24" />
	</label>
	<input
		bind:files
		on:change
		{disabled}
		id="fileInput"
		type="file"
		accept="application/pdf"
		class="hidden w-full"
	/>
</div>
