"use client";

import styled from "styled-components";

export const Post = styled.div`
	position: relative;
	overflow: auto;
	display: flex;

	> .topic {
		flex: 1 1 0;
		max-width: calc(690px + 0.75rem * 2);
		min-width: 0;
		position: relative;
		padding: 0 0.75rem 0.25rem 0.75rem;

		> .topic-body {
			padding-block-start: 1rem;
			line-height: 1.5;
		}
	}
`;
