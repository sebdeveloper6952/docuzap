import { hashFile } from '@lib/helpers/hashFile';
import { uploadFile } from '@lib/helpers/satellite/uploadFile';
import { publishFileMetadata } from './publishFileMetadata';

export const uploadFileAndPublishMetadata = async (file: File) => {
	const uploadResponse = await uploadFile(file);
	const fileHash = await hashFile(file);

	const fileMetadataEvent = await publishFileMetadata(
		uploadResponse.name,
		uploadResponse.url,
		uploadResponse.mimeType,
		uploadResponse.serverHash,
		fileHash
	);
};
