<script lang="ts">
	import type { SignRequestEvent } from '@lib/nostr/events/signRequest.js';
	import { fetchSignRequestEvent } from '@lib/nostr/fetchSignRequestEvent.js';
	import { getEventIdFromDecodeResult, safeDecode } from '@lib/nostr/nip19.js';
	import { onMount } from 'svelte';

	export let data;

	let eventId = getEventIdFromDecodeResult(safeDecode(data.request));
	let event: SignRequestEvent | null;

	onMount(async () => {
		if (eventId) {
			event = await fetchSignRequestEvent(eventId);
			event?.init();
		}
	});
</script>

{#if event}
	<p>{event.hashMatches}</p>
{/if}
