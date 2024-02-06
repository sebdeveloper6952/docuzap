<script lang="ts">
	import type { NDKUser } from '@nostr-dev-kit/ndk';

	export let user: NDKUser;
</script>

<div class="px-2 py-1 flex items-center justify-center gap-1 bg-gray-300 rounded">
	<img
		src={user.profile?.image ? user.profile?.image : 'https://robohash.org/' + user.pubkey}
		alt="profile_picture"
		class="w-6 h-6 rounded-full"
	/>
	<p class="text-xs">{user.profile?.name?.substring(0, 32)}</p>
</div>
