import { learningCopy } from "@/data/courses/learning-copy";
import type { Language } from "@/i18n/languages";
import type { StorageStatus } from "@/lib/learning/storage";

export function LearningStorageNotice({
	language,
	status,
}: {
	language: Language;
	status: StorageStatus;
}) {
	const copy = learningCopy[language];
	if (status === "loading") return null;
	if (status === "saved")
		return (
			<p className="text-sm text-zinc-500 dark:text-zinc-400">
				{copy.progressSaved}
			</p>
		);
	return (
		<output className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
			{status === "invalid" ? copy.invalidStorage : copy.storageError}
		</output>
	);
}
