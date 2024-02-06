import { hashFile } from '@lib/helpers/hashFile';
import NDK, { NDKEvent, NDKKind, type NostrEvent } from '@nostr-dev-kit/ndk';

export class SignRequestEvent extends NDKEvent {
	fileMetadataEventId?: string;
	fileMetadataEvent: NDKEvent | null | undefined;
	signedEvent?: NDKEvent;
	signedResponseUrl?: string;

	fileUrl?: string;
	hashMatches: boolean = false;
	isForUser: boolean = false;

	constructor(ndk?: NDK, rawEvent?: NostrEvent) {
		super(ndk, rawEvent);

		const signerPubkey = this.tags.find((t) => t[0] === 'p')?.[1];
		this.isForUser = signerPubkey === this.ndk?.activeUser?.pubkey;

		rawEvent?.tags.forEach((tag) => {
			if (tag[0] === 'e') {
				this.fileMetadataEventId = tag[1];
			}
		});
	}

	static from(ndkEvent: NDKEvent) {
		return new SignRequestEvent(ndkEvent.ndk, ndkEvent.rawEvent());
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

		await this.fetchSignedResponse();
	}

	private async fetchSignedResponse() {
		this.signedEvent =
			(await this.ndk?.fetchEvent({
				kinds: [230 as NDKKind],
				'#e': [this.id]
			})) ?? undefined;

		if (this.signedEvent) {
			const eventIds = this.signedEvent.tags.filter((t) => t[0] === 'e').map((t) => t[1]);
			const signedResponseFileMetadata = await this.ndk?.fetchEvent({
				kinds: [1063 as NDKKind],
				ids: eventIds
			});
			if (signedResponseFileMetadata) {
				this.signedResponseUrl = signedResponseFileMetadata.tags.find((t) => [t[0] === 'url'])?.[1];
			}
		}
	}
}
