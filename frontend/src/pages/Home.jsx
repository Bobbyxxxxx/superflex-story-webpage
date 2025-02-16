import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import Loader from "../components/Loader";
import Dog from "../models/Dog";
import OldMan from "../models/OldMan";

// To Do:
//  Add the background image
// Adjust the size of oldman and his dog
// Add the animations for the background image, oldman and his dog to walk towards the art gallery.
// Add some pop up instructions. For the user.
// Add a pop up to enter the artgallery

const Home = () => {
  return (
    <section className="w-full h-screen relative">
      <Canvas
        camera={{ near: 0.1, far: 1000 }}
        className="w-full h-screen bg-transparent"
      >
        <Suspense fallback={<Loader />}>
          <directionalLight
            position={[1, 1, 1]}
            intensity={2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <ambientLight intensity={0.3} />
          <hemisphereLight
            skyColor="#b1e1ff"
            groundColor="#000000"
            intensity={0.8}
          />
          <OldMan />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Home;
