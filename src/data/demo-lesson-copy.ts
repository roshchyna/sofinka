import type { Language } from "@/i18n/languages";

export type DemoQuestionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface DemoQuestionCopy {
	title: string;
	hint: string;
	explanation: string;
}

export interface DemoLessonCopy {
	instructions: {
		singleChoice: string;
		multipleChoice: string;
		matching: string;
		ordering: string;
		sorting: string;
		trueFalse: string;
		numberInput: string;
		timeInput: string;
		oddOneOut: string;
	};
	parity: { even: string; odd: string };
	shapes: { triangle: string; square: string; circle: string; cube: string };
	questions: Record<DemoQuestionId, DemoQuestionCopy>;
}

export const demoLessonCopy: Record<Language, DemoLessonCopy> = {
	en: {
		instructions: {
			singleChoice: "Choose one answer.",
			multipleChoice:
				"Choose all the correct expressions. There is more than one.",
			matching:
				"Choose an expression on the left, then its answer on the right.",
			ordering: "Move the numbers into order from smallest to largest.",
			sorting: "Choose the correct group for each number.",
			trueFalse: "Choose True or False.",
			numberInput: "Enter a number.",
			timeInput: "Enter the time using a 24-hour clock, for example 14:30.",
			oddOneOut: "Choose the solid shape.",
		},
		parity: { even: "Even", odd: "Odd" },
		shapes: {
			triangle: "Triangle",
			square: "Square",
			circle: "Circle",
			cube: "Cube",
		},
		questions: {
			1: {
				title: "What is 27 + 15?",
				hint: "First add enough to reach the next multiple of ten. How much is left to add?",
				explanation:
					"Take 3 from 15: 27 + 3 = 30. There are 12 left to add, so 30 + 12 = 42.",
			},
			2: {
				title: "What is 63 − 28?",
				hint: "Subtract 20 first, then subtract another 8.",
				explanation:
					"63 − 20 = 43. Then 43 − 8 = 35. Check it by adding: 35 + 28 = 63.",
			},
			3: {
				title: "Which expressions equal 24?",
				hint: "Work out each expression. Keep looking after you find the first correct one.",
				explanation:
					"18 + 6 = 24, 6 × 4 = 24, and 30 − 6 = 24. The last expression does not fit because 4 × 5 = 20.",
			},
			4: {
				title: "Match each expression to its answer.",
				hint: "Think of multiplication as equal groups. For division, work out how many are in each equal group.",
				explanation:
					"4 groups of 3 make 12. Sharing 20 into 4 equal groups gives 5 in each. 7 groups of 3 make 21. Sharing 18 into 3 equal groups gives 6 in each.",
			},
			5: {
				title:
					"Sofia had 3 boxes with 4 pencils in each. She gave her friends 5 pencils. How many pencils does she have left?",
				hint: "First find how many pencils Sofia had altogether. Then work out how many are left after the gift.",
				explanation:
					"Sofia started with 3 × 4 = 12 pencils. She gave away 5, so 12 − 5 = 7 pencils are left.",
			},
			6: {
				title: "Put the numbers in order from smallest to largest.",
				hint: "Compare the hundreds first. If they match, compare the tens, then the ones.",
				explanation:
					"208, 218, and 280 each have 2 hundreds. Their tens are 0, 1, and 8, in that order. 820 has 8 hundreds, so it comes last: 208, 218, 280, 820.",
			},
			7: {
				title:
					"The numbers increase by the same amount each time: 12, 16, 20, 24, … What comes next?",
				hint: "How much bigger is 16 than 12? Check the same step between the next numbers.",
				explanation:
					"Add 4 each time: 12 + 4 = 16, 16 + 4 = 20, and 20 + 4 = 24. The next number is 24 + 4 = 28.",
			},
			8: {
				title: "Sort the numbers into Even and Odd groups.",
				hint: "An even number can be split into 2 equal whole-number groups. Look at the last digit.",
				explanation:
					"Numbers ending in 0, 2, 4, 6, or 8 are even. So 24, 46, and 58 are even; 17, 31, and 63 are odd.",
			},
			9: {
				title: "Half of 18 is 6. Is this true?",
				hint: "Imagine sharing 18 objects equally between 2 children.",
				explanation:
					"Finding half means dividing by 2. 18 ÷ 2 = 9, and 9 + 9 = 18. So half of 18 is 9, not 6.",
			},
			10: {
				title:
					"A lesson started at 15:20 and lasted 25 minutes. What time did it finish?",
				hint: "Add 25 to the minutes. Will the result be more than 59?",
				explanation:
					"20 + 25 = 45 minutes. That is less than 60, so the hour stays the same. The lesson finished at 15:45.",
			},
			11: {
				title:
					"Three shapes are flat and one is solid. Which is the odd one out for this reason?",
				hint: "Which shape could be a box with length, width, and height?",
				explanation:
					"A cube is a solid shape. A triangle, a square, and a circle are flat shapes.",
			},
			12: {
				title:
					"Mia, Leo, and Sam each have one number card. The cards are 2, 5, and 8. Mia has the largest number. Leo has a smaller number than Sam. What number does Sam have?",
				hint: "Find Mia's card first. Then compare the 2 cards that are left.",
				explanation:
					"Mia has 8, the largest number. That leaves 2 and 5. Leo's number is smaller than Sam's, so Leo has 2 and Sam has 5.",
			},
		},
	},
	ua: {
		instructions: {
			singleChoice: "Обери одну відповідь.",
			multipleChoice:
				"Обери всі відповідні вирази. Правильних відповідей декілька.",
			matching: "Обирай вираз ліворуч і відповідну відповідь праворуч.",
			ordering: "Розташуй числа від найменшого до найбільшого.",
			sorting: "Для кожного числа обери групу.",
			trueFalse: "Обери «Правда» або «Неправда».",
			numberInput: "Введи число.",
			timeInput: "Введи час у 24-годинному форматі, наприклад 14:30.",
			oddOneOut: "Обери об'ємну фігуру.",
		},
		parity: { even: "Парні", odd: "Непарні" },
		shapes: {
			triangle: "Трикутник",
			square: "Квадрат",
			circle: "Круг",
			cube: "Куб",
		},
		questions: {
			1: {
				title: "Скільки буде 27 + 15?",
				hint: "Спочатку доповни 27 до найближчого круглого десятка. Скільки ще залишиться додати?",
				explanation:
					"Із 15 візьмемо 3: 27 + 3 = 30. Залишилося додати 12. Отримуємо 30 + 12 = 42.",
			},
			2: {
				title: "Скільки буде 63 − 28?",
				hint: "Спочатку відніми 20, а потім ще 8.",
				explanation:
					"63 − 20 = 43. Потім 43 − 8 = 35. Перевіримо додаванням: 35 + 28 = 63.",
			},
			3: {
				title: "Які вирази дорівнюють 24?",
				hint: "Обчисли кожен вираз окремо. Не зупиняйся після першого правильного.",
				explanation:
					"18 + 6 = 24, 6 × 4 = 24 і 30 − 6 = 24. Останній вираз не підходить: 4 × 5 = 20.",
			},
			4: {
				title: "З'єднай кожен вираз із його відповіддю.",
				hint: "Множення можна уявити як однакові групи. При діленні подумай, скільки предметів буде в кожній рівній групі.",
				explanation:
					"4 групи по 3 дають 12. Якщо 20 поділити на 4 рівні групи, у кожній буде 5. 7 груп по 3 дають 21. Якщо 18 поділити на 3 рівні групи, у кожній буде 6.",
			},
			5: {
				title:
					"У Софії було 3 коробки, по 4 олівці в кожній. Вона подарувала друзям 5 олівців. Скільки олівців у неї залишилося?",
				hint: "Спочатку дізнайся, скільки олівців було всього. Потім врахуй подарунок друзям.",
				explanation:
					"Спочатку було 3 × 4 = 12 олівців. Софія подарувала 5: 12 − 5 = 7.",
			},
			6: {
				title: "Розташуй числа від найменшого до найбільшого.",
				hint: "Спочатку порівняй сотні. Якщо вони однакові, порівняй десятки, а потім одиниці.",
				explanation:
					"У 208, 218 і 280 по 2 сотні. У них відповідно 0, 1 і 8 десятків. У 820 є 8 сотень, тому це найбільше число. Порядок: 208, 218, 280, 820.",
			},
			7: {
				title:
					"У цьому ряду числа щоразу збільшуються на однакову величину: 12, 16, 20, 24, … Яке число наступне?",
				hint: "На скільки 16 більше за 12? Перевір такий самий крок між наступними числами.",
				explanation:
					"Щоразу додаємо 4: 12 + 4 = 16, 16 + 4 = 20, 20 + 4 = 24. Тому далі 24 + 4 = 28.",
			},
			8: {
				title: "Розподіли числа на парні та непарні.",
				hint: "Парну кількість можна поділити на 2 рівні групи без остачі. Подивись на останню цифру числа.",
				explanation:
					"Числа з останньою цифрою 0, 2, 4, 6 або 8 — парні. Тому 24, 46 і 58 парні, а 17, 31 і 63 непарні.",
			},
			9: {
				title: "Половина від 18 — це 6. Це правда?",
				hint: "Уяви 18 предметів, які потрібно порівну поділити між 2 дітьми.",
				explanation:
					"Знайти половину — означає поділити на 2. 18 ÷ 2 = 9, а 9 + 9 = 18. Отже, половина від 18 — це 9, а не 6.",
			},
			10: {
				title:
					"Заняття почалося о 15:20 і тривало 25 хвилин. О котрій годині воно закінчилося?",
				hint: "Додай 25 до хвилин. Чи буде більше ніж 59?",
				explanation:
					"20 + 25 = 45 хвилин. Це менше ніж 60, тому година залишається тією самою. Заняття закінчилося о 15:45.",
			},
			11: {
				title:
					"Три фігури плоскі, а одна об'ємна. Яка фігура зайва за цією ознакою?",
				hint: "Яку із цих фігур можна уявити як коробку з довжиною, шириною та висотою?",
				explanation:
					"Куб — об'ємна фігура. Трикутник, квадрат і круг — плоскі фігури.",
			},
			12: {
				title:
					"У Мії, Лева та Сема по одній картці з числом. Усього карток три: 2, 5 і 8. У Мії найбільше число. У Лева число менше, ніж у Сема. Яке число в Сема?",
				hint: "Спочатку визнач картку Мії. Потім порівняй 2 картки, що залишилися.",
				explanation:
					"У Мії 8, бо це найбільше число. Залишилися 2 і 5. Число Лева менше за число Сема, отже, у Лева 2, а в Сема 5.",
			},
		},
	},
	ru: {
		instructions: {
			singleChoice: "Выбери один ответ.",
			multipleChoice:
				"Выбери все подходящие выражения. Правильных ответов несколько.",
			matching: "Выбирай выражение слева и подходящий ответ справа.",
			ordering:
				"Перемести числа в порядок от самого маленького к самому большому.",
			sorting: "Для каждого числа выбери группу.",
			trueFalse: "Выбери «Правда» или «Неправда».",
			numberInput: "Введи число.",
			timeInput: "Введи время в 24-часовом формате, например 14:30.",
			oddOneOut: "Выбери объёмную фигуру.",
		},
		parity: { even: "Чётные", odd: "Нечётные" },
		shapes: {
			triangle: "Треугольник",
			square: "Квадрат",
			circle: "Круг",
			cube: "Куб",
		},
		questions: {
			1: {
				title: "Сколько будет 27 + 15?",
				hint: "Сначала дополни 27 до ближайшего круглого десятка. Сколько ещё останется прибавить?",
				explanation:
					"Из 15 возьмём 3: 27 + 3 = 30. Осталось прибавить 12. Получаем 30 + 12 = 42.",
			},
			2: {
				title: "Сколько будет 63 − 28?",
				hint: "Сначала вычти 20, затем ещё 8.",
				explanation:
					"63 − 20 = 43. Затем 43 − 8 = 35. Можно проверить: 35 + 28 = 63.",
			},
			3: {
				title: "Какие выражения равны 24?",
				hint: "Посчитай каждое выражение отдельно. Не останавливайся после первого подходящего.",
				explanation:
					"18 + 6 = 24, 6 × 4 = 24 и 30 − 6 = 24. Последнее выражение не подходит: 4 × 5 = 20.",
			},
			4: {
				title: "Найди ответ для каждого выражения.",
				hint: "Умножение можно представить как одинаковые группы. При делении подумай, сколько предметов попадёт в каждую равную группу.",
				explanation:
					"4 группы по 3 дают 12. Если 20 разделить на 4 равные группы, в каждой будет 5. 7 групп по 3 дают 21. Если 18 разделить на 3 равные группы, в каждой будет 6.",
			},
			5: {
				title:
					"У Софии было 3 коробки, по 4 карандаша в каждой. Она подарила друзьям 5 карандашей. Сколько карандашей у неё осталось?",
				hint: "Сначала узнай, сколько карандашей было всего. Потом учти подарок друзьям.",
				explanation:
					"Сначала было 3 × 4 = 12 карандашей. София подарила 5: 12 − 5 = 7.",
			},
			6: {
				title: "Расположи числа от самого маленького к самому большому.",
				hint: "Сначала сравни сотни. Если сотни одинаковые, сравни десятки, а затем единицы.",
				explanation:
					"У 208, 218 и 280 по 2 сотни. Среди них сначала идут 0 десятков, затем 1 десяток, затем 8 десятков. У 820 восемь сотен. Порядок: 208, 218, 280, 820.",
			},
			7: {
				title:
					"В этом ряду числа каждый раз увеличиваются на одну и ту же величину: 12, 16, 20, 24, … Какое число следующее?",
				hint: "На сколько 16 больше 12? Проверь такой же шаг между следующими числами.",
				explanation:
					"Каждый раз прибавляем 4: 12 + 4 = 16, 16 + 4 = 20, 20 + 4 = 24. Поэтому дальше 24 + 4 = 28.",
			},
			8: {
				title: "Распредели числа в группы «Чётные» и «Нечётные».",
				hint: "Чётное количество можно разделить на 2 равные группы без остатка. Посмотри на последнюю цифру числа.",
				explanation:
					"Числа с последней цифрой 0, 2, 4, 6 или 8 — чётные. Поэтому 24, 46 и 58 чётные, а 17, 31 и 63 нечётные.",
			},
			9: {
				title: "Половина от 18 — это 6. Это верно?",
				hint: "Представь 18 предметов, которые нужно поровну разделить между 2 детьми.",
				explanation:
					"Найти половину — значит разделить на 2. 18 ÷ 2 = 9, а 9 + 9 = 18. Значит, половина от 18 — это 9, а не 6.",
			},
			10: {
				title:
					"Занятие началось в 15:20 и длилось 25 минут. Во сколько оно закончилось?",
				hint: "Прибавь 25 к минутам. Получится ли больше 59 минут?",
				explanation:
					"20 + 25 = 45 минут. Это меньше 60, поэтому час остаётся тем же. Занятие закончилось в 15:45.",
			},
			11: {
				title:
					"Три фигуры плоские, а одна объёмная. Какая фигура лишняя по этому признаку?",
				hint: "Какую из этих фигур можно представить в виде коробки, у которой есть длина, ширина и высота?",
				explanation:
					"Куб — объёмная фигура. Треугольник, квадрат и круг — плоские фигуры.",
			},
			12: {
				title:
					"У Мии, Льва и Сэма по одной карточке с числом. Всего карточки три: 2, 5 и 8. У Мии самое большое число. У Льва число меньше, чем у Сэма. Какое число у Сэма?",
				hint: "Сначала определи карточку Мии. Затем сравни 2 оставшиеся карточки.",
				explanation:
					"У Мии 8, потому что это самое большое число. Остались 2 и 5. Число Льва меньше числа Сэма, значит, у Льва 2, а у Сэма 5.",
			},
		},
	},
};
