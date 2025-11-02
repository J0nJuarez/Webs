import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import './app.css'
import Boton from './componentes/boton'
import LiquidEther from './componentes/background/liquidBckg'
import Wrapper from './componentes/wrapper'



const Screen: React.FC = () => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const updateTexture = async () => {
      if (iframeRef.current) {
        try {
          const canvas = await html2canvas(iframeRef.current)
          const newTexture = new THREE.CanvasTexture(canvas)
          setTexture(newTexture)
        } catch (error) {
          console.error('Error creating texture:', error)
        }
      }
    }

    // Actualizar la textura cada segundo
    const interval = setInterval(updateTexture, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <iframe
        ref={iframeRef}
        src="http://httpforever.com/" 
        style={{ 
          position: 'absolute', 
          top: '-9999px', 
          width: '1024px', 
          height: '768px' 
        }}
        title="screen-content"
      />
      <mesh position={[0.4, 0.8, -0.3]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshBasicMaterial>
          {texture && <primitive attach="map" object={texture} />}
        </meshBasicMaterial>
      </mesh>
    </>
  )
}

const Laptop = () => {
  const [model, setModel] = useState<THREE.Group | null>(null)
  
  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load('/model/laptop.glb', (gltf) => {
        const scene = gltf.scene
        scene.scale.set(5, 5, 5)
        scene.position.set(0, 0, 0) 

        // centrar el modelo automáticamente
        const box = new THREE.Box3().setFromObject(scene)
        const center = box.getCenter(new THREE.Vector3())
        scene.position.sub(center)
        
        // Ajusta la posición final después de centrar
        scene.position.add(new THREE.Vector3(0.4, 0.3, -0.5))

        setModel(scene)
    })
  }, [])

  return model ? <primitive object={model} /> : null
}



const App: React.FC = () => {
  return (
    <main className="app-container h-full">

      <div className="grid h-full grid-cols-4 grid-rows-4 gap-4">
        <div id="info" className="col-span-1 row-span-4">
            <Wrapper 
                titulo="MyMonday"
                descripcion="Este es un proyecto de ejemplo utilizando React y Three.js"
                logoUrl="https://mymonday.es/app/themes/Monday/favicon/favicon-32x32.png"
                tecnologias={['React', 'Three.js', 'TypeScript']}
            />
        </div>
        <div id="render" className="col-span-3 row-span-3">
            <LiquidEther
                colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
                mouseForce={20}
                cursorSize={100}
                isViscous={false}
                viscous={30}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.2}
                isBounce={false}
                autoDemo={true}
                autoSpeed={0.5}
                autoIntensity={1.2}
                takeoverDuration={0.25}
                autoResumeDelay={3000}
                autoRampDuration={0.6}
            />
            <Canvas
              camera={{ position: [1, 1, 2], fov: 50 }}
              resize={{ scroll: true }}
              style={{ height: '100dvh', width: '100dvw', position: 'absolute', top: 0, left: 0 }}
            >
              <directionalLight position={[0.9, 4, 0.4]} intensity={5} color="#808080" />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                enableRotate={true} 
                target={[0,0,0]}
                minDistance={2}
                maxDistance={10}
              />
              <Laptop />
              <Screen />
            </Canvas>
        </div>
        <nav className="app-nav col-span-3 row-span-1">
            <Boton logoUrl="https://mymonday.es/app/themes/Monday/favicon/favicon-32x32.png" />
        </nav>
      </div>
    </main>
  )
}

export default App