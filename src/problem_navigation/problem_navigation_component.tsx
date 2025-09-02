import Swal from "sweetalert2";
import { Problem } from "../problem";

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
    
        window.location.href = `?p=${name.value}`;
    };

    const navigateProblem = (direction: number) => {
        const currentProblemNumber = parseInt(props.problem.id.match(/[0-9]{2}$/)[0]);
        const nextProblemNumber = currentProblemNumber + direction;
        window.location.href = `?p=${props.problem.id.replace(/[0-9]{2}$/, nextProblemNumber.toString().padStart(2, '0'))}`;
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