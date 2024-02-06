<script setup lang="ts">
	export let value = '';
	export let type = 'text';

	const onInput = (e: Event) => (value = (e.target as HTMLInputElement).value);
</script>

<input
	{value}
	{type}
	on:input={onInput}
	class="w-full px-2 py-2 bg-background-500 text-black border-2 border-gray-300 rounded focus:outline-none"
/>
