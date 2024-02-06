<script lang="ts">
	export let expanded = false;
	export let tall = false;
	export let disabled = false;
</script>

<button
	on:click
	{disabled}
	class:w-full={expanded}
	class:w-fit={!expanded}
	class:py-3={tall}
	class="px-4 py-2 rounded text-black border border-gray-500 hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed"
>
	<slot />
</button>
