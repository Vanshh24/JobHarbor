import { useCallback, useState } from "react";
import { Popover } from "radix-ui";
import AIAssistantRuntimeProvider from "./AIAssistantRuntimeProvider";
import LauncherButton from "./LauncherButton";
import AssistantPanel from "./AssistantPanel";
import "./aiAssistant.css";

const ASSISTANT_NAME = "JobHarbor AI Assistant";

const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  const closePanel = useCallback(() => setIsOpen(false), []);
  const resetConversation = useCallback(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  return (
    <AIAssistantRuntimeProvider key={sessionId} sessionId={sessionId}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <LauncherButton isOpen={isOpen} />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="aui-popover-content"
            side="top"
            align="end"
            sideOffset={16}
            collisionPadding={16}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              event.currentTarget.querySelector("textarea")?.focus();
            }}
          >
            <AssistantPanel
              assistantName={ASSISTANT_NAME}
              onReset={resetConversation}
              onClose={closePanel}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </AIAssistantRuntimeProvider>
  );
};

export default AIAssistantWidget;
