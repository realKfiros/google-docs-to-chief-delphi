import {Button} from "@/lib/styles/Button";
import Cookies from "js-cookie";
import Link from "next/link";

type ExportProps = {
	docId: string;
}

export const Export = ({docId}: ExportProps) => {
	const downloadLink = () => {
		const [, titlesColor] = (Cookies.get('titleColors') ?? '#ff0000').split('#');
		return `/api/docs/${docId}?color=${titlesColor}`;
	}

	return <Button>
		<Link href={downloadLink()}>
			Export
		</Link>
	</Button>;
}
