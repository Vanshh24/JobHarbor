import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { n8nModelAdapter } from "./n8nModelAdapter";

const AIAssistantRuntimeProvider = ({ children }) => {
  const runtime = useLocalRuntime(n8nModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
};

export default AIAssistantRuntimeProvider;
