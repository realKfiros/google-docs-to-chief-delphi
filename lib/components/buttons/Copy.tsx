"use client";

import {Button} from "@/lib/styles/Button";
import {useState} from "react";

type CopyProps = {
	text: string;
}

export const Copy = ({text}: CopyProps) => {
	const [copySuccess, setCopySuccess] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(text).then(() => {
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		});
	}

	return (
		<Button
			onClick={handleCopy}>
			{copySuccess ? 'Post copied to clipboard!' : 'Copy post'}
		</Button>
	);
}
