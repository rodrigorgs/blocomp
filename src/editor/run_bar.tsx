import { useState } from "react";
import { Editor, RunMode } from "./editor";

export default function RunBarComponent(props: { editor: Editor }) {
    const [runMode, setRunMode] = useState(RunMode.NOT_RUNNING);

    const run = () => {
        setRunMode(RunMode.FAST);
        props.editor.runWorkspace(RunMode.SLOW); // TODO: add listener to know when execution stops
    }

    const backToStart = () => {
        setRunMode(RunMode.NOT_RUNNING);
        props.editor.stopExecution();
    }

    const step = () => {
        setRunMode(RunMode.STEP);
        props.editor.runNextStep();
    }

    return (<>
        {runMode == RunMode.NOT_RUNNING ?
            <button id="btnRodar" onClick={run}>Rodar até o fim</button> :
            <button id="btnRodar" onClick={backToStart}>Voltar ao início</button>
        }
        {/* <button id="btnParar">Parar</button> */}
        <button id="btnPasso" onClick={step} disabled={runMode == RunMode.FAST || runMode == RunMode.SLOW}>Rodar próximo bloco</button>
    </>
    )
}``