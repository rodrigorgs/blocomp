import { Problem } from "./problem";
import { ChatManager } from "./toolkits/chat/runtime";

declare global {
    interface Window {
        chatManager?: ChatManager;
        stageManager?: StageManager;
        workspaceConfig: {
            problem: Problem;
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
