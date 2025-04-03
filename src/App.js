import logo from './logo.svg';
import './App.css';
import TerminalShell from './TerminalShell';

function App() {
  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Unix Shell Simulator Game</h1>
      <p>This simulated shell teaches basic Unix commands.</p>
      <TerminalShell />
    </div>
  );
}

export default App;
