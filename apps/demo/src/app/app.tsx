// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import useCopyToClipboard from '../../../../packages/plenty-hooks/src/lib/hooks/useCopyToClipboard/useCopyToClipboard';
import NxWelcome from './nx-welcome';

export function App() {
  const { copiedText, copy } = useCopyToClipboard();
  return (
    <div>
      <button onClick={() => copy('Hello World', (text) => alert(text))}>
        Click me
      </button>
      {copiedText && <p>Copied text: {copiedText}</p>}
      <NxWelcome title="demo" />
    </div>
  );
}

export default App;
