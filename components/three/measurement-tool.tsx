"use client";

import { useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface MeasurementPoint {
  position: [number, number, number];
}

interface MeasurementLine {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  distance: number;
}

interface MeasurementToolProps {
  active: boolean;
  onMeasurement?: (start: [number, number, number], end: [number, number, number], distance: number) => void;
}

function ClickHandler({
  active,
  onMeasurement,
}: MeasurementToolProps) {
  const { camera, scene, gl } = useThree();
  const [firstPoint, setFirstPoint] = useState<MeasurementPoint | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementLine[]>([]);
  const raycaster = new THREE.Raycaster();

  const handleClick = (e: THREE.Event) => {
    if (!active) return;

    const rect = gl.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2();
    const event = e as unknown as { clientX: number; clientY: number };
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const hit = intersects.find(
      (i) => i.object.type === "Mesh" || i.object.type === "Group"
    );
    if (!hit) return;

    const pos: [number, number, number] = [
      hit.point.x,
      hit.point.y,
      hit.point.z,
    ];

    if (!firstPoint) {
      setFirstPoint({ position: pos });
    } else {
      const dist = new THREE.Vector3(...firstPoint.position).distanceTo(
        new THREE.Vector3(...pos)
      );
      const distMm = Math.round(dist * 1000 * 100) / 100;
      const id = `m-${Date.now()}`;
      setMeasurements((prev) => [
        ...prev,
        { id, start: firstPoint.position, end: pos, distance: distMm },
      ]);
      onMeasurement?.(firstPoint.position, pos, distMm);
      setFirstPoint(null);
    }
  };

  return (
    <group onClick={handleClick as unknown as React.EventHandler<React.SyntheticEvent>}>
      {/* Invisible plane to catch clicks */}
      {active && (
        <mesh visible={false}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial />
        </mesh>
      )}

      {/* First point indicator */}
      {firstPoint && (
        <mesh position={firstPoint.position}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Measurement lines */}
      {measurements.map((m) => (
        <group key={m.id}>
          <Line
            points={[m.start, m.end]}
            color="#22c55e"
            lineWidth={2}
          />
          <mesh position={m.start}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={m.end}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <Html
            position={[
              (m.start[0] + m.end[0]) / 2,
              (m.start[1] + m.end[1]) / 2 + 0.05,
              (m.start[2] + m.end[2]) / 2,
            ]}
            center
            className="pointer-events-none"
          >
            <div className="bg-background/90 text-foreground text-xs px-2 py-0.5 rounded border border-primary/50 whitespace-nowrap">
              {m.distance} mm
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

export { ClickHandler as MeasurementTool };
