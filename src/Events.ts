export interface LiveEvent {
  city: string;
  event_id: string;
  inserted_at: number;
  lat: string;
  long: string;
  region: "us-east-1";
  timestamp: string;
  type: string;
}

export const AWSRegionGeo = {
  "us-east-1": {
    lat: 37.926868,
    lng: -78.024902,
  },
};
