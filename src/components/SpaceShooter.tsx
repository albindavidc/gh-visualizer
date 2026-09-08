import React, { useEffect, useRef } from 'react';
import { THEMES } from '../themes';

interface SpaceShooterProps {
  data: {
    username: string;
    weeks: {
      days: { count: number; level: number }[];
    }[];
  };
  strategy: string;
  theme?: string;
}

const NUM_WEEKS = 52;
const NUM_DAYS = 7;
const SHIP_POSITION_Y = NUM_DAYS + 3;

export function SpaceShooter({ data, strategy, theme = 'github' }: SpaceShooterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentTheme = {
      ...THEMES[theme] || THEMES.github,
      ship: '#c9d1d9',
      bullet: '#f85149',
    };

    // Fixed internal resolution
    const width = 860;
    const height = 230;
    canvas.width = width;
    canvas.height = height;

    const cellSize = 12;
    const padding = 2; // pixel padding between cells
    const cellTotal = cellSize + padding;
    const offsetX = (width - (NUM_WEEKS * cellTotal)) / 2;
    const offsetY = 20;

    let animationFrameId: number;
    let lastTime = 0;

    // Game state
    const enemies = data.weeks.flatMap((week, weekIdx) =>
      week.days.map((day, dayIdx) => ({
        x: weekIdx,
        y: dayIdx,
        level: day.level,
        active: day.level > 0,
      }))
    ).filter(e => e.active);

    const ship = {
      x: 0,
      targetX: 0,
      y: SHIP_POSITION_Y,
      cooldown: 0,
    };

    const bullets: { x: number; y: number }[] = [];
    const explosions: { x: number; y: number; time: number; maxRadius: number; type: 'small' | 'large' }[] = [];
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * (NUM_WEEKS + 4) - 2,
      y: Math.random() * (SHIP_POSITION_Y + 4) - 2,
      brightness: Math.random() * 0.8 + 0.2,
      size: Math.random() > 0.8 ? 2 : 1,
      speed: 1.0 + Math.random() * 1.5,
    }));

    // Generate actions list based on strategy
    let actions: { x: number; shoot: boolean }[] = [];
    
    // Sort enemies based on strategy to determine shooting order
    let targetList = [...enemies];
    if (strategy === 'column') {
      targetList.sort((a, b) => a.x - b.x || a.y - b.y);
    } else if (strategy === 'row') {
      targetList.sort((a, b) => a.y - b.y || a.x - b.x);
    } else { // random
      for (let i = targetList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targetList[i], targetList[j]] = [targetList[j], targetList[i]];
      }
    }

    // Convert target list to actions
    for (const target of targetList) {
      // Need a shot for each health level
      for (let i = 0; i < target.level; i++) {
        actions.push({ x: target.x, shoot: true });
      }
    }

    let actionIndex = 0;
    let gameOver = false;
    let endTimer = 0;

    const loop = (time: number) => {
      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;
      
      // Safety clamp for large deltas (e.g., tab backgrounded)
      const delta = Math.min(dt, 0.1);

      update(delta);
      draw();

      if (!gameOver || endTimer < 3) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    const update = (dt: number) => {
      // Execute actions
      if (actionIndex < actions.length) {
        const action = actions[actionIndex];
        ship.targetX = action.x;

        // Check if ready to execute next action
        const canShoot = ship.cooldown <= 0;
        const reachedTarget = Math.abs(ship.x - ship.targetX) < 0.1;

        if (canShoot && reachedTarget) {
          if (action.shoot) {
            bullets.push({ x: ship.x, y: ship.y });
            ship.cooldown = 0.2; // SHIP_SHOOT_COOLDOWN
          }
          actionIndex++;
        }
      } else {
        gameOver = enemies.length === 0;
        if (gameOver) endTimer += dt;
      }

      // Update Ship
      const SHIP_SPEED = 12.5;
      if (ship.x < ship.targetX) ship.x = Math.min(ship.x + SHIP_SPEED * dt, ship.targetX);
      else if (ship.x > ship.targetX) ship.x = Math.max(ship.x - SHIP_SPEED * dt, ship.targetX);
      if (ship.cooldown > 0) ship.cooldown -= dt;

      // Update Bullets
      const BULLET_SPEED = 7.5;
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= BULLET_SPEED * dt;

        let hit = false;
        // Collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (Math.abs(e.x - b.x) < 0.5 && Math.abs(e.y - b.y) < 0.5) {
            e.level -= 1;
            hit = true;
            if (e.level <= 0) {
              enemies.splice(j, 1);
              explosions.push({ x: e.x, y: e.y, time: 0, maxRadius: 20, type: 'large' });
            } else {
              explosions.push({ x: e.x, y: e.y, time: 0, maxRadius: 10, type: 'small' });
            }
            break; // Bullet consumed
          }
        }

        if (hit || b.y < -2) {
          bullets.splice(i, 1);
        }
      }

      // Update Explosions
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        exp.time += dt;
        const duration = exp.type === 'large' ? 0.4 : 0.12;
        if (exp.time >= duration) {
          explosions.splice(i, 1);
        }
      }

      // Update Stars
      for (const star of stars) {
        star.y += star.speed * dt;
        if (star.y > SHIP_POSITION_Y + 4) {
          star.y = -2;
          star.x = Math.random() * (NUM_WEEKS + 4) - 2;
        }
      }
    };

    const draw = () => {
      // Clear background
      ctx.fillStyle = currentTheme.bg;
      ctx.fillRect(0, 0, width, height);

      // Helper to get pixel coordinates
      const getCoords = (gridX: number, gridY: number) => {
        return {
          x: offsetX + gridX * cellTotal,
          y: offsetY + gridY * cellTotal,
        };
      };

      // Draw Stars
      for (const star of stars) {
        const { x, y } = getCoords(star.x, star.y);
        const brightness = Math.floor(star.brightness * 255);
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 1)`;
        ctx.fillRect(x, y, star.size, star.size);
      }

      // Draw Grid Base (Empty Cells)
      for (let x = 0; x < NUM_WEEKS; x++) {
        for (let y = 0; y < NUM_DAYS; y++) {
          const pos = getCoords(x, y);
          ctx.fillStyle = currentTheme.levels[0];
          ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
        }
      }

      // Draw Enemies
      for (const e of enemies) {
        const pos = getCoords(e.x, e.y);
        ctx.fillStyle = currentTheme.levels[e.level] || currentTheme.levels[4];
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
      }

      // Draw Explosions
      for (const exp of explosions) {
        const pos = getCoords(exp.x, exp.y);
        const center = { x: pos.x + cellSize / 2, y: pos.y + cellSize / 2 };
        const duration = exp.type === 'large' ? 0.4 : 0.12;
        const progress = exp.time / duration;
        const radius = progress * exp.maxRadius;
        const opacity = 1 - progress;
        
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 81, 73, ${opacity})`;
        ctx.fill();
      }

      // Draw Bullets
      ctx.fillStyle = currentTheme.bullet;
      for (const b of bullets) {
        const pos = getCoords(b.x, b.y);
        const center = { x: pos.x + cellSize / 2, y: pos.y + cellSize / 2 };
        
        // Main bullet
        ctx.fillRect(center.x - 1, center.y - 4, 2, 8);
        
        // Trail
        ctx.fillStyle = `rgba(248, 81, 73, 0.5)`;
        ctx.fillRect(center.x - 1, center.y + 6, 2, 4);
        ctx.fillStyle = `rgba(248, 81, 73, 0.2)`;
        ctx.fillRect(center.x - 1, center.y + 12, 2, 3);
        ctx.fillStyle = currentTheme.bullet; // reset for next bullet
      }

      // Draw Ship
      const shipPos = getCoords(ship.x, ship.y);
      const cx = shipPos.x + cellSize / 2;
      const cy = shipPos.y + cellSize / 2;
      
      // Engine Glow / Thruster
      ctx.fillStyle = '#f59e0b'; // amber-500
      ctx.beginPath();
      ctx.moveTo(cx - 3, cy + 6);
      ctx.lineTo(cx + 3, cy + 6);
      ctx.lineTo(cx, cy + 12 + Math.random() * 6); // flickering engine trail
      ctx.fill();

      // Main Hull
      ctx.fillStyle = '#e2e8f0'; // slate-200
      ctx.beginPath();
      ctx.moveTo(cx, cy - 10); // Nose
      ctx.lineTo(cx + 8, cy + 6); // Right wing tip
      ctx.lineTo(cx + 4, cy + 4); // Right inner
      ctx.lineTo(cx, cy + 8); // Bottom center
      ctx.lineTo(cx - 4, cy + 4); // Left inner
      ctx.lineTo(cx - 8, cy + 6); // Left wing tip
      ctx.closePath();
      ctx.fill();

      // Cockpit Window
      ctx.fillStyle = '#38bdf8'; // sky-400
      ctx.beginPath();
      ctx.moveTo(cx, cy - 2);
      ctx.lineTo(cx + 2, cy + 3);
      ctx.lineTo(cx - 2, cy + 3);
      ctx.closePath();
      ctx.fill();

      // Wing Accents
      ctx.fillStyle = '#ef4444'; // red-500
      ctx.beginPath();
      ctx.moveTo(cx - 7, cy + 5);
      ctx.lineTo(cx - 5, cy + 1);
      ctx.lineTo(cx - 4, cy + 4);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(cx + 7, cy + 5);
      ctx.lineTo(cx + 5, cy + 1);
      ctx.lineTo(cx + 4, cy + 4);
      ctx.fill();
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [data, strategy]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
