<script lang="ts">
	import type { NDKUser } from '@nostr-dev-kit/ndk';

	export let user: NDKUser;
</script>

<button>
	{#await user.fetchProfile() then}
		<div class="flex gap-2 items-center">
			{#if user.profile && user.profile.image}
				<img
					src={user.profile.image}
					alt="profile"
					class="w-10 h-10 p-px ring ring-orange-700 rounded-full"
				/>
			{:else}
				<img
					src={`https://robohash.org/${user.pubkey}`}
					alt="profile"
					class="w-10 h-10 p-px ring ring-orange-700 rounded-full"
				/>
			{/if}
			{#if user.profile && user.profile.name}
				<p>{user.profile.name}</p>
			{:else}
				<p>{user.pubkey.substring(0, 16)}...</p>
			{/if}
		</div>
	{/await}
</button>
