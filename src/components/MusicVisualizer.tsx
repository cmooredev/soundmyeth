import { MusicalNotes, AddressData } from "../types/types";
import { Textured } from "./Textured";
import { getMinMax } from "../utils/utils";

export class MusicVisualizer {
  private musicData: MusicalNotes;
  public visualizedMusic: JSX.Element[];

  constructor(musicData: MusicalNotes) {
    this.musicData = musicData;
    this.visualizedMusic = this.visualizeMusic();
  }

  visualizeMusic(): JSX.Element[] {
    const minBeat = Math.min(...this.musicData.beat);
    const maxBeat = Math.max(...this.musicData.beat);
    const newMin = -2;
    const newMax = 2;

    const visualizedMusic = this.musicData.midi.map((note, index) => {
      const beat = this.musicData.beat[index];
      const x =
        ((beat - minBeat) / (maxBeat - minBeat)) * (newMax - newMin) + newMin;
      const y = index * 0.1; // adjust this value as needed
      const z = parseInt(note.replace(/\D/g, "")) * 0.1; // adjust this value as needed

      return <Textured key={index} position={[x, y, z]} />;
    });

    console.log(visualizedMusic);
    return visualizedMusic;
  }
}
