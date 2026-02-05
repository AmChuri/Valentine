import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import cat from './assets/cat.gif';
import panda from './assets/panda.png';

const MIN_DISTANCE = 60; // how close mouse can get
const MOVE_DISTANCE = 100; // how far button moves
const COOLDOWN_MS = 60; // prevents flicker

interface IQuestion {
  onYesClick?: () => void;
}

const Question = ({ onYesClick }: IQuestion) => {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isYesClicked, setIsYesClicked] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const cardActionsRef = useRef<HTMLDivElement>(null);
  const lastMoveRef = useRef(0);

  const forceMoveButton = (mouseX: number, mouseY: number) => {
    console.log(
      'force move',
      noButtonRef.current,
      noButtonRef.current?.getBoundingClientRect(),
    );
    if (!noButtonRef.current) {
      console.log('no button ref missing');
      return;
    }

    const rect = noButtonRef.current?.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - mouseX || Math.random() - 0.5;
    const dy = centerY - mouseY || Math.random() - 0.5;

    lastMoveRef.current = 0; // bypass cooldown
    console.log('forcing move', dx, dy);
    moveButtonAway(dx, dy);
  };

  const moveButtonAway = (dx: number, dy: number) => {
    if (
      !cardActionsRef.current ||
      !noButtonRef.current ||
      !yesButtonRef.current
    )
      return;

    const containerRect =
      cardActionsRef.current.getBoundingClientRect();
    const noRect = noButtonRef.current.getBoundingClientRect();
    const yesRect = yesButtonRef.current.getBoundingClientRect();

    // Normalize direction
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;

    let nextX = noButtonPos.x + ux * MOVE_DISTANCE;
    let nextY = noButtonPos.y + uy * MOVE_DISTANCE;

    // Clamp to container bounds
    const padding = 16;
    const maxX = containerRect.width - noRect.width - padding;
    const maxY = containerRect.height - noRect.height - padding;

    nextX = Math.max(padding, Math.min(nextX, maxX));
    nextY = Math.max(padding, Math.min(nextY, maxY));

    // ❌ Prevent overlapping YES button
    const futureNoRect = {
      left: containerRect.left + nextX,
      right: containerRect.left + nextX + noRect.width,
      top: containerRect.top + nextY,
      bottom: containerRect.top + nextY + noRect.height,
    };

    const overlap =
      futureNoRect.left < yesRect.right &&
      futureNoRect.right > yesRect.left &&
      futureNoRect.top < yesRect.bottom &&
      futureNoRect.bottom > yesRect.top;

    if (overlap) {
      nextX = -nextX;
      nextY = -nextY;
    }

    setNoButtonPos({ x: nextX, y: nextY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!noButtonRef.current) return;

    const now = Date.now();
    if (now - lastMoveRef.current < COOLDOWN_MS) return;

    const rect = noButtonRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - e.clientX;
    const dy = centerY - e.clientY;

    const distance = Math.hypot(dx, dy);

    if (distance > MIN_DISTANCE && distance > rect.width / 2) return;
    lastMoveRef.current = now;
    moveButtonAway(dx, dy);
  };

  const onClick = () => {
    setIsYesClicked(true);
    if (onYesClick) onYesClick();
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardMedia
        component="img"
        height="300"
        image={panda}
        alt="Panda"
        sx={{ objectFit: 'contain', pt: 2 }}
      />

      <CardContent>
        <Typography
          sx={{
            color: 'red',
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'cursive',
          }}
        >
          Will you be my valentine?
        </Typography>
      </CardContent>
      {!isYesClicked ? (
        <>
          <CardActions
            ref={cardActionsRef}
            onMouseMove={handleMouseMove}
            sx={{
              justifyContent: 'center',
              gap: 3,
              pb: 2,
              position: 'relative',
              minHeight: 90,
              overflow: 'visible',
            }}
          >
            <Button
              ref={yesButtonRef}
              color="success"
              variant="outlined"
              onClick={onClick}
            >
              Yes
            </Button>

            <Button
              ref={noButtonRef}
              color="error"
              variant="outlined"
              onClick={(e) => e.preventDefault()}
              onMouseEnter={(e) =>
                forceMoveButton(e.clientX, e.clientY)
              }
              sx={{
                transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                transition: 'transform 0.15s ease-out',
                cursor: 'not-allowed',
                position: 'relative',
              }}
            >
              No
            </Button>
          </CardActions>
          <Typography
            sx={{
              textAlign: 'center',
              pb: 2,
              fontSize: 12,
              color: 'gray',
            }}
          >
            (Try to click "No" if you can!)
          </Typography>
        </>
      ) : (
        <>
          <CardMedia
            component="img"
            height="300"
            image={cat}
            alt="Cat"
            sx={{ objectFit: 'contain', pt: 2 }}
          />
          <Typography
            sx={{ textAlign: 'center', pb: 2, fontSize: 20 }}
          >
            Yay! 🥳❤️
          </Typography>
          <Typography
            sx={{ textAlign: 'center', pb: 2, fontSize: 16 }}
          >
            Thank you for being my valentine! 😻
          </Typography>
          <CardActions
            sx={{
              justifyContent: 'center',
              gap: 3,
              pb: 2,
              position: 'relative',
              minHeight: 90,
              overflow: 'visible',
            }}
          >
            <Button
              onClick={() => {
                setNoButtonPos({ x: 0, y: 0 });
                setIsYesClicked(false);
              }}
              variant="outlined"
            >
              Try Again
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default Question;
