import NDK, { NDKEvent, type NDKKind, type NostrEvent } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';
import { writable } from 'svelte/store';
import { FileMetadataEvent } from './events/fileMetadata';

export const userFilesStore = writable<FileMetadataEvent[]>([]);

export const fetchUserFiles = async () => {
	const rawEvents = await ndk.fetchEvents({
		kinds: [1063 as NDKKind],
		authors: [ndk.activeUser?.pubkey!],
		'#m': ['application/pdf']
	});

	const fileMetadataEvents = Array.from(rawEvents).map((e) => FileMetadataEvent.from(e));

	const urls = new Set<string>();
	const filteredEvents: FileMetadataEvent[] = [];

	fileMetadataEvents.forEach((e) => {
		if (!urls.has(e.url!)) {
			urls.add(e.url!);
			filteredEvents.push(e);
		}
	});

	userFilesStore.set(filteredEvents);
};

// export const userFilesStore = () => {
// 	return ndk.storeSubscribe(
// 		[{ kinds: [1063 as NDKKind], authors: [ndk.activeUser?.pubkey!], '#m': ['application/pdf'] }],
// 		{
// 			closeOnEose: false
// 		},
// 		FileMetadataEvent
// 	);
// };
