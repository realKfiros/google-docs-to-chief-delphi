"use client";

import {useEffect, useMemo, useState, type FormEvent} from "react";
import {getGoogleDocsId} from "@/lib/validations/google-docs";
import {Button} from "@/lib/styles/Button";
import {Page} from "@/lib/styles/Page";
import {Form} from "@/lib/styles/Form";
import {Instruction} from "@/lib/styles/Instruction";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

const documentGuidelinesLink = "https://ninjas4744.blossom-kc.com/Launcher?assignment=274&anonymous=1";

export default function () {
	const [titleColorsInput, setTitleColorsInput] = useState("#ff0000");
	const [docInput, setDocInput] = useState("");
	const docId = useMemo(() => getGoogleDocsId(docInput), [docInput]);
	const router = useRouter();

	useEffect(() => {
		const colorFromStorage = localStorage.getItem("titleColors");
		if (colorFromStorage) {
			setTitleColorsInput(colorFromStorage);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("titleColors", titleColorsInput);
		Cookies.set('titleColors', titleColorsInput);
	}, [titleColorsInput]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		router.push(`/${docId}`);
	}

	return (
		<Page>
			<h1 className="page-title">Google Docs to Open Alliance Converter</h1>
			<p className="page-description">Write open alliance posts and updates on google docs and convert them to Chief Delphi's markdown</p>
			<Instruction>To get the best results, use these <a href={documentGuidelinesLink} target="_blank">document formatting guidelines</a></Instruction>

			<Form onSubmit={handleSubmit} className="document-form">
				<div className="field">
					<label htmlFor="title-colors-input">Color for titles</label>
					<input
						type="color"
						value={titleColorsInput}
						onChange={(e) => setTitleColorsInput(e.target.value)}
						id="title-colors-input" />
				</div>

				<div className="field">
					<label htmlFor="doc-url-input">Google Docs URL</label>
					<input
						type="text"
						value={docInput}
						onChange={(e) => setDocInput(e.target.value)}
						placeholder="Document URL"
						id="doc-url-input" />
				</div>
				{docId && <Button type="submit">Convert</Button>}
			</Form>
		</Page>
	);
}
