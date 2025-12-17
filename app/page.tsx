"use client";

import {FormEvent, useEffect, useMemo, useState} from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import styled from "styled-components";
import {getGoogleDocsId} from "@/lib/validations/google-docs";
import {Button} from "@/lib/components/Button";

const documentGuidelinesLink = "https://ninjas4744.blossom-kc.com/Launcher?assignment=274&anonymous=1";

const PageContainer = styled.div`
	max-width: calc(100vw - 20px);
	min-width: 0;
	margin: 40px auto;
	padding: 16px;
	position: relative;
	
	> .page-title {
		margin: 0 0 20px 0;
	}
	
	> .page-description {
		margin: 0 0 12px 0;
	}
	
	> .instruction {
		margin: 0 0 24px 0;
		
		a {
			color: #0070f3;
			text-decoration: underline;
		}
	}
	
	> .document-form {
		margin-bottom: 24px;
		
		> .field {
			display: flex;
			margin: 10px;
			align-items: center;

			> label {
				display: block;
				margin-bottom: 8px;
				min-width: 150px;
			}

			> input {
				margin-bottom: 8px;
				border-radius: 4px;
				border: 1px solid #ccc;
				
				&[type="text"] {
					width: 100%;
					padding: 8px;
				}
			}
		}
	}
	
	> .error-message {
		color: #ff0000;
		margin-bottom: 16px;
	}

	> .post {
		position: relative;
		overflow: auto;
		display: flex;

		> .topic-avatar {
			align-self: flex-start;
			position: sticky;
			top: 0;
			flex-shrink: 0;
			margin-right: 12px;
			margin-bottom: 25px;
			width: 50px;
			height: 50px;
			background-color: dodgerblue;
			border-radius: 50%;
			overflow-anchor: none;
		}

		> .topic {
			flex: 1 1 0;
			max-width: calc(690px + 0.75rem * 2);
			min-width: 0;
			position: relative;
			border-top: 1px solid rgb(48.62, 48.62, 48.62);
			padding: 0 0.75rem 0.25rem 0.75rem;

			> * {
				padding-block-start: 1rem;
			}

			> .topic-creator {
				font-weight: bold;
			}

			> .topic-body {
				line-height: 1.5;
			}
		}
	}
`;
export default function Page() {
	const [titleColorsInput, setTitleColorsInput] = useState("#ff0000");
	const [docInput, setDocInput] = useState("");
	const docId = useMemo(() => getGoogleDocsId(docInput), [docInput]);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<{ title: string; text: string } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const colorFromStorage = localStorage.getItem("titleColorsInput");
		if (colorFromStorage) {
			setTitleColorsInput(colorFromStorage);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("titleColorsInput", titleColorsInput);
	}, [titleColorsInput]);

	const handleSubmit = async (e: FormEvent) =>
	{
		e.preventDefault();
		if (!docId) return;

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const res = await fetch(`/api/docs/${encodeURIComponent(docId)}?color=${titleColorsInput.split('#')[1]}`);
			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Unknown error");
			} else {
				setResult(data);
			}
		}
		catch (err) {
			setError("Network error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<PageContainer>
			<h1 className="page-title">Google Docs to Open Alliance Converter</h1>
			<p className="page-description">Write open alliance posts and updates on google docs and convert them to Chief Delphi's markdown</p>
			<p className="instruction">To get the best results, use these <a href={documentGuidelinesLink} target="_blank">document formatting guidelines</a></p>

			<form
				onSubmit={handleSubmit}
				className="document-form">

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

				{docId && <Button
					type="submit"
					disabled={loading || !docInput}>
					{loading ? "Loading..." : "Read Document"}
				</Button>}
			</form>

			{error && (
				<div className="error-message">Error: {error}</div>
			)}

			{result && (
				<div className="post">
					<div className="topic-avatar" />
					<div className="topic">
						<div className="topic-creator">User</div>
						<div className="topic-body">
							<Markdown
								rehypePlugins={[rehypeRaw]}
								components={{
									img: (props) =>
									{
										const size = props.alt?.match(/image\|(\d+)x(\d+)/)  // Regex to look for sizing pattern
										const width = size ? size[1] : "400"
										const height = size ? size[2] : "250"

										return (
											<img
												alt={props.alt}
												src={props.src}
												title={props.title}
												width={width}
												height={height}/>
										);
									}
								}}>
								{result.text}
							</Markdown>
							<Button
								onClick={() => navigator.clipboard.writeText(result?.text)}>
								Copy
							</Button>
						</div>
					</div>
				</div>
			)}
		</PageContainer>
	);
}
