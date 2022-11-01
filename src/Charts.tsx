import { FunctionComponent, useEffect, useState } from "react";
import "chart.js/auto"; // ADD THIS
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { ScrollArea, Space } from "@mantine/core";
import { LiveEvent } from "./Events";
import { Dictionary, groupBy } from "lodash";

export interface ChartsProps {
  tickSpeed?: number;
}

const backgroundColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

const borderColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export const Charts: FunctionComponent<ChartsProps> = ({
  tickSpeed = 1000,
}) => {
  const [numEvents, setNumEvents] = useState<
    Array<{ num: number; time: number }>
  >([]);
  const [eventsByRegion, setEventsByRegion] = useState<Dictionary<LiveEvent[]>>(
    {}
  );
  const [eventsByCity, setEventsByCity] = useState<Dictionary<LiveEvent[]>>({});
  const [eventsByType, setEventsByType] = useState<Dictionary<LiveEvent[]>>({});
  const [animationTick, setAnimationTick] = useState(0);

  const emitData = async () => {
    const res = (await (
      await fetch(
        `https://gdattsifnijqe42uhkuv4oi5nm0fhbxc.lambda-url.us-east-1.on.aws/?last=${tickSpeed}`
      )
    ).json()) as LiveEvent[];
    const numberOfEvents = res.length;
    const byTypes = groupBy(res, (r) => r.type);
    const byRegion = groupBy(res, (r) => r.region);
    const byCity = groupBy(res, (r) => r.city);

    const newNumEvents = numEvents
      .concat({ num: numberOfEvents, time: new Date().getTime() })
      .slice(-10);

    setEventsByType(byTypes);
    setEventsByRegion(byRegion);
    setEventsByCity(byCity);
    setNumEvents(newNumEvents);
    setAnimationTick(animationTick + 1);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await emitData();
    }, tickSpeed);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationTick]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "15%",
          padding: 10,
          left: 0,
          zIndex: 2,
          width: "25%",
        }}
      >
        <Doughnut
          options={{ responsive: true }}
          data={{
            labels: Object.keys(eventsByType),
            datasets: [
              {
                backgroundColor: [...backgroundColors].reverse(),
                borderColor: [...borderColors].reverse(),
                label: "Events by types",
                data: Object.values(eventsByType).map(
                  (byType) => byType.length
                ),
              },
            ],
          }}
        />
        <Bar
          options={{ responsive: true }}
          data={{
            labels: Object.keys(eventsByCity),
            datasets: [
              {
                backgroundColor: [...backgroundColors],
                borderColor: [...borderColors],
                label: "Events by cities",
                data: Object.values(eventsByCity).map(
                  (byType) => byType.length
                ),
              },
            ],
          }}
        />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "15%",
          padding: 10,
          right: 0,
          zIndex: 2,
          width: "25%",
        }}
      >
        <ScrollArea style={{ height: "100%" }}>
          <Line
            options={{ responsive: true, color: "white" }}
            data={{
              labels: numEvents
                .reverse()
                .map((d) => `${new Date().getTime() - d.time} ms`),
              datasets: [
                {
                  borderColor: "#F05245",
                  backgroundColor: "#F05245",
                  label: "Events per seconds",
                  data: numEvents.reverse().map((d) => d.num),
                },
              ],
            }}
          />
          <Space />
          <Doughnut
            options={{ responsive: true }}
            data={{
              labels: Object.keys(eventsByRegion),
              datasets: [
                {
                  backgroundColor: [...backgroundColors],
                  borderColor: [...borderColors],
                  label: "Events per region",
                  data: Object.values(eventsByRegion).map(
                    (byRegion) => byRegion.length
                  ),
                },
              ],
            }}
          />
        </ScrollArea>
      </div>
    </>
  );
};
