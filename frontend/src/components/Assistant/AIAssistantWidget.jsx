import { useCallback, useState } from "react";
import { Popover } from "radix-ui";
import AIAssistantRuntimeProvider from "./AIAssistantRuntimeProvider";
import LauncherButton from "./LauncherButton";
import AssistantPanel from "./AssistantPanel";
import "./aiAssistant.css";

const ASSISTANT_NAME = "JobHarbor AI Assistant";

/**
 * Floating AI assistant widget: a launcher button fixed to the
 * bottom-right corner that opens a popup chat panel above it.
 *
 * Usage: render <AIAssistantWidget /> once, anywhere inside <App />
 * (it's self-positioning via fixed CSS, so placement in the tree doesn't
 * matter). The actual LLM call lives in
 * ./runtime/n8nModelAdapter.js - that's the only file to edit to connect
 * your n8n workflow.
 *
 * Positioning, focus management, outside-click and Escape-to-close are
 * all handled by Radix's Popover (assistant-ui itself is headless and
 * doesn't ship this kind of anchored-panel chrome).
 */
const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Bumping this remounts AIAssistantRuntimeProvider with a fresh
  // useLocalRuntime call, i.e. it starts a brand-new conversation.
  const [sessionId, setSessionId] = useState(0);

  const closePanel = useCallback(() => setIsOpen(false), []);
  const resetConversation = useCallback(() => setSessionId((id) => id + 1), []);

  return (
    <AIAssistantRuntimeProvider key={sessionId}>
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
