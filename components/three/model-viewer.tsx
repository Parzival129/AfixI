"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Grid,
  Center,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

function ModelMesh({ url }: { url: string }) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    let cancelled = false;

    loader.load(
      url,
      (gltf) => {
        if (!cancelled) setScene(gltf.scene);
      },
      undefined,
      (err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load model");
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (error) throw new Error(error);
  if (!scene) return <LoadingFallback />;

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function STLMesh({ url }: { url: string }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = new STLLoader();
    let cancelled = false;

    loader.load(
      url,
      (geo) => {
        if (!cancelled) setGeometry(geo);
      },
      undefined,
      (err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load model");
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (error) throw new Error(error);
  if (!geometry) return <LoadingFallback />;

  return (
    <Center>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#888" />
      </mesh>
    </Center>
  );
}

function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#22c55e" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

class ViewerErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(err: Error) {
    return { error: err.message };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-destructive">
          <p className="font-medium">Failed to load 3D model</p>
          <p className="text-xs text-muted-foreground">{this.state.error}</p>
          <button
            className="mt-2 text-sm underline text-foreground"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ModelViewerProps {
  fileBlob: Blob;
  fileType: "glb" | "stl";
}

export function ModelViewer({ fileBlob, fileType }: ModelViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(fileBlob);
    setBlobUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [fileBlob, fileType]);

  if (!blobUrl) {
    return null;
  }

  return (
    <ViewerErrorBoundary>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        className="touch-none"
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {fileType === "stl" ? <STLMesh url={blobUrl} /> : <ModelMesh url={blobUrl} />}
        <OrbitControls
          makeDefault
          enablePan
          enableZoom
          enableRotate
          minDistance={0.5}
          maxDistance={50}
        />
        <Grid
          infiniteGrid
          cellSize={0.1}
          sectionSize={1}
          fadeDistance={10}
          cellColor="#1a3a2a"
          sectionColor="#22c55e"
          cellThickness={0.5}
          sectionThickness={1}
        />
        <Environment preset="studio" />
      </Canvas>
    </ViewerErrorBoundary>
  );
}
