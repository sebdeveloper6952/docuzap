import NDK, { NDKEvent, type NDKKind, type NostrEvent } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';
import { SignRequestEvent } from './events/signRequest';

export const signRequestStore = () => {
	const since = Math.round(new Date(1706875563000).getTime() / 1000);

	return ndk.storeSubscribe(
		[
			{ kinds: [229 as NDKKind], '#p': [ndk.activeUser?.pubkey!], since },
			{ kinds: [229 as NDKKind], authors: [ndk.activeUser?.pubkey!], since }
		],
		{
			closeOnEose: false
		},
		SignRequestEvent
	);
};
