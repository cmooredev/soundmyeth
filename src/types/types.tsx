export interface AddressData {
  block_number: number;
  burnt_fee: number;
  cumulative_gas_used: number;
  effective_gas_price: number;
  gas: number;
  gas_price: number;
  gas_used: number;
  max_fee_per_gas: number;
  max_priority_fee_per_gas: number;
  nonce: number;
  saving_fee: number;
  status: number;
  transaction_index: number;
  tx_fee: number;
  type: number;
  value: number;
}

export interface AddressResponse {
  data: {
    code: number;
    message: string;
    data: AddressData[];
    error?: string;
  };
}
export interface NormalizedPoint {
  blockValue: number; //from block number
  txValue: number; //from transaction value
  txType: number; //from transaction type
  txSuccess: boolean; //from transaction success
  gas: number;
}

export interface ProcessedData {
  //array of normalized points
  normalizedPoints: NormalizedPoint[];
}

export interface MusicalNotes {
  midi: string[];
  velocity: number[];
  beat: number[];
}

export type range = {
  min: number;
  max: number;
};

export interface MusicDataResponse {
  notes?: MusicalNotes;
  error?: string;
}
