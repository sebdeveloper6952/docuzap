<script lang="ts">
	import Icon from '@iconify/svelte';

	export let label = 'New Scan';
	export let icon = 'pixelarticons:debug-play';
</script>

<button
	on:click
	class="p-4 flex justify-center items-center gap-1 bg-primary-100 text-primary-900 font-bold rounded-xl"
>
	<Icon {icon} width="24" height="24" />
	<p class="hidden md:block">{label}</p>
</button>
