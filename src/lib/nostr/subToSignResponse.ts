import { type NDKFilter, type NDKKind } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';
import { SignResponseEvent } from './events/signResponse';

export const signResponseStore = (signRequestEventId: string, activeUser: boolean) => {
	const filter: NDKFilter = {
		kinds: [230 as NDKKind],
		'#e': [signRequestEventId]
	};

	if (activeUser) {
		filter.authors = [ndk.activeUser?.pubkey!];
	}

	return ndk.storeSubscribe(
		filter,
		{
			closeOnEose: false,
			autoStart: false
		},
		SignResponseEvent
	);
};
