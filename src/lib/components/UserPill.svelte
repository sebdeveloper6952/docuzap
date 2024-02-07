<script lang="ts">
	import { fetchProfile } from '@lib/nostr/fetchProfile';
	import type { NDKUser } from '@nostr-dev-kit/ndk';
	import { nip19 } from 'nostr-tools';
	import { onMount } from 'svelte';

	export let user: NDKUser;

	let name = nip19.npubEncode(user.pubkey).toString();

	$: if (user.profile && user.profile.name) {
		name = user.profile.name;
	}

	onMount(async () => {
		if (!user.profile) {
			user.profile = (await fetchProfile(user.pubkey)) ?? undefined;
			user = user;
		}
	});
</script>

<div class="w-fit px-2 py-1 flex items-center justify-center gap-1 bg-primary-100/25 rounded">
	<img
		src={user.profile?.image ? user.profile?.image : 'https://robohash.org/' + user.pubkey}
		alt="profile_picture"
		class="w-6 h-6 rounded-full"
	/>
	<p class="text-xs">
		{name}
	</p>
</div>
