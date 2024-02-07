import NDKSvelte from '@nostr-dev-kit/ndk-svelte';
import { setNip07Signer, setSkSigner } from './nsecSigner';
import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';

const dexieAdapter = new NDKCacheAdapterDexie({ dbName: 'signstr' });

export const ndk = new NDKSvelte({
	explicitRelayUrls: ['wss://nostrue.com'],
	// @ts-ignore
	cacheAdapter: dexieAdapter
});

export const init = async () => {
	await ndk.connect();

	if (window.localStorage) {
		const pk = get(persisted('pk', ''));
		const sk = get(persisted('sk', ''));

		if (pk && pk !== '') {
			await setNip07Signer();
		} else if (sk && sk !== '') {
			await setSkSigner(sk);
		}
	}
};
