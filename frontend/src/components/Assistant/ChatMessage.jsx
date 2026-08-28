import { MessagePrimitive, useAuiState } from "@assistant-ui/react";
import { AssistantMarkIcon } from "./icons";

const ChatMessage = () => {
  const role = useAuiState((state) => state.message.role);
  const isUser = role === "user";

  return (
    <MessagePrimitive.Root
      className={`aui-message-row ${
        isUser ? "aui-message-row-user" : "aui-message-row-assistant"
      }`}
    >
      {!isUser && (
        <div className="aui-message-avatar" aria-hidden="true">
          <AssistantMarkIcon />
        </div>
      )}
      <div
        className={`aui-message-bubble ${
          isUser ? "aui-message-bubble-user" : "aui-message-bubble-assistant"
        }`}
      >
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
};

export default ChatMessage;
