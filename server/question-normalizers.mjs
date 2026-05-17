import { getLanguageConfig } from "./languages.mjs";

export function normalizeGeneratedResponse(generated, request) {
	const questions = Array.isArray(generated?.questions) ? generated.questions : [];

	return {
		questions: questions.map((question, index) =>
			normalizeQuestion(question, index, request),
		),
	};
}

function normalizeQuestion(question, index, request) {
	const text = getLanguageConfig(request.language);
	const base = {
		id: question?.id ?? index + 1,
		type: request.type,
		title: stringOrFallback(
			question?.title,
			`${text.questionAbout} ${request.topic}`,
		),
		description: stringOrFallback(question?.description, text.shortHint),
	};

	if (request.type === "matching") {
		return {
			...base,
			pairs: normalizePairs(question, request.topic, request.language),
		};
	}

	if (request.type === "image-choice") {
		return {
			...base,
			options: normalizeImageOptions(question, request.topic, request.language),
		};
	}

	if (request.type === "sorting") {
		return { ...base, ...normalizeSortingQuestion(question, request) };
	}

	if (request.type === "true-false") {
		return {
			...base,
			options: normalizeTrueFalseOptions(question, request.language),
		};
	}

	if (request.type === "text-input") {
		return {
			...base,
			answers: normalizeTextAnswers(question, request),
			placeholder: stringOrFallback(question?.placeholder, text.answer),
		};
	}

	if (
		request.type === "single-choice" ||
		request.type === "multiple-choice" ||
		request.type === "odd-one-out"
	) {
		return {
			...base,
			options: normalizeChoiceOptions(question, request.topic, request.language),
		};
	}

	return {
		...question,
		id: base.id,
		type: request.type,
		title: base.title,
		description: base.description,
	};
}

function normalizeTrueFalseOptions(question, language = "ru") {
	const text = getLanguageConfig(language);
	const answer = typeof question?.answer === "boolean" ? question.answer : null;
	const options = (Array.isArray(question?.options) ? question.options : [])
		.slice(0, 2)
		.map((option, index) => ({
			id: stringOrFallback(option?.id, `option-${index + 1}`),
			label: stringOrFallback(
				option?.label,
				index === 0 ? text.trueLabel : text.falseLabel,
			),
			isCorrect: getGeneratedIsCorrect(option),
		}));
	while (options.length < 2) {
		const index = options.length;
		options.push({
			id: `option-${index + 1}`,
			label: index === 0 ? text.trueLabel : text.falseLabel,
			isCorrect: index === 0 ? answer ?? true : answer === false,
		});
	}

	if (!options.some((option) => option.isCorrect)) {
		options[answer === false ? 1 : 0].isCorrect = true;
	}

	return options;
}

function normalizeTextAnswers(question, request) {
	const text = getLanguageConfig(request.language);
	const answers = Array.isArray(question?.answers)
		? question.answers
		: typeof question?.answer === "string"
			? [question.answer]
			: Array.isArray(question?.options)
				? question.options
						.filter((option) => getGeneratedIsCorrect(option))
						.map((option) => option?.label)
				: [];
	const safeAnswers = answers
		.filter((answer) => typeof answer === "string")
		.map((answer) => answer.trim())
		.filter(Boolean);

	return safeAnswers.length ? safeAnswers : [request.topic || text.answer];
}

function normalizePairs(question, topic, language = "ru") {
	const text = getLanguageConfig(language);
	const pairs = (Array.isArray(question?.pairs) ? question.pairs : [])
		.map((pair, index) => ({
			id: stringOrFallback(pair?.id, `pair-${index + 1}`),
			left: stringOrFallback(pair?.left, ""),
			right: stringOrFallback(pair?.right, ""),
		}))
		.filter((pair) => pair.left && pair.right);

	return pairs.length
		? pairs
		: [
				{ id: "pair-1", left: topic || text.topic, right: text.mainTopic },
				{ id: "pair-2", left: text.concept, right: text.description },
			];
}

