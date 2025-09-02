import Swal from "sweetalert2";
import { Problem } from "../problem";
import { getNextProblemId } from "./problem_controller";

export default function ProblemNavigationComponent(props: { problem: Problem }) {

    const openChallenge = async () => {
        const name = await Swal.fire({
            title: "Digite o código do desafio",
            input: 'text',
            showCancelButton: true,
        });
        if (name.dismiss) {
            return;
        }
    
        window.location.href = `?p=${name.value.toLowerCase()}`;
    };

    const navigateProblem = (direction: number) => {
        window.location.href = `?p=${getNextProblemId(direction)}`;
    }

    let problemNumber: number = null;
    const twoLastDigits = props.problem.id.match(/[0-9]{2}$/);
    if (twoLastDigits) {
        problemNumber = parseInt(twoLastDigits[0]);
    }

    return (<>
        { problemNumber ? <button onClick={() => navigateProblem(-1)} disabled={problemNumber == 1}>&lt; Anterior</button> : <> </> }
        &nbsp;<span><b>Desafio</b>: {props.problem.name} (<code>{ props.problem.id }</code>)</span>&nbsp;
        { problemNumber ? <button onClick={() => navigateProblem(1)}>Próximo &gt;</button> : <></> }
        &nbsp;<button id="btnOpenChallenge" onClick={openChallenge}>Abrir desafio...</button>
    </>);
}