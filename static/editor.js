let editor;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.38.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: 'print("Hello, Python!")',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true
    });
});

function runCode() {
    const outputElem = document.getElementById('output');
    const runBtn = document.getElementById('run-btn');

    // Disable the Run button while code runs
    runBtn.disabled = true;
    runBtn.style.cursor = 'not-allowed';

    // Show initial running message with animated dots
    let dots = 0;
    outputElem.textContent = 'Running';
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        outputElem.textContent = 'Running' + '.'.repeat(dots);
    }, 500);

    fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editor.getValue() })
    })
        .then(res => res.json())
        .then(data => {
            clearInterval(interval);
            outputElem.textContent = data.output || data.error || "No output.";
        })
        .catch(err => {
            clearInterval(interval);
            outputElem.textContent = "Error: " + err;
        })
        .finally(() => {
            runBtn.disabled = false;
            runBtn.style.cursor = 'pointer';
        });
}