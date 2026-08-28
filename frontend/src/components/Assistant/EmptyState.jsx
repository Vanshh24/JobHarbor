import { AssistantMarkIcon } from "./icons";

const EmptyState = ({ title }) => (
  <div className="aui-empty-state">
    <div className="aui-empty-avatar">
      <AssistantMarkIcon className="aui-empty-avatar-icon" />
    </div>
    <p className="aui-empty-title">{title}</p>
  </div>
);

export default EmptyState;
