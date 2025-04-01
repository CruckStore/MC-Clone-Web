import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'

const Player: React.FC = () => {
  const { camera } = useThree()
  const [canJump, setCanJump] = useState(false)
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false })
  const speed = 5
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 5, 0],
    args: [0.5],
    fixedRotation: true
  }))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyZ':
          keys.current.forward = true
          break
        case 'KeyS':
          keys.current.backward = true
          break
        case 'KeyQ':
          keys.current.left = true
          break
        case 'KeyD':
          keys.current.right = true
          break
        case 'Space':
          keys.current.jump = true
          break
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyZ':
          keys.current.forward = false
          break
        case 'KeyS':
          keys.current.backward = false
          break
        case 'KeyQ':
          keys.current.left = false
          break
        case 'KeyD':
          keys.current.right = false
          break
        case 'Space':
          keys.current.jump = false
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const velocity = useRef<[number, number, number]>([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      velocity.current = v
    })
    return unsubscribe
  }, [api.velocity])

  useFrame((state, delta) => {
    if (ref.current && ref.current.position.y <= 0.51) {
      setCanJump(true)
    }
    const currentVelocity = velocity.current
    const direction = new THREE.Vector3(
      Number(keys.current.right) - Number(keys.current.left),
      0,
      Number(keys.current.backward) - Number(keys.current.forward)
    )
    if (direction.length() > 0) {
      direction.normalize()
      const quaternion = new THREE.Quaternion()
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y)
      direction.applyQuaternion(quaternion)
    }
    api.velocity.set(direction.x * speed, currentVelocity[1], direction.z * speed)
    if (keys.current.jump && canJump) {
      api.velocity.set(currentVelocity[0], 5, currentVelocity[2])
      setCanJump(false)
    }
    if (ref.current) {
      camera.position.copy(ref.current.position)
    }
  })

  return <mesh ref={ref} />
}

export default Player
