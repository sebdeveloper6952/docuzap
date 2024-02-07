import { hashFile } from '@lib/helpers/hashFile';
import NDK, { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';
import { BaseEvent } from './baseEvent';

export class SignResponseEvent extends BaseEvent {
	fileMetadataEvent: NDKEvent | null | undefined;
	fileMetadataEventId?: string;
	fileUrl?: string;
	hashMatches: boolean = false;

	constructor(ndk?: NDK, rawEvent?: NostrEvent) {
		super(ndk, rawEvent);

		rawEvent?.tags.forEach((tag) => {
			if (tag[0] === 'e') {
				this.fileMetadataEventId = tag[1];
			}
		});
	}

	static from(ndkEvent: NDKEvent) {
		return new SignResponseEvent(ndkEvent.ndk, ndkEvent.rawEvent());
	}

	async init() {
		this.fileMetadataEvent = await this.ndk?.fetchEvent(this.fileMetadataEventId!);
		if (this.fileMetadataEvent) {
			const oxHash = this.fileMetadataEvent.tags.find((t) => t[0] === 'ox')?.[1];
			const url = this.fileMetadataEvent.tags.find((t) => t[0] === 'url')?.[1];
			if (url) {
				this.fileUrl = url;
				const response = await fetch('https://corsproxy.io/?' + url, {});
				const blob = await response.blob();
				const hash = await hashFile(new Blob([blob]));
				this.hashMatches = hash === oxHash;
			}
		}
	}
}
