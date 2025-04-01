import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky } from '@react-three/drei';
import * as THREE from 'three';

type BlockProps = {
  position: [number, number, number];
  color?: string;
};

function Block({ position, color = 'green' }: BlockProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Terrain() {
  const blocks = [];
  const terrainSize = 20;
  const halfSize = terrainSize / 2;

  for (let x = -halfSize; x < halfSize; x++) {
    for (let z = -halfSize; z < halfSize; z++) {
      const height = Math.floor((Math.sin(x / 3) + Math.cos(z / 3)) * 1.5) + 3;
      for (let y = 0; y < height; y++) {
        const blockColor = y === height - 1 ? 'lightgreen' : 'brown';
        blocks.push(
          <Block key={`${x}-${z}-${y}`} position={[x, y, z]} color={blockColor} />
        );
      }
    }
  }
  return <>{blocks}</>;
}

function PlayerControls() {
  const { camera } = useThree();
  const move = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const speed = 5;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          move.current.forward = true;
          break;
        case 'KeyS':
          move.current.backward = true;
          break;
        case 'KeyA':
          move.current.left = true;
          break;
        case 'KeyD':
          move.current.right = true;
          break;
        default:
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          move.current.forward = false;
          break;
        case 'KeyS':
          move.current.backward = false;
          break;
        case 'KeyA':
          move.current.left = false;
          break;
        case 'KeyD':
          move.current.right = false;
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    const direction = new THREE.Vector3();
    if (move.current.forward) direction.add(forward);
    if (move.current.backward) direction.sub(forward);
    if (move.current.right) direction.add(right);
    if (move.current.left) direction.sub(right);

    if (direction.length() > 0) {
      direction.normalize();
      camera.position.addScaledVector(direction, speed * delta);
    }
  });

  return null;
}

function App() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />

      <Sky sunPosition={[100, 20, 100]} />

      <Terrain />

      <PlayerControls />

      <PointerLockControls />
    </Canvas>
  );
}

export default App;
