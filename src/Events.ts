export interface LiveEvent {
  city: string;
  event_id: string;
  inserted_at: number;
  lat: string;
  long: string;
  region: "us-east-1";
  timestamp: number;
  type: string;
}

export const AWSRegionGeo = {
  "us-east-1": {
    lat: 37.926868,
    lng: -78.024902,
  },
};

export const BackgroundColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

export const BorderColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export const EventTypeColors: Record<string, number> = {
  "api.analytics.search": 0,
  "api.analytics.searches": 0,
  "api.analytics.click": 1,
  "api.analytics.custom": 2,
  "api.analytics.view": 3,
  "api.analytics.collect": 4,
};

export const LambdaURL =
  "https://gdattsifnijqe42uhkuv4oi5nm0fhbxc.lambda-url.us-east-1.on.aws";
