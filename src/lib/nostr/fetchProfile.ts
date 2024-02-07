import { NDKUser } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';

export const fetchProfile = async (pubkey: string) => {
	const user = new NDKUser({ pubkey: pubkey });
	user.ndk = ndk;

	const p = await user.fetchProfile();

	return p;
};
