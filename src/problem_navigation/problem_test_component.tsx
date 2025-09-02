import { Problem } from "../problem";
import { Editor } from "../editor/editor";
import { useEffect, useState } from "react";
import { CleaningRobotStageManager } from "../toolkits/cleaning/runtime";
import { MessageType } from "../toolkits/chat/runtime";

export default function ProblemTestComponent(props: { problem: Problem, editor: Editor }) {
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        if (currentIndex >= 0 && props.problem.testCases.length > 0) {
            props.editor.reset();
            const testCase = props.problem.testCases[currentIndex];
            window.chatManager?.clear();
            window.chatManager?.addMessage(props.problem.description, MessageType.STATUS);
            if (testCase.input) {
                window.chatManager.addMessage(`<b>Entrada</b>:<br>${testCase.input.replace('\n', '<br>')}`, MessageType.STATUS);
            }
            if (testCase.output) {
                window.chatManager.addMessage(`<b>Saída esperada</b>:<br>${testCase.output.replace('\n', '<br>')}`, MessageType.STATUS);
            }
            if (window.stageManager) {
                window.stageManager = new CleaningRobotStageManager(document.getElementById("stage"), props.problem.testCases[currentIndex]?.data.map);
            }
        }
    }, [currentIndex]);

    const runNextTestCase = () => {
        setCurrentIndex((currentIndex + 1) % totalTestCases());
    }

    const totalTestCases = () => props.problem.testCases?.length ?? 0;

    return (
        totalTestCases() > 0 ?
            <button onClick={runNextTestCase}>Próximo exemplo</button>
            : <></>
    );
}
