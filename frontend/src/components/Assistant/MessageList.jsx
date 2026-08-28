import { ThreadPrimitive, useAuiState } from "@assistant-ui/react";
import EmptyState from "./EmptyState";
import ChatMessage from "./ChatMessage";

const MessageList = ({ assistantName }) => {
  const isEmpty = useAuiState((state) => state.thread.messages.length === 0);

  return (
    <ThreadPrimitive.Viewport className="aui-viewport">
      {isEmpty ? (
        <EmptyState title={assistantName} />
      ) : (
        <div className="aui-message-list">
          <ThreadPrimitive.Messages>
            {() => <ChatMessage />}
          </ThreadPrimitive.Messages>
        </div>
      )}
    </ThreadPrimitive.Viewport>
  );
};

export default MessageList;
