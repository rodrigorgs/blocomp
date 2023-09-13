const { loadPyodide } = require('pyodide');

async function pyodideMain() {
    let pyodide = await loadPyodide();
    return pyodide;
}
const pyodideReadyPromise = pyodideMain();

module.exports.pyodideReadyPromise = pyodideMain();