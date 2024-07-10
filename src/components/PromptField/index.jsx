import clsx from "clsx";
import { MantineProvider, rem } from "@mantine/core";
import { CopyButton, ActionIcon, Tooltip } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";

import $ from "./index.module.css";

const PromptField = ({ placeholder, left, value, onChange, readOnly }) => {
	return (
		<MantineProvider>
			<div className={$.container}>
				<textarea
					className={clsx($.input, left && $.left)}
					name="postContent"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					readOnly={readOnly}
				/>
				{!left && (
					<CopyButton value={value} timeout={2000}>
						{({ copied, copy }) => (
							<Tooltip
								label={copied ? "Copied" : "Copy"}
								withArrow
								position="right"
							>
								<ActionIcon
									color={copied ? "teal" : "gray"}
									variant="subtle"
									onClick={copy}
									className={$.copyButton}
								>
									{copied ? (
										<IconCheck style={{ width: rem(16) }} />
									) : (
										<IconCopy style={{ width: rem(16) }} />
									)}
								</ActionIcon>
							</Tooltip>
						)}
					</CopyButton>
				)}
			</div>
		</MantineProvider>
	);
};

export default PromptField;
