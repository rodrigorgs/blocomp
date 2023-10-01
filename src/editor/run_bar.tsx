import { useMemo, useState } from "react";
import { Editor, ProgramState, RunMode, RunState } from "./editor";

export default function RunBarComponent(props: { editor: Editor }) {
    const [runMode, setRunMode] = useState(props.editor.runMode);
    const [programState, setProgramState] = useState(props.editor.programState);
    const [runState, setRunState] = useState(props.editor.runState);

    const memoRunMode = useMemo(() => runMode, [runMode]);
    const memoProgramState = useMemo(() => programState, [programState]);
    const memoRunState = useMemo(() => runState, [runState]);
    
    props.editor.addChangeListener(() => {
        setRunMode(props.editor.runMode);
        setProgramState(props.editor.programState);
        setRunState(props.editor.runState);
    });

    const run = () => {
        setRunMode(RunMode.FAST);
        props.editor.runWorkspace(RunMode.SLOW); // TODO: add listener to know when execution stops
    };

    const backToStart = () => {
        props.editor.reset();
    };

    const step = () => {
        setRunMode(RunMode.STEP);
        props.editor.runNextStep();
    };

    console.log(memoRunState, memoProgramState, memoRunMode);
    const canStep = memoRunState == RunState.PAUSED && memoProgramState != ProgramState.FINISHED;
    const canRun = memoProgramState == ProgramState.RESET;
    // memoProgramState == ProgramState.STARTED && (memoRunMode == RunMode.FAST || memoRunMode == RunMode.SLOW)
    // memoProgramState == ProgramState.STARTED
    return (<>
        <button id="btnRodar" onClick={backToStart} disabled={memoProgramState == ProgramState.RESET}>Voltar ao início</button> &nbsp;
        <button id="btnRodar" onClick={run} disabled={!canRun}>Rodar até o fim</button> &nbsp;
        <button id="btnPasso" onClick={step} disabled={!canStep}>Rodar próximo bloco</button>
    </>
    )
}``