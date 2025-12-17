import {getDocumentMarkdown} from "@/lib/md";
import {cookies} from "next/headers";
import {Page} from "@/lib/styles/Page";
import {Post} from "@/lib/styles/Post";
import {MD} from "@/lib/components/MD";
import {Refresh} from "@/lib/components/buttons/Refresh";
import {Copy} from "@/lib/components/buttons/Copy";
import {ButtonGroup} from "@/lib/styles/ButtonGroup";
import {Export} from "@/lib/components/buttons/Export";

type Params = {
	params: Promise<{id: string;}>;
}

export default async function ({params}: Params) {
	const {id} = await params;

	const cookieStore = await cookies();
	const titlesColor = cookieStore.get('titleColors')?.value ?? '#2163af';

	const markdown = await getDocumentMarkdown(id, titlesColor);

	return (
		<Page>
			<h1 className="page-title">{markdown.title}</h1>
			<ButtonGroup>
				<Refresh />
				<Export docId={id} />
				<Copy text={markdown.text} />
			</ButtonGroup>
			<Post>
				<div className="topic">
					<div className="topic-body">
						<MD text={markdown.text} />
					</div>
				</div>
			</Post>
		</Page>
	)
}
