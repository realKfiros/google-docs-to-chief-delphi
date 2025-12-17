"use client";

import {Button} from "@/lib/styles/Button";
import {useRouter} from "next/navigation";

export const Refresh = () => {
	const router = useRouter();
	return <Button onClick={router.refresh}>Refresh</Button>;
};
