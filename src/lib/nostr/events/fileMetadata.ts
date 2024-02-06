import NDK, { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';

export class FileMetadataEvent extends NDKEvent {
	url?: string;
	hash?: string;
	originalHash?: string;
	name?: string;
	created_at: number;

	constructor(ndk?: NDK, rawEvent?: NostrEvent) {
		super(ndk, rawEvent);

		this.created_at = rawEvent?.created_at ?? 0;

		rawEvent?.tags.forEach((tag) => {
			if (tag[0] === 'url') {
				this.url = tag[1];
			} else if (tag[0] === 'x') {
				this.hash = tag[1];
			} else if (tag[0] === 'ox') {
				this.originalHash = tag[1];
			} else if (tag[0] === 'alt' && tag[1]) {
				this.name = tag[1];
			}
		});

		if (!this.name && this.url) {
			this.name = this.url.split('/').pop();
		}
	}

	static from(ndkEvent: NDKEvent) {
		return new FileMetadataEvent(ndkEvent.ndk, ndkEvent.rawEvent());
	}
}
