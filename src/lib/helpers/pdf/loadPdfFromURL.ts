export const loadPDFFromURL = async (url: string) => {
	const r = await fetch('https://corsproxy.io/?' + url);

	return r.arrayBuffer();
};
