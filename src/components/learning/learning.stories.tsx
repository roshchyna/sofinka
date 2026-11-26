import type { Meta, StoryObj } from "@storybook/react-vite";
import { useTranslation } from "react-i18next";
import { fn } from "storybook/test";
import { FIRST_LESSON_ID, getMathCourse } from "@/data/courses/math-to-100";
import { toLanguage } from "@/i18n/languages";
import { createLearningSession } from "@/lib/learning/session";
import type { StorageStatus } from "@/lib/learning/storage";
import { CourseOverview } from "./course-overview";
import { LearningStorageNotice } from "./learning-status";
import { LearningLessonPlayer } from "./lesson-player";
import { LessonSummary } from "./lesson-summary";
import { WorkedExample } from "./worked-example";

type View = "course" | "example" | "lesson" | "review" | "summary" | "storage";
const meta = {
	title: "Learning/Components",
	args: { view: "course", storageStatus: "saved" },
	render: function Learning({ view, storageStatus }) {
		const { i18n } = useTranslation();
		const language = toLanguage(i18n.resolvedLanguage);
		const lesson = getMathCourse(language).publishedLessons[0];
		if (view === "course") return <CourseOverview language={language} />;
		if (view === "example")
			return <WorkedExample language={language} lesson={lesson} />;
		if (view === "storage")
			return (
				<LearningStorageNotice language={language} status={storageStatus} />
			);
		if (view === "summary")
			return (
				<LessonSummary
					language={language}
					session={{
						...createLearningSession(lesson, "lesson", "storybook", 0),
						status: "completed",
						completedAt: 300000,
					}}
					attempts={lesson.exercises.map((exercise, i) => ({
						id: `attempt-${i}`,
						sessionId: "storybook",
						exerciseId: exercise.id,
						questionId: exercise.question.id,
						value: "30 + 4",
						isCorrect: i !== 0,
						hintUsed: i === 0,
						submittedAt: 60000 * (i + 1),
					}))}
					onReview={fn()}
				/>
			);
		return (
			<LearningLessonPlayer
				language={language}
				lessonId={FIRST_LESSON_ID}
				mode={view === "review" ? "review" : "lesson"}
			/>
		);
	},
} satisfies Meta<{ view: View; storageStatus: StorageStatus }>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Course: Story = {};
export const Example: Story = { args: { view: "example" } };
export const Lesson: Story = { args: { view: "lesson" } };
export const Review: Story = { args: { view: "review" } };
export const Summary: Story = { args: { view: "summary" } };
export const ProgressSaved: Story = {
	args: { view: "storage", storageStatus: "saved" },
};
export const InvalidProgress: Story = {
	args: { view: "storage", storageStatus: "invalid" },
};
export const StorageUnavailable: Story = {
	args: { view: "storage", storageStatus: "unavailable" },
};
