import React from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls, Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import Terrain from './components/Terrain'
import Player from './components/Player'

function App() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ fov: 75 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <Sky sunPosition={[100, 20, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Terrain />
        <Player />
      </Physics>
      <PointerLockControls />
    </Canvas>
  )
}

export default App
