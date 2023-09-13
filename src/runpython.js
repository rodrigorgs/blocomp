import { loadPyodide } from 'pyodide';

async function pyodideMain() {
    let pyodide = await loadPyodide();
    return pyodide;
}
export const pyodideReadyPromise = pyodideMain();
