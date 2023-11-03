import { AddressData, range } from "../types/types";

export const getMinMax = (
  data: AddressData[],
  field: keyof AddressData
): range => {
  let min = Infinity;
  let max = -Infinity;

  data.forEach((item) => {
    const value = item[field];
    if (value < min) min = value;
    if (value > max) max = value;
  });

  return { min, max };
};
