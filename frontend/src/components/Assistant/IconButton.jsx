import { forwardRef } from "react";
import { Tooltip } from "radix-ui";

const IconButton = forwardRef(
  ({ label, children, className = "", side = "top", ...rest }, ref) => (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          className={`aui-icon-button ${className}`}
          {...rest}
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="aui-tooltip" side={side} sideOffset={6}>
          {label}
          <Tooltip.Arrow className="aui-tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  ),
);

IconButton.displayName = "IconButton";

export default IconButton;
