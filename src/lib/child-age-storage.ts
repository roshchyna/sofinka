const CHILD_AGE_STORAGE_KEY = "sofinka.childAge";
const DEFAULT_CHILD_AGE = 7;

export const CHILD_AGE_CHANGED_EVENT = "sofinka.childAge.changed";
export const childAgeOptions = [3, 4, 5, 6, 7, 8, 9, 10];

export function getChildAge() {
	if (typeof window === "undefined") return DEFAULT_CHILD_AGE;

	const storedAge = Number(window.localStorage.getItem(CHILD_AGE_STORAGE_KEY));
	return childAgeOptions.includes(storedAge) ? storedAge : DEFAULT_CHILD_AGE;
}

export function saveChildAge(age: number) {
	if (typeof window === "undefined") return;

	window.localStorage.setItem(CHILD_AGE_STORAGE_KEY, String(age));
	window.dispatchEvent(new Event(CHILD_AGE_CHANGED_EVENT));
}
