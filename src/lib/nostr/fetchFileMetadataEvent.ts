import { ndk } from './ndk';
import { FileMetadataEvent } from './events/fileMetadata';

export const fetchSignRequestEvent = async (id: string): Promise<FileMetadataEvent | null> => {
	const event = await ndk.fetchEvent(id);

	if (event) {
		return FileMetadataEvent.from(event);
	}

	return null;
};
