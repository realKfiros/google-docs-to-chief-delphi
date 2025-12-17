"use client";

import styled from "styled-components";

export const Page = styled.div`
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
`;
