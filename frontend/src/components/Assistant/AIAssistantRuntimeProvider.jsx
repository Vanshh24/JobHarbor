import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { n8nModelAdapter } from "./n8nModelAdapter";

const AIAssistantRuntimeProvider = ({ children, sessionId }) => {
  const runtime = useLocalRuntime(n8nModelAdapter(sessionId));

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
};

export default AIAssistantRuntimeProvider;
