import { forwardRef } from "react";
import { ChatBubbleIcon, ChevronDownIcon } from "./icons";

const LauncherButton = forwardRef(({ isOpen, className = "", ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    className={`aui-launcher ${className}`}
    aria-label={isOpen ? "Minimize assistant" : "Open assistant"}
    {...rest}
  >
    {isOpen ? (
      <ChevronDownIcon className="aui-launcher-icon" />
    ) : (
      <ChatBubbleIcon className="aui-launcher-icon" />
    )}
  </button>
));

LauncherButton.displayName = "LauncherButton";

export default LauncherButton;
