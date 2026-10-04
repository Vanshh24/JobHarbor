import IconButton from "./IconButton";
import { CloseIcon, ResetIcon } from "./icons";

const PanelHeader = ({ title, onReset, onClose }) => (
  <header className="aui-panel-header">
    <h2 className="aui-panel-title">{title}</h2>
    <div className="aui-panel-actions">
      <IconButton label="Start a new conversation" onClick={onReset}>
        <ResetIcon />
      </IconButton>
      <IconButton label="Close assistant" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </div>
  </header>
);

export default PanelHeader;
