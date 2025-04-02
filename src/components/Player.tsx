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
    fixedRotation: true,
    linearDamping: 0.8
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

  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe(v => {
      velocity.current = v
    })
    return unsubscribe
  }, [api.velocity])

  useFrame((state, delta) => {
    if (ref.current && ref.current.position.y <= 0.6) {
      setCanJump(true)
    }
    const currentVelocity = velocity.current
    const frontVector = new THREE.Vector3(0, 0, -1)
    const sideVector = new THREE.Vector3(-1, 0, 0)
    frontVector.applyQuaternion(camera.quaternion)
    sideVector.applyQuaternion(camera.quaternion)
    frontVector.y = 0
    sideVector.y = 0
    frontVector.normalize()
    sideVector.normalize()
    const direction = new THREE.Vector3()
    if (keys.current.forward) direction.add(frontVector)
    if (keys.current.backward) direction.sub(frontVector)
    if (keys.current.left) direction.add(sideVector)
    if (keys.current.right) direction.sub(sideVector)
    if (direction.length() > 0) direction.normalize()
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
