import {
  AddressResponse,
  NormalizedPoint,
  ProcessedData,
  range,
} from "../types/types";
import { getMinMax } from "./utils";

const winsorize = (
  values: number[],
  lowerPercentile: number,
  upperPercentile: number
): number[] => {
  const sortedValues = [...values].sort((a, b) => a - b);
  const lowerValue =
    sortedValues[Math.floor((values.length * lowerPercentile) / 100)];
  const upperValue =
    sortedValues[Math.ceil((values.length * upperPercentile) / 100) - 1];

  return values.map((value) => {
    if (value < lowerValue) return lowerValue;
    if (value > upperValue) return upperValue;
    return value;
  });
};

const normalizeWithCompression = (
  value: number,
  values: number[],
  newRange: range,
  lowerPercentile: number = 0,
  upperPercentile: number = 75,
  compressionFactor: number = 1
): number => {
  const winsorizedValues = winsorize(values, lowerPercentile, upperPercentile);

  const winsorizedRange = {
    min: Math.min(...winsorizedValues),
    max: Math.max(...winsorizedValues),
  };

  const winsorizedValue = winsorizedValues[values.indexOf(value)];

  const logValue = Math.log(winsorizedValue + 1);

  const logRange = {
    min: Math.log(winsorizedRange.min + 1),
    max: Math.log(winsorizedRange.max + 1),
  };

  const normalizedValue =
    2 * ((logValue - logRange.min) / (logRange.max - logRange.min)) - 1;

  const compressedValue =
    1 / (1 + Math.exp(-normalizedValue * compressionFactor));

  return compressedValue * (newRange.max - newRange.min) + newRange.min;
};

export const normalizeToRange = (
  value: number,
  curRange: range,
  newRange: range
): number => {
  return (
    ((value - curRange.min) / (curRange.max - curRange.min)) *
      (newRange.max - newRange.min) +
    newRange.min
  );
};

export const getProcessedData = (response: AddressResponse): ProcessedData => {
  console.log("Processing data...");
  const toBasicRange = { min: 0, max: 1 };
  const blockRange = getMinMax(response.data.data, "block_number");

  const normalizedPoints: NormalizedPoint[] = response.data.data.map((item) => {
    return {
      blockValue: normalizeToRange(item.block_number, blockRange, toBasicRange),
      txValue: normalizeWithCompression(
        item.value,
        response.data.data.map((data) => data.value),
        toBasicRange
      ),
      txType: item.type,
      txSuccess: item.status === 1,
      gas: normalizeWithCompression(
        item.gas,
        response.data.data.map((data) => data.gas),
        toBasicRange,
        0,
        90,
        0.75
      ),
    };
  });
  return { normalizedPoints };
};
