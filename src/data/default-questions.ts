import type { Question } from "@/components/questions/question-types";
import { DEFAULT_LANGUAGE, type Language } from "@/i18n/languages";

export const defaultQuestionsByLanguage: Record<Language, Question[]> = {
	en: [
		{
			id: 1,
			type: "single-choice",
			title: "What is 2 + 2?",
			description: "Choose one correct answer from four options.",
			options: [
				{ id: "three", label: "3", isCorrect: false },
				{ id: "four", label: "4", isCorrect: true },
				{ id: "five", label: "5", isCorrect: false },
				{ id: "six", label: "6", isCorrect: false },
			],
		},
		{
			id: 2,
			type: "multiple-choice",
			title: "Which examples give the answer 4?",
			description: "Choose all correct options.",
			options: [
				{ id: "two-plus-two", label: "2 + 2", isCorrect: true },
				{ id: "three-plus-one", label: "3 + 1", isCorrect: true },
				{ id: "five-minus-one", label: "5 - 1", isCorrect: true },
				{ id: "six-minus-one", label: "6 - 1", isCorrect: false },
			],
		},
		{
			id: 3,
			type: "true-false",
			title: "A triangle has three sides.",
			description: "Decide whether this is true or false.",
			answer: true,
		},
		{
			id: 4,
			type: "matching",
			title: "Match the animal with its sound.",
			description:
				"First choose an animal on the left, then a matching sound on the right.",
			pairs: [
				{ id: "cat", left: "Cat", right: "Meow" },
				{ id: "dog", left: "Dog", right: "Woof" },
				{ id: "cow", left: "Cow", right: "Moo" },
				{ id: "duck", left: "Duck", right: "Quack" },
			],
		},
		{
			id: 5,
			type: "ordering",
			title: "Put the parts of the day in order.",
			description: "Start with morning and finish with night.",
			items: [
				{ id: "morning", label: "Morning" },
				{ id: "day", label: "Day" },
				{ id: "evening", label: "Evening" },
				{ id: "night", label: "Night" },
			],
		},
		{
			id: 6,
			type: "sorting",
			title: "Sort the food into groups.",
			description: "Choose an item and place it in the right group.",
			categories: [
				{ id: "fruit", label: "Fruit" },
				{ id: "vegetable", label: "Vegetables" },
			],
			items: [
				{ id: "apple", label: "Apple", categoryId: "fruit" },
				{ id: "banana", label: "Banana", categoryId: "fruit" },
				{ id: "carrot", label: "Carrot", categoryId: "vegetable" },
				{ id: "cucumber", label: "Cucumber", categoryId: "vegetable" },
			],
		},
		{
			id: 7,
			type: "text-input",
			title: "What is a baby cat called?",
			description: "Write the answer in one word.",
			placeholder: "For example: kitten",
			answers: ["kitten"],
		},
		{
			id: 8,
			type: "image-choice",
			title: "Where is the circle?",
			description: "Choose the picture with a circle.",
			options: [
				{
					id: "circle",
					label: "Circle",
					imageSrc: "/quiz/circle.svg",
					imageAlt: "Blue circle",
					isCorrect: true,
				},
				{
					id: "triangle",
					label: "Triangle",
					imageSrc: "/quiz/triangle.svg",
					imageAlt: "Yellow triangle",
					isCorrect: false,
				},
				{
					id: "square",
					label: "Square",
					imageSrc: "/quiz/square.svg",
					imageAlt: "Green square",
					isCorrect: false,
				},
				{
					id: "star",
					label: "Star",
					imageSrc: "/quiz/star.svg",
					imageAlt: "Pink star",
					isCorrect: false,
				},
			],
		},
		{
			id: 9,
			type: "odd-one-out",
			title: "Find the odd one out.",
			description: "Three words are similar, and one does not fit.",
			options: [
				{ id: "apple", label: "Apple", isCorrect: false },
				{ id: "banana", label: "Banana", isCorrect: false },
				{ id: "pear", label: "Pear", isCorrect: false },
				{ id: "car", label: "Car", isCorrect: true },
			],
		},
	],
	ua: [
		{
			id: 1,
			type: "single-choice",
			title: "Скільки буде 2 + 2?",
			description: "Обери одну правильну відповідь із чотирьох варіантів.",
			options: [
				{ id: "three", label: "3", isCorrect: false },
				{ id: "four", label: "4", isCorrect: true },
				{ id: "five", label: "5", isCorrect: false },
				{ id: "six", label: "6", isCorrect: false },
			],
		},
		{
			id: 2,
			type: "multiple-choice",
			title: "Які приклади дають відповідь 4?",
			description: "Обери всі правильні варіанти.",
			options: [
				{ id: "two-plus-two", label: "2 + 2", isCorrect: true },
				{ id: "three-plus-one", label: "3 + 1", isCorrect: true },
				{ id: "five-minus-one", label: "5 - 1", isCorrect: true },
				{ id: "six-minus-one", label: "6 - 1", isCorrect: false },
			],
		},
		{
			id: 3,
			type: "true-false",
			title: "У трикутника три сторони.",
			description: "Визнач, правда це чи неправда.",
			answer: true,
		},
		{
			id: 4,
			type: "matching",
			title: "З'єднай тварину та її звук.",
			description:
				"Спочатку обери тварину ліворуч, потім відповідний звук праворуч.",
			pairs: [
				{ id: "cat", left: "Кішка", right: "Няв" },
				{ id: "dog", left: "Собака", right: "Гав" },
				{ id: "cow", left: "Корова", right: "Му" },
				{ id: "duck", left: "Качка", right: "Кря" },
			],
		},
		{
			id: 5,
			type: "ordering",
			title: "Розстав частини дня по порядку.",
			description: "Почни з ранку та закінчи ніччю.",
			items: [
				{ id: "morning", label: "Ранок" },
				{ id: "day", label: "День" },
				{ id: "evening", label: "Вечір" },
				{ id: "night", label: "Ніч" },
			],
		},
		{
			id: 6,
			type: "sorting",
			title: "Розклади їжу за групами.",
			description: "Обери предмет і поклади його в правильну групу.",
			categories: [
				{ id: "fruit", label: "Фрукти" },
				{ id: "vegetable", label: "Овочі" },
			],
			items: [
				{ id: "apple", label: "Яблуко", categoryId: "fruit" },
				{ id: "banana", label: "Банан", categoryId: "fruit" },
				{ id: "carrot", label: "Морква", categoryId: "vegetable" },
				{ id: "cucumber", label: "Огірок", categoryId: "vegetable" },
			],
		},
		{
			id: 7,
			type: "text-input",
			title: "Як називається дитинча кішки?",
			description: "Напиши відповідь одним словом.",
			placeholder: "Наприклад: кошеня",
			answers: ["кошеня"],
		},
		{
			id: 8,
			type: "image-choice",
			title: "Де коло?",
			description: "Обери картинку з колом.",
			options: [
				{
					id: "circle",
					label: "Коло",
					imageSrc: "/quiz/circle.svg",
					imageAlt: "Синє коло",
					isCorrect: true,
				},
				{
					id: "triangle",
					label: "Трикутник",
					imageSrc: "/quiz/triangle.svg",
					imageAlt: "Жовтий трикутник",
					isCorrect: false,
				},
				{
					id: "square",
					label: "Квадрат",
					imageSrc: "/quiz/square.svg",
					imageAlt: "Зелений квадрат",
					isCorrect: false,
				},
				{
					id: "star",
					label: "Зірка",
					imageSrc: "/quiz/star.svg",
					imageAlt: "Рожева зірка",
					isCorrect: false,
				},
			],
		},
		{
			id: 9,
			type: "odd-one-out",
			title: "Знайди зайве.",
			description: "Три слова схожі, а одне не підходить.",
			options: [
				{ id: "apple", label: "Яблуко", isCorrect: false },
				{ id: "banana", label: "Банан", isCorrect: false },
				{ id: "pear", label: "Груша", isCorrect: false },
				{ id: "car", label: "Машина", isCorrect: true },
			],
		},
	],
	ru: [
		{
			id: 1,
			type: "single-choice",
			title: "Сколько будет 2 + 2?",
			description: "Выбери один правильный ответ из четырёх вариантов.",
			options: [
				{ id: "three", label: "3", isCorrect: false },
				{ id: "four", label: "4", isCorrect: true },
				{ id: "five", label: "5", isCorrect: false },
				{ id: "six", label: "6", isCorrect: false },
			],
		},
		{
			id: 2,
			type: "multiple-choice",
			title: "Какие примеры дают ответ 4?",
			description: "Выбери все правильные варианты.",
			options: [
				{ id: "two-plus-two", label: "2 + 2", isCorrect: true },
				{ id: "three-plus-one", label: "3 + 1", isCorrect: true },
				{ id: "five-minus-one", label: "5 - 1", isCorrect: true },
				{ id: "six-minus-one", label: "6 - 1", isCorrect: false },
			],
		},
		{
			id: 3,
			type: "true-false",
			title: "У треугольника три стороны.",
			description: "Определи, правда это или неправда.",
			answer: true,
		},
		{
			id: 4,
			type: "matching",
			title: "Соедини животное и его звук.",
			description:
				"Сначала выбери животное слева, затем подходящий звук справа.",
			pairs: [
				{ id: "cat", left: "Кошка", right: "Мяу" },
				{ id: "dog", left: "Собака", right: "Гав" },
				{ id: "cow", left: "Корова", right: "Му" },
				{ id: "duck", left: "Утка", right: "Кря" },
			],
		},
		{
			id: 5,
			type: "ordering",
			title: "Расставь части дня по порядку.",
			description: "Начни с утра и закончи ночью.",
			items: [
				{ id: "morning", label: "Утро" },
				{ id: "day", label: "День" },
				{ id: "evening", label: "Вечер" },
				{ id: "night", label: "Ночь" },
			],
		},
		{
			id: 6,
			type: "sorting",
			title: "Разложи еду по группам.",
			description: "Выбери предмет и положи его в правильную группу.",
			categories: [
				{ id: "fruit", label: "Фрукты" },
				{ id: "vegetable", label: "Овощи" },
			],
			items: [
				{ id: "apple", label: "Яблоко", categoryId: "fruit" },
				{ id: "banana", label: "Банан", categoryId: "fruit" },
				{ id: "carrot", label: "Морковь", categoryId: "vegetable" },
				{ id: "cucumber", label: "Огурец", categoryId: "vegetable" },
			],
		},
		{
			id: 7,
			type: "text-input",
			title: "Как называется детёныш кошки?",
			description: "Напиши ответ одним словом.",
			placeholder: "Например: котёнок",
			answers: ["котёнок", "котенок"],
		},
		{
			id: 8,
			type: "image-choice",
			title: "Где круг?",
			description: "Выбери картинку с кругом.",
			options: [
				{
					id: "circle",
					label: "Круг",
					imageSrc: "/quiz/circle.svg",
					imageAlt: "Синий круг",
					isCorrect: true,
				},
				{
					id: "triangle",
					label: "Треугольник",
					imageSrc: "/quiz/triangle.svg",
					imageAlt: "Жёлтый треугольник",
					isCorrect: false,
				},
				{
					id: "square",
					label: "Квадрат",
					imageSrc: "/quiz/square.svg",
					imageAlt: "Зелёный квадрат",
					isCorrect: false,
				},
				{
					id: "star",
					label: "Звезда",
					imageSrc: "/quiz/star.svg",
					imageAlt: "Розовая звезда",
					isCorrect: false,
				},
			],
		},
		{
			id: 9,
			type: "odd-one-out",
			title: "Найди лишнее.",
			description: "Три слова похожи, а одно не подходит.",
			options: [
				{ id: "apple", label: "Яблоко", isCorrect: false },
				{ id: "banana", label: "Банан", isCorrect: false },
				{ id: "pear", label: "Груша", isCorrect: false },
				{ id: "car", label: "Машина", isCorrect: true },
			],
		},
	],
};

export const defaultQuestions = defaultQuestionsByLanguage[DEFAULT_LANGUAGE];

export function getDefaultQuestions(language: Language = DEFAULT_LANGUAGE) {
	return defaultQuestionsByLanguage[language];
}
