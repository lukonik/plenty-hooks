// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useEffect } from 'react';
import NxWelcome from './nx-welcome';

export function App() {
  function handleClick() {
    navigator.clipboard
      .readText()
      .then((text) => {
        console.log('Pasted content: ', text);
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  useEffect(() => {
    window.addEventListener('copy', (e) => {
      console.log('COPIEED!');
    });
  }, []);

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <NxWelcome title="demo" />
    </div>
  );
}

export default App;
