<script lang="ts">
	import { userStore } from '@nostr/nsecSigner';
</script>

{#if $userStore?.profile?.image}
	<img
		src={$userStore.profile.image}
		alt="profile"
		class="w-10 h-10 ring ring-gray-300 rounded-full"
	/>
{:else}
	<img
		src={`https://robohash.org/${$userStore?.pubkey}`}
		alt="profile"
		class="w-10 h-10 ring ring-gray-300 rounded-full"
	/>
{/if}
