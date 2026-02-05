import { Container } from '@mui/material';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import './App.css';
import Question from './Question';

function App() {
  const [confettiKey, setConfettiKey] = useState(0);
  const [isConfettiRunning, setIsConfettiRunning] = useState(false);
  const { width, height } = useWindowSize();
  const runConfetti = () => {
    setIsConfettiRunning(true);
    setConfettiKey((k) => k + 1); // 🔁 force remount
  };
  return (
    <>
      <Container maxWidth="sm">
        <Confetti
          key={confettiKey}
          width={width}
          height={height}
          run={isConfettiRunning}
          recycle={false}
          numberOfPieces={700}
        />
        <Question onYesClick={runConfetti} />
      </Container>
    </>
  );
}

export default App;
