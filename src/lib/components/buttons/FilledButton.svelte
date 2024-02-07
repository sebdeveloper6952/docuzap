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
	class="px-4 py-2 rounded border-2 border-primary-100 bg-primary-100 text-primary-900 hover:border-primary-900 active:bg-primary-300 disabled:cursor-not-allowed"
>
	<slot />
</button>
