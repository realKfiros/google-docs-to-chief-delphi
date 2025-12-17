"use client";

import styled from "styled-components";

export const Form = styled.form`
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
`;
