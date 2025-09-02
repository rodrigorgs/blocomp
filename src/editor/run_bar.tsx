import { useMemo, useState } from "react";
import { Editor, ProgramState, RunMode, RunState } from "./editor";

export default function RunBarComponent(props: { editor: Editor }) {
    const [runMode, setRunMode] = useState(props.editor.runMode);
    const [programState, setProgramState] = useState(props.editor.programState);
    const [runState, setRunState] = useState(props.editor.runState);
    const [showLogMessages, setShowLogMessages] = useState(props.editor.showLogMessages);

    const memoRunMode = useMemo(() => runMode, [runMode]);
    const memoProgramState = useMemo(() => programState, [programState]);
    const memoRunState = useMemo(() => runState, [runState]);
    const memoShowLogMessages = useMemo(() => showLogMessages, [showLogMessages]);
    
    props.editor.addChangeListener(() => {
        setRunMode(props.editor.runMode);
        setProgramState(props.editor.programState);
        setRunState(props.editor.runState);
        setShowLogMessages(props.editor.showLogMessages);
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

    const toggleLog = () => {
        props.editor.showLogMessages = !memoShowLogMessages;
    }

    console.log(memoRunState, memoProgramState, memoRunMode);
    const canStep = memoRunState == RunState.PAUSED && memoProgramState != ProgramState.FINISHED;
    const canRun = memoProgramState == ProgramState.RESET;
    // memoProgramState == ProgramState.STARTED && (memoRunMode == RunMode.FAST || memoRunMode == RunMode.SLOW)
    // memoProgramState == ProgramState.STARTED
    
    const buttonStyle = { fontSize: 30 };
    return (<>
        {memoProgramState != ProgramState.RESET && (
            <button style={buttonStyle} id="btnRodar" onClick={backToStart}>↺</button>
        )}
        &nbsp;
        {canRun && (
            <button style={buttonStyle} id="btnRodar" onClick={run}>▶</button>
        )}
        &nbsp;
        {canStep && (
            <button style={buttonStyle} id="btnPasso" onClick={step}>⏯</button>
        )}
        &nbsp;
        {/* <button onClick={toggleLog}>{memoShowLogMessages ? 'Log on' : 'Log off'}</button> */}
    </>
    )
}``