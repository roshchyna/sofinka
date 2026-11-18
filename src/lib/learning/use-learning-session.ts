import { useEffect, useReducer, useRef, useState } from "react";
import { learningReducer } from "./session";
import {
	loadLearningProgress,
	type StorageStatus,
	saveLearningProgress,
} from "./storage";
import type { LearningProgress } from "./types";

export function useLearningProgress() {
	const [progress, dispatch] = useReducer(learningReducer, null);
	const [storageStatus, setStorageStatus] = useState<StorageStatus>("loading");
	const lastSaved = useRef<LearningProgress | null>(null);
	const canSave = useRef(false);

	useEffect(() => {
		const loaded = loadLearningProgress();
		lastSaved.current = loaded.progress;
		canSave.current = loaded.status === "saved";
		setStorageStatus(loaded.status);
		dispatch({ type: "restore", progress: loaded.progress });
	}, []);

	useEffect(() => {
		if (!progress || progress === lastSaved.current || !canSave.current) return;
		try {
			saveLearningProgress(progress);
			lastSaved.current = progress;
		} catch {
			canSave.current = false;
			setStorageStatus("unavailable");
		}
	}, [progress]);

	return { progress, dispatch, storageStatus };
}
