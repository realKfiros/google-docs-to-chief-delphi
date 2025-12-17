import {getGoogleDocs} from "@/lib/docs";
import {center, coloredTitleText, embed, wrapText} from "@/lib/md/text_nodes";
import {getYouTubeId} from "@/lib/validations/youtube";

const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";

export async function getDocumentMarkdown(documentId: string, color: string = '#2163af', exportOutput: boolean = false): Promise<{ title: string, text: string }> {
	try {
		const docs = getGoogleDocs();
		const res = await docs.documents.get({ documentId });

		const document = res.data;
		const body = document.body?.content ?? [];
		const inlineObjects = (document.inlineObjects ?? {}) as Record<string, any>;

		let isCodeBlock = false;
		const text = body.map((structuralElement) => {
			const paragraph = structuralElement.paragraph;
			if (!paragraph) {
				return "\n";
			}

			const elements = paragraph.elements ?? [];

			const images: {
				objectId: string;
				width: number;
				height: number;
			}[] = [];

			for (const el of elements) {
				if (el.inlineObjectElement) {
					const objectId = el.inlineObjectElement.inlineObjectId!;
					const inlineObj = inlineObjects[objectId];
					const embedded = inlineObj?.inlineObjectProperties?.embeddedObject;
					const img = embedded?.imageProperties;

					if (img) {
						images.push({
							objectId,
							width: parseInt(embedded.size?.width?.magnitude ?? 300),
							height: parseInt(embedded.size?.height?.magnitude ?? 300)
						});
					}
				}
			}

			if (images.length > 0) {
				return center(images.map((img) => {
					const url = `${APP_BASE_URL}/api/docs/${documentId}/images/${img.objectId}`;
					return `![image|${img.width}x${img.height}, 100%](${url})`;
				}).join(" "));
			}

			const { paragraphStyle } = paragraph || {};
			const [paragraphType, paragraphTypeNum] = (paragraphStyle?.namedStyleType || "").split("_");

			let paragraphText = elements.map((el) => {
				let text = el.textRun?.content ?? "";
				if (paragraphType === 'NORMAL' && text.trim())
				{
					const youtubeVideoId = getYouTubeId(text.trim());
					if (youtubeVideoId) {
						if (exportOutput)
							text = center(`https://www.youtube.com/watch?v=${youtubeVideoId}`);
						else
							text = embed(`https://www.youtube.com/embed/${youtubeVideoId}`);
					} else {
						if (el.textRun?.textStyle?.bold)
							text = wrapText('**', text);
						else if (el.textRun?.textStyle?.italic)
							text = wrapText('*', text);
						else if (el.textRun?.textStyle?.strikethrough)
							text = wrapText('~~', text);
					}
				}
				return text;
			}).join("");

			if (paragraphText.startsWith('```')) {
				isCodeBlock = !isCodeBlock;
			}

			if (isCodeBlock) {
				return paragraphText;
			}

			if (paragraphType === "HEADING") {
				const level = parseInt(paragraphTypeNum);
				paragraphText = `${"#".repeat(level)} ${coloredTitleText(paragraphText, color)}`;
			}

			if (paragraph.bullet) {
				paragraphText = "* " + paragraphText;
			}

			return paragraphText + "\n";
		}).join("");

		return {
			title: document.title ?? "",
			text,
		};
	} catch (e) {
		return {
			title: 'Error reading document',
			text: e instanceof Error ? e.message : 'Unknown error',
		}
	}
}
