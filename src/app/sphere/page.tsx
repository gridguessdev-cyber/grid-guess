"use client";
import { useRef } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const scene = new THREE.Scene();
  //     const camera = new THREE.PerspectiveCamera(
  //       75,
  //       window.innerWidth / window.innerHeight,
  //       0.1,
  //       10
  //     );
  //     const renderer = new THREE.WebGLRenderer();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //     containerRef.current?.appendChild(renderer.domElement);
  //     camera.position.z = 2;

  //     const controls = new OrbitControls(camera, renderer.domElement);

  //     const lineMaterial = new THREE.LineBasicMaterial({
  //       color: 0xff0000,
  //       linewidth: 2,
  //     }); // Red line

  //     const geo = new THREE.SphereGeometry();
  //     const mat = new THREE.MeshStandardMaterial({
  //       color: "white",
  //       flatShading: true,
  //     });
  //     const mesh = new THREE.Mesh(geo, mat);
  //     scene.add(mesh);

  //     const wireMat = new THREE.MeshBasicMaterial({
  //       color: "white",
  //       wireframe: true,
  //     });
  //     const wireMesh = new THREE.Mesh(geo, wireMat);
  //     wireMesh.scale.setScalar(1.001);
  //     mesh.add(wireMesh);

  //     const hemiLight = new THREE.HemisphereLight("white", "black");
  //     scene.add(hemiLight);

  //     function animate(t = 0) {
  //       requestAnimationFrame(animate);
  //       renderer.render(scene, camera);
  //       controls.update();
  //     }

  //     animate();
  //   }
  // }, []);

  return <div ref={containerRef} />;
}
