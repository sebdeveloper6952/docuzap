<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { navigationItems } from '@lib/helpers/navigationItems';
	import FloatingActionButton from '../buttons/FloatingActionButton.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="w-full h-fit py-4 px-4 fixed bottom-0 left-0 flex items-center gap-4 bg-orange-100">
	{#each navigationItems as item, i}
		<a
			href={item.path}
			class="py-2 px-2 flex flex-col justify-center items-center hover:text-orange-700"
			class:text-orange-700={$page.url.pathname === item.path}
		>
			<Icon icon={item.icon} width="24" height="24" />
		</a>
	{/each}
	<div class="grow"></div>
	<FloatingActionButton on:click={() => goto('/new')} icon="fluent:add-20-filled"
	></FloatingActionButton>
</div>
