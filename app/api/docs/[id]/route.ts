import {NextResponse} from "next/server";
import {getDocumentMarkdown} from "@/lib/md";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(req: Request, {params}: Params) {
	const {id} = await params;
	const {searchParams} = new URL(req.url);

	if (!id) {
		return NextResponse.json({error: "Missing document id"}, {status: 400});
	}

	try {
		const doc = await getDocumentMarkdown(id, '#' + (searchParams.get('color') ?? 'ffffff'));
		return NextResponse.json(doc);
	} catch (err) {
		console.error("Error reading doc:", err);
		return NextResponse.json(
			{ error: "Failed to read document" },
			{ status: 500 }
		);
	}
}
