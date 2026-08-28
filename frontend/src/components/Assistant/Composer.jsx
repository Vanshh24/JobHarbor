import { AuiIf, ComposerPrimitive } from "@assistant-ui/react";
import IconButton from "./IconButton";
import { SendIcon, StopIcon } from "./icons";

const Composer = () => (
  <ComposerPrimitive.Root className="aui-composer">
    <ComposerPrimitive.Input
      placeholder="Message..."
      className="aui-composer-input"
      rows={1}
      enterKeyHint="send"
      aria-label="Message"
    />

    <AuiIf condition={(state) => state.thread.isRunning}>
      <ComposerPrimitive.Cancel asChild>
        <IconButton
          label="Stop generating"
          side="top"
          className="aui-composer-button"
        >
          <StopIcon />
        </IconButton>
      </ComposerPrimitive.Cancel>
    </AuiIf>

    <AuiIf
      condition={(state) => !state.thread.isRunning && !state.composer.isEmpty}
    >
      <ComposerPrimitive.Send asChild>
        <IconButton
          label="Send message"
          side="top"
          className="aui-composer-button aui-composer-button-primary"
        >
          <SendIcon />
        </IconButton>
      </ComposerPrimitive.Send>
    </AuiIf>

    <AuiIf
      condition={(state) => !state.thread.isRunning && state.composer.isEmpty}
    >
      <IconButton
        label="Voice input (coming soon)"
        side="top"
        className="aui-composer-button"
        aria-disabled="true"
      ></IconButton>
    </AuiIf>
  </ComposerPrimitive.Root>
);

export default Composer;
