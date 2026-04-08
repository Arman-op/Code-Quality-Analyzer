import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AsteroidField() {
  const group = useRef();
  
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.001;
      group.current.rotation.x += 0.0005;
    }
  });

  return (
    <group ref={group}>
      {/* Central Planet/Asteroid Void */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]} position={[0, 0, -5]}>
          <MeshDistortMaterial 
            color="#000008" 
            emissive="#BF00FF"
            emissiveIntensity={0.2}
            distort={0.4} 
            speed={2} 
            roughness={0.2}
            wireframe={true}
          />
        </Sphere>
      </Float>

      {/* Orbiting fragments */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={1.5 + Math.random()} rotationIntensity={2} floatIntensity={3}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 15, 
              (Math.random() - 0.5) * 15, 
              (Math.random() - 0.5) * 10 - 5
            ]}
          >
            <icosahedronGeometry args={[Math.random() * 0.3 + 0.1, 0]} />
            <meshStandardMaterial 
              color="#00F5FF" 
              wireframe={Math.random() > 0.5} 
              transparent 
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function StarfieldBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#00F5FF" />
      <directionalLight position={[-10, -10, 5]} intensity={1} color="#FF6B00" />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={1} 
        fade 
        speed={1} 
      />
      <AsteroidField />
    </Canvas>
  );
}
