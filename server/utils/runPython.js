
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const ANALYTICS_DIR = path.join(__dirname, '..', '..', 'analytics');

const PYTHON_PATH = path.join(ANALYTICS_DIR, 'venv', 'bin', 'python3');


export function runPython(scriptName, args = []) {
  return new Promise((resolve, reject) => {

    const scriptPath = path.join(ANALYTICS_DIR, scriptName);

    const py = spawn(PYTHON_PATH, [scriptPath, ...args]);

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', chunk => {
      output += chunk.toString();
    });

    py.stderr.on('data', chunk => {
      errorOutput += chunk.toString();
    });

    py.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`Python error: ${errorOutput}`));
      }

      try {
        const jsonStart = output.indexOf('{');
        const jsonStr   = output.slice(jsonStart);
        const parsed    = JSON.parse(jsonStr);
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${output}`));
      }
    });

    py.on('error', err => {
      reject(new Error(`Failed to start Python: ${err.message}`));
    });

  });
}