function normalizeSortingQuestion(question, request) {
	const text = getLanguageConfig(request.language);
	const categories = (Array.isArray(question?.categories)
		? question.categories
		: []
	)
		.map((category, index) => ({
			id: stringOrFallback(category?.id, `category-${index + 1}`),
			label: stringOrFallback(category?.label, `${text.group} ${index + 1}`),
		}))
		.filter((category) => category.label);
	const safeCategories = categories.length
		? categories
		: [
				{ id: "category-1", label: request.topic || text.topic },
				{ id: "category-2", label: text.otherOption },
			];
	const items = (Array.isArray(question?.items) ? question.items : [])
		.map((item, index) => {
			const categoryId = stringOrFallback(
				item?.categoryId,
				safeCategories[index % safeCategories.length]?.id ?? safeCategories[0].id,
			);
			const categoryExists = safeCategories.some(
				(category) => category.id === categoryId,
			);

			return {
				id: stringOrFallback(item?.id, `item-${index + 1}`),
				label: stringOrFallback(item?.label, `${text.item} ${index + 1}`),
				categoryId: categoryExists ? categoryId : safeCategories[0].id,
			};
		})
		.filter((item) => item.label);

	return {
		categories: safeCategories,
		items: items.length
			? items
			: [
					{
						id: "item-1",
						label: request.topic || text.item,
						categoryId: safeCategories[0].id,
					},
					{
						id: "item-2",
						label: text.other,
						categoryId: safeCategories[1]?.id ?? safeCategories[0].id,
					},
				],
	};
}

function normalizeChoiceOptions(question, topic, language = "ru") {
	const text = getLanguageConfig(language);
	const options = (Array.isArray(question?.options) ? question.options : [])
		.map((option, index) => ({
			id: stringOrFallback(option?.id, `option-${index + 1}`),
			label: stringOrFallback(option?.label, `${text.variant} ${index + 1}`),
			isCorrect: getGeneratedIsCorrect(option),
		}))
		.filter((option) => option.label);
	const safeOptions = options.length
		? options
		: [
				{ id: "option-1", label: topic || text.answer, isCorrect: true },
				{ id: "option-2", label: text.otherOption, isCorrect: false },
			];

	if (!safeOptions.some((option) => option.isCorrect)) {
		safeOptions[0].isCorrect = true;
	}

	return safeOptions;
}

function normalizeImageOptions(question, topic, language = "ru") {
	const text = getLanguageConfig(language);
	const options = (Array.isArray(question?.options) ? question.options : []).map(
		(option, index) => {
			const label = stringOrFallback(
				option?.label,
				`${text.variant} ${index + 1}`,
			);

			return {
				id: stringOrFallback(option?.id, `image-${index + 1}`),
				label,
				imageSrc: stringOrFallback(
					option?.imageSrc ?? option?.svg,
					createLabelSvg(label, index),
				),
				imageAlt: stringOrFallback(option?.imageAlt, label),
				isCorrect: getGeneratedIsCorrect(option),
			};
		},
	);
	const safeOptions = options.length
		? options
		: [
				{
					id: "image-1",
					label: topic || text.answer,
					imageSrc: createLabelSvg(topic || text.answer, 0),
					imageAlt: topic || text.answer,
					isCorrect: true,
				},
				{
					id: "image-2",
					label: text.otherOption,
					imageSrc: createLabelSvg(text.other, 1),
					imageAlt: text.otherOption,
					isCorrect: false,
				},
			];

	if (!safeOptions.some((option) => option.isCorrect)) {
		safeOptions[0].isCorrect = true;
	}

	return safeOptions;
}

function getGeneratedIsCorrect(option) {
	if (typeof option?.isCorrect === "boolean") return option.isCorrect;
	return option?.isOddOneOut === true;
}

function createLabelSvg(label, index) {
	const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6"];
	const color = colors[index % colors.length];
	const safeLabel = escapeXml(label).slice(0, 18);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="24" fill="${color}"/><circle cx="80" cy="58" r="28" fill="#ffffff" opacity="0.85"/><text x="80" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#111827">${safeLabel}</text></svg>`;
}

function stringOrFallback(value, fallback) {
	if (typeof value !== "string") return fallback;
	const trimmed = value.trim();
	return trimmed || fallback;
}

function escapeXml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}
