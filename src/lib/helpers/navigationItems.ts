export interface NavigationItem {
	id: number;
	path: string;
	name: string;
	icon: string;
}

export const navigationItems: NavigationItem[] = [
	{ id: 0, path: '/', name: 'Requests', icon: 'solar:document-add-bold-duotone' },
	{ id: 1, path: '/files', name: 'Files', icon: 'solar:folder-with-files-bold-duotone' }
];
