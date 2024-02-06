import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';

export const publishSignedRequest = async (
	signRequestEventId: string,
	fileMetadataEventId: string,
	signeePk: string
): Promise<NDKEvent> => {
	const e = new NDKEvent(ndk);

	e.kind = 230;
	e.tags = [
		['e', signRequestEventId],
		['e', fileMetadataEventId],
		['p', signeePk]
	];

	await e.publish();

	return e;
};
