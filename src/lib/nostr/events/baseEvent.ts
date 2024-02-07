import NDK, { NDKEvent, type NostrEvent } from '@nostr-dev-kit/ndk';

export class BaseEvent extends NDKEvent {
	created_at: number;

	constructor(ndk?: NDK, rawEvent?: NostrEvent) {
		super(ndk, rawEvent);
		this.created_at = rawEvent?.created_at ?? 0;
	}
}
