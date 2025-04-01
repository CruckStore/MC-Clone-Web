import React from 'react'
import { useBox } from '@react-three/cannon'

type BlockProps = {
  position: [number, number, number]
  color: string
}

const Block: React.FC<BlockProps> = ({ position, color }) => {
  const [ref] = useBox(() => ({ type: 'Static', position, args: [1, 1, 1] }))
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default Block
