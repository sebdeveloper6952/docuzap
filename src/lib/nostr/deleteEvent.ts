import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ndk } from './ndk';

export const deleteEvents = async (ids: string[]) => {
	const event = new NDKEvent(ndk);

	event.kind = 5;
	event.tags = [...ids.map((id) => ['e', id])];

	await event.publish();
};
