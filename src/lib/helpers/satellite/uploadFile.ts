import { ndk } from '@lib/nostr/ndk';
import { NDKEvent } from '@nostr-dev-kit/ndk';

export interface UploadResponse {
	url: string;
	serverHash: string;
	mimeType: string;
	name: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
	const authEvent = new NDKEvent(ndk);
	authEvent.kind = 22242;
	authEvent.content = 'Authorize Upload';
	authEvent.tags = [['name', file.name]];
	await authEvent.sign();

	const authEventEncoded = encodeURIComponent(JSON.stringify(authEvent));
	const url = `https://api.satellite.earth/v1/media/item?auth=${authEventEncoded}`;

	const response = await fetch(url, {
		method: 'PUT',
		body: file,
		headers: {
			'Content-Type': 'application/pdf'
		}
	});

	const decoded = await response.json();
	const nip94Data = decoded['nip94'] as string[][];

	const nip94Response = {
		url: '',
		mimeType: '',
		serverHash: '',
		name: ''
	};

	Array.from(nip94Data).forEach((e) => {
		if (e[0] === 'url') nip94Response.url = e[1];
		else if (e[0] === 'm') nip94Response.mimeType = e[1];
		else if (e[0] === 'x') nip94Response.serverHash = e[1];
		else if (e[0] === 'name') nip94Response.name = e[1];
	});

	return nip94Response;
};
