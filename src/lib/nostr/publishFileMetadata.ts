import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';

export const publishFileMetadata = async (
	fileDescription: string,
	url: string,
	mimeType: string,
	xHash: string,
	oxHash: string
): Promise<NDKEvent> => {
	const e = new NDKEvent(ndk);

	e.kind = 1063;
	e.content = fileDescription;
	e.tags = [
		['url', url],
		['m', mimeType],
		['x', xHash],
		['ox', oxHash],
		['alt', fileDescription]
	];

	await e.publish();

	return e;
};
