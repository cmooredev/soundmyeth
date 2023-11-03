import { Canvas } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import { Lights } from "./components/Lights";
import { Animated } from "./components/Animated";
import { useState, useEffect } from "react";
import { Form } from "./components/Form";
import { AddressResponse, MusicDataResponse } from "./types/types";
import { generateMusicFromAddress } from "./utils/music";
import { MusicVisualizer } from "./components/MusicVisualizer";

import "./App.css";

function App() {
  const testing = false;
  const [showForm, setShowForm] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [addressData, setAddressData] = useState<AddressResponse | null>(null);
  const [visualizedMusic, setVisualizedMusic] = useState<JSX.Element[]>([]);

  const handleFormSubmit = async (inputValue: string) => {
    try {
      const response = await fetch("http://localhost:6969/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: inputValue }),
      });
      const data: AddressResponse = await response.json();
      console.log(data.data);
      if (data.data.code !== 0) {
        throw new Error(data.data.error);
      }
      console.log(data);
      setAddressData(data);
      const musicDataResponse: MusicDataResponse =
        await generateMusicFromAddress(data);
      console.log("1.1", musicDataResponse);
      if (musicDataResponse.notes) {
        const visualizer = new MusicVisualizer(musicDataResponse.notes);
        setVisualizedMusic(visualizer.visualizedMusic);
        console.log("1", visualizer.visualizedMusic);
      } else {
        console.error("Music data is not available");
      }
      setShowVisualizer(true);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setShowForm(false);
    }
  };

  useEffect(() => {
    console.log("showForm", showForm);
  }, [showForm]);

  useEffect(() => {
    console.log("showVisualizer", showVisualizer);
  }, [showVisualizer]);

  useEffect(() => {
    console.log("changed", visualizedMusic);
  }, [visualizedMusic]);

  console.log("2", visualizedMusic);
  return (
    <>
      {showForm && !showVisualizer && <Form onSubmit={handleFormSubmit} />}
      {!showForm && (
        <div className="container">
          <Canvas shadows>
            {testing ? <Stats /> : null}
            {testing ? <axesHelper visible={testing} args={[2]} /> : null}
            {testing ? (
              <gridHelper visible={testing} args={[100, 100]} />
            ) : null}

            {visualizedMusic.length > 0 ? (
              visualizedMusic
            ) : (
              <Animated showForm={showForm} setShowForm={setShowForm} />
            )}

            <Lights />
          </Canvas>
        </div>
      )}
    </>
  );
}

export default App;
