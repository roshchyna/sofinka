import { getLanguageConfig } from "./languages.mjs";

export function buildPrompt({ age, count, language, topic, type }) {
	const text = getLanguageConfig(language);
	const answerOptionsSchema = (questionType) => `{
  "questions": [
    {
      "id": 1,
      "type": "${questionType}",
      "title": "${text.question}",
      "description": "${text.shortHint}",
      "options": [
        { "id": "option-1", "label": "${text.answer}", "isCorrect": true },
        { "id": "option-2", "label": "${text.answer}", "isCorrect": false },
        { "id": "option-3", "label": "${text.answer}", "isCorrect": false },
        { "id": "option-4", "label": "${text.answer}", "isCorrect": false }
      ]
    }
  ]
}`;
	const schemas = {
		"single-choice": answerOptionsSchema("single-choice"),
		"multiple-choice": answerOptionsSchema("multiple-choice"),
		"odd-one-out": answerOptionsSchema("odd-one-out"),
		"image-choice": `{
  "questions": [
    {
      "id": 1,
      "type": "image-choice",
      "title": "${text.question}",
      "description": "${text.shortHint}",
      "options": [
        {
          "id": "image-1",
          "label": "${text.answer}",
          "imageSrc": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 160 160\\"><circle cx=\\"80\\" cy=\\"80\\" r=\\"52\\" fill=\\"#60a5fa\\"/></svg>",
          "imageAlt": "${text.imageDescription}",
          "isCorrect": true
        },
        {
          "id": "image-2",
          "label": "${text.answer}",
          "imageSrc": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 160 160\\"><rect x=\\"36\\" y=\\"36\\" width=\\"88\\" height=\\"88\\" fill=\\"#34d399\\"/></svg>",
          "imageAlt": "${text.imageDescription}",
          "isCorrect": false
        }
      ]
    }
  ]
}`,
		matching: `{
  "questions": [
    {
      "id": 1,
      "type": "matching",
      "title": "${text.question}",
      "description": "${text.shortHint}",
      "pairs": [
        { "id": "pair-1", "left": "${text.concept}", "right": "${text.description}" },
        { "id": "pair-2", "left": "${text.topic}", "right": "${text.mainTopic}" },
        { "id": "pair-3", "left": "${text.item}", "right": "${text.group}" }
      ]
    }
  ]
}`,
		sorting: `{
  "questions": [
    {
      "id": 1,
      "type": "sorting",
      "title": "${text.sortingTitle}",
      "description": "${text.sortingDescription}",
      "categories": [
        { "id": "category-1", "label": "${text.group} 1" },
        { "id": "category-2", "label": "${text.group} 2" }
      ],
      "items": [
        { "id": "item-1", "label": "${text.item} 1", "categoryId": "category-1" },
        { "id": "item-2", "label": "${text.item} 2", "categoryId": "category-2" },
        { "id": "item-3", "label": "${text.item} 3", "categoryId": "category-1" },
        { "id": "item-4", "label": "${text.item} 4", "categoryId": "category-2" }
      ]
    }
  ]
}`,
		"true-false": `{
  "questions": [
    {
      "id": 1,
      "type": "true-false",
      "title": "${text.question}",
      "description": "${text.shortHint}",
      "options": [
        { "id": "option-1", "label": "${text.trueLabel}", "isCorrect": true },
        { "id": "option-2", "label": "${text.falseLabel}", "isCorrect": false }
      ]
    }
  ]
}`,
		"text-input": `{
  "questions": [
    {
      "id": 1,
      "type": "text-input",
      "title": "${text.question}",
      "description": "${text.shortHint}",
      "placeholder": "${text.answer}",
      "answers": ["${text.answer}"]
    }
  ]
}`,
		default: answerOptionsSchema("single-choice"),
	};
	const schema = schemas[type] ?? schemas.default;

	return `Generate ${count} questions for a ${age}-year-old child about "${topic}".
Output language: ${text.name}. All user-visible text fields must be in ${text.name}.
Question type: "${type}".

Return the type field strictly equal to "${type}" for every question.

If the type is "image-choice", make 2-4 answer options. Return imageSrc for each option. imageSrc can be a full inline SVG string that starts with <svg and contains xmlns, viewBox, and simple shapes or textures. Do not return empty strings, markdown, HTML pages, external image links, or type "single-choice".

If the type is "sorting", return categories and items. Each item must have id, label, and categoryId that matches one of the categories.

If the type is "text-input", return answers as a non-empty array of accepted correct answers. Do not return options for "text-input".

For answer-option question types, the app checks correctness only by the boolean option field "isCorrect". Do not use label text to mark answers.

Return JSON strictly in this format:
${schema}`;
}
