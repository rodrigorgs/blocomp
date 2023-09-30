import { ChatManager } from "./toolkits/chat/runtime";

declare global {
    interface Window {
        chatManager?: ChatManager;
        stageManager?: any;
        workspaceConfig: {
            problem: {
                name: string;
                description: string;
                testCases: Array<{
                    input: string;
                    output: string;
                }>;
            };
            stage?: {
                type: string;
                data: any;
            };
            toolbox?: {
                blocks: Array<string>;
            };
        }
    }
}
