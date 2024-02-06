import { NDKEvent } from '@nostr-dev-kit/ndk';
import { ndk } from '@lib/nostr/ndk';
import { deleteEvents } from '@lib/nostr/deleteEvent';
import type { FileMetadataEvent } from '@lib/nostr/subToUserFiles';

export const deleteFile = async (fileMetadataEvent: FileMetadataEvent): Promise<boolean> => {
	if (!fileMetadataEvent.hash) {
		return false;
	}

	await deleteEvents([fileMetadataEvent.id]);

	const authEvent = new NDKEvent(ndk);
	authEvent.kind = 22242;
	authEvent.content = 'Delete Item';
	authEvent.tags = [['x', fileMetadataEvent.hash]];
	await authEvent.sign();

	const authEventEncoded = encodeURIComponent(JSON.stringify(authEvent));
	const url = `https://api.satellite.earth/v1/media/item?auth=${authEventEncoded}`;

	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/pdf'
		}
	});

	return response.status === 200;
};
