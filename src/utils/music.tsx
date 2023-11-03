import { getProcessedData, normalizeToRange } from "./process";
import {
  AddressResponse,
  MusicDataResponse,
  ProcessedData,
} from "../types/types";

const MAX_VELOCITY = 40; //max velocity for midi -> volume or something
const BLOCKS_CONST = 512; //related to BPM for the "grid"

const note_names = [
  "A0",
  "C1",
  "D1",
  "E1",
  "G1",
  "A1",
  "C2",
  "D2",
  "E2",
  "G2",
  "A2",
  "C3",
  "D3",
  "E3",
  "G3",
  "A3",
  "C4",
  "D4",
  "E4",
  "G4",
  "A4",
  "C5",
  "D5",
  "E5",
  "G5",
  "A5",
  "C6",
  "D6",
  "E6",
  "G6",
  "A6",
];

const generateMidi = (data: ProcessedData) => {
  return data.normalizedPoints.map((item) => {
    return note_names[
      Math.round(
        normalizeToRange(
          item.txValue,
          { min: 0, max: 1 },
          { min: 0, max: note_names.length - 1 }
        )
      )
    ];
  });
};

const generateVelocity = (data: ProcessedData) => {
  return data.normalizedPoints.map((item) => {
    return Math.round(
      normalizeToRange(
        item.gas,
        { min: 0, max: 1 },
        { min: 0, max: MAX_VELOCITY }
      )
    );
  });
};

const generateBeat = (data: ProcessedData) => {
  return data.normalizedPoints.map((item) => {
    return Math.round(
      normalizeToRange(
        item.blockValue,
        { min: 0, max: 1 },
        { min: 0, max: BLOCKS_CONST }
      )
    );
  });
};

export const generateMusicFromAddress = async (
  addressData: AddressResponse
): Promise<MusicDataResponse> => {
  if (addressData.data.error) {
    console.log("Error in address data:", addressData.data.error);
    return { error: addressData.data.error };
  }

  console.log("Address data fetched, generating music...");
  const processedData = getProcessedData(addressData);
  console.log("Processed data:", processedData);

  const midi = generateMidi(processedData);
  console.log("Generated MIDI:", midi);

  const velocity = generateVelocity(processedData);
  console.log("Generated velocity:", velocity);

  const beat = generateBeat(processedData);
  console.log("Generated beat:", beat);

  return { notes: { midi, velocity, beat } };
};
