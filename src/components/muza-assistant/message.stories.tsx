import type { Meta, StoryObj } from "@storybook/react-vite";
import { Conversation } from "./conversation";
import {
	Message,
	MessageActions,
	MessageContent,
	MessageCopyAction,
	MessageResponse,
} from "./message";

const reply =
	"**34 = 30 + 4**\n\n- 3 tens\n- 4 ones\n\nTry splitting **52** next.";
const meta = {
	title: "Chat/Messages",
	args: { count: 1 },
	render: ({ count }) => (
		<div className="h-96 max-w-xl">
			<Conversation>
				{Array.from({ length: count }, (_, i) => `exchange-${i}`).map((id) => (
					<div key={id}>
						<Message from="user">
							<MessageContent>How do I split 34?</MessageContent>
						</Message>
						<Message from="assistant">
							<MessageContent>
								<MessageResponse>{reply}</MessageResponse>
								<MessageActions>
									<MessageCopyAction
										content={reply}
										label="Copy answer"
										successMessage="Copied"
									/>
								</MessageActions>
							</MessageContent>
						</Message>
					</div>
				))}
			</Conversation>
		</div>
	),
} satisfies Meta<{ count: number }>;
export default meta;
export const ConversationExample: StoryObj<typeof meta> = {};
export const Scrollable: StoryObj<typeof meta> = { args: { count: 12 } };
