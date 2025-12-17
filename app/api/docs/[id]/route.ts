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
		const res = await getDocumentMarkdown(id, '#' + (searchParams.get('color') ?? 'ffffff'), true);
		const zip = await res.file.generateAsync({type: 'nodebuffer'});
		if (zip) {
			return new NextResponse(new Uint8Array(zip), {
				status: 200,
				headers: new Headers({
					'Content-Type': 'application/zip',
					'Content-Disposition': `attachment; filename="${res.title || 'document'}.zip"`,
				}),
			});
		}
		return NextResponse.json(res);
	} catch (err) {
		console.error("Error reading doc:", err);
		return NextResponse.json(
			{ error: "Failed to read document" },
			{ status: 500 }
		);
	}
}
