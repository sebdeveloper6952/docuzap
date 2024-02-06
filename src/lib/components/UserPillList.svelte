<script lang="ts">
	import type { NDKUser } from '@nostr-dev-kit/ndk';
	import UserPill from './UserPill.svelte';

	export let users: NDKUser[];
</script>

<div class="flex gap-1">
	{#each users as user}
		<UserPill {user} />
	{/each}
</div>
