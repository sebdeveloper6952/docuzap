import { ndk } from './ndk';
import { SignRequestEvent } from './events/signRequest';

export const fetchSignRequestEvent = async (id: string): Promise<SignRequestEvent | null> => {
	const event = await ndk.fetchEvent(id);

	if (event) {
		return SignRequestEvent.from(event);
	}

	return null;
};
