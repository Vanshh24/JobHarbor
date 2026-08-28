import { Tooltip } from "radix-ui";
import PanelHeader from "./PanelHeader";
import MessageList from "./MessageList";
import Composer from "./Composer";

const AssistantPanel = ({ assistantName, onReset, onClose }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <section className="aui-panel">
        <PanelHeader
          title={assistantName}
          onReset={onReset}
          onClose={onClose}
        />
        <MessageList assistantName={assistantName} />
        <Composer />
      </section>
    </Tooltip.Provider>
  );
};

export default AssistantPanel;
