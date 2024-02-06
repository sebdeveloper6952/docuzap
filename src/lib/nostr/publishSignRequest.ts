import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';

export const publishSignRequest = async (
	fileMetadataEventId: string,
	signers: string[]
): Promise<NDKEvent> => {
	const e = new NDKEvent(ndk);

	e.kind = 229;
	const pubkeyTags = signers.map((pk) => ['p', pk]);
	e.tags = [['e', fileMetadataEventId], ...pubkeyTags];

	await e.publish();

	return e;
};
