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
	class="px-4 py-2 rounded text-white bg-primary-500 hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:hover:bg-orange-700"
>
	<slot />
</button>
