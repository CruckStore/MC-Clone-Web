import React from 'react'
import Block from './Block'

const Terrain: React.FC = () => {
  const blocks = []
  const terrainSize = 20
  const halfSize = terrainSize / 2
  for (let x = -halfSize; x < halfSize; x++) {
    for (let z = -halfSize; z < halfSize; z++) {
      const height = Math.floor((Math.sin(x / 3) + Math.cos(z / 3)) * 1.5) + 3
      for (let y = 0; y < height; y++) {
        const blockColor = y === height - 1 ? 'lightgreen' : 'brown'
        blocks.push(<Block key={`${x}-${z}-${y}`} position={[x, y, z]} color={blockColor} />)
      }
    }
  }
  return <>{blocks}</>
}

export default Terrain
