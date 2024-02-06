import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store';

export const themeStore = persisted('theme:dark', false);

export const loadTheme = () => {
	const isDark = get(themeStore);

	if (isDark) document.documentElement.classList.add('dark');
	else document.documentElement.classList.remove('dark');
};

export const toggleTheme = () => {
	const isDark = get(themeStore);
	if (isDark) document.documentElement.classList.remove('dark');
	else document.documentElement.classList.add('dark');
	themeStore.set(!isDark);
};
