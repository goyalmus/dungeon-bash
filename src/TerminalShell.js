// TerminalShell.js
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalShell = () => {
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const commandBuffer = useRef("");
  // Track the current directory for simulation.
  const currentDir = useRef('/home/student');

  // Simulated file system structure.
  const fileSystem = {
    '/': ['home', 'var', 'bin'],
    '/home': ['student'],
    '/home/student': ['file1.txt', 'file2.txt', 'documents'],
    '/home/student/documents': ['notes.txt', 'resume.docx']
  };

  // Write the prompt (with the current directory) to the terminal.
  const writePrompt = () => {
    termRef.current.write(`\r\n${currentDir.current} $ `);
  };

  // Process the user command and return output.
  const processCommand = (cmd) => {
    const parts = cmd.trim().split(' ').filter(p => p);
    const command = parts[0] || "";
    const args = parts.slice(1);
    let output = "";

    if (command === 'ls') {
      // List contents of the current directory.
      const contents = fileSystem[currentDir.current];
      output = contents ? contents.join('   ') : "No such directory";
    } else if (command === 'cd') {
      if (args.length === 0) {
        output = "cd: missing argument";
      } else {
        const target = args[0];
        if (target === '..') {
          if (currentDir.current === '/') {
            output = "Already at root";
          } else {
            const parts = currentDir.current.split('/');
            parts.pop();
            currentDir.current = parts.join('/') || '/';
          }
        } else {
          let newDir = "";
          if (currentDir.current === '/') {
            newDir = '/' + target;
          } else {
            newDir = currentDir.current + '/' + target;
          }
          if (fileSystem[newDir]) {
            currentDir.current = newDir;
          } else {
            output = `cd: no such file or directory: ${target}`;
          }
        }
      }
    } else if (command === '') {
      output = "";
    } else {
      output = `${command}: command not found`;
    }
    return output;
  };

  useEffect(() => {
    // Initialize the terminal and the fit addon.
    termRef.current = new Terminal({
      cursorBlink: true,
      convertEol: true,
    });
    fitAddonRef.current = new FitAddon();
    termRef.current.loadAddon(fitAddonRef.current);

    // Open the terminal inside the container.
    termRef.current.open(terminalRef.current);
    // Fit the terminal to the container dimensions.
    fitAddonRef.current.fit();

    // Write the initial prompt.
    termRef.current.write(`${currentDir.current} $ `);

    // Listen for user input.
    termRef.current.onData((data) => {
      if (data === '\r') {  // Enter key pressed.
        termRef.current.write('\r\n');
        const output = processCommand(commandBuffer.current);
        if (output) {
          termRef.current.writeln(output);
        }
        commandBuffer.current = "";
        writePrompt();
      } else if (data === '\u007F') {  // Handle Backspace.
        if (commandBuffer.current.length > 0) {
          commandBuffer.current = commandBuffer.current.slice(0, -1);
          termRef.current.write('\b \b');
        }
      } else {
        commandBuffer.current += data;
        termRef.current.write(data);
      }
    });

    // Cleanup when the component unmounts.
    return () => {
      termRef.current.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '300px',
        border: '1px solid #000',
        padding: '5px',
        backgroundColor: '#000',
        color: '#fff',
      }}
    />
  );
};

export default TerminalShell;
