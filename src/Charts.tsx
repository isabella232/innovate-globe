import { FunctionComponent, useEffect, useState } from "react";
import "chart.js/auto"; // ADD THIS
import { Bar, Line, Pie } from "react-chartjs-2";
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

export const Charts: FunctionComponent<ChartsProps> = ({ tickSpeed = 100 }) => {
  const [numEvents, setNumEvents] = useState<
    Array<{ num: number; time: number }>
  >([]);
  /*const [eventsByRegion, setEventsByRegion] = useState<Dictionary<LiveEvent[]>>(
    {}
  );*/
  const [eventsByCity, setEventsByCity] = useState<Dictionary<LiveEvent[]>>({});
  const [eventsByType, setEventsByType] = useState<Dictionary<LiveEvent[]>>({});
  const [animationTick, setAnimationTick] = useState(0);
  const chartsOptions = {
    responsive: true,
    color: "white",
  };

  const emitData = async () => {
    const resFast = (await (
      await fetch(
        `https://gdattsifnijqe42uhkuv4oi5nm0fhbxc.lambda-url.us-east-1.on.aws/?last=${
          tickSpeed * 10
        }`
      )
    ).json()) as LiveEvent[];

    const resSlow = (await (
      await fetch(
        `https://gdattsifnijqe42uhkuv4oi5nm0fhbxc.lambda-url.us-east-1.on.aws/?last=${2000}`
      )
    ).json()) as LiveEvent[];

    const numberOfEvents = resFast.length;
    const byTypes = groupBy(resSlow, (r) =>
      r.type.replace("api.analytics.", "")
    );
    //const byRegion = groupBy(resSlow, (r) => r.region);
    const byCity = groupBy(
      resSlow.filter((d) => d.city !== "null" && d.city !== null),
      (r) => r.city
    );

    const newNumEvents = numEvents
      .concat({ num: numberOfEvents, time: new Date().getTime() })
      .slice(-100);

    if (Object.keys(byTypes).length && animationTick % 5 === 0) {
      setEventsByType(byTypes);
    }
    /*if (Object.keys(byRegion).length && animationTick % tickSpeed === 0) {
      setEventsByRegion(byRegion);
    }*/
    if (Object.keys(byCity).length && animationTick % 5 === 0) {
      setEventsByCity(byCity);
    }

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
          top: 50,
          zIndex: 2,
          width: "25%",
        }}
      >
        <ScrollArea style={{ height: "100%" }}>
          <Bar
            style={{
              height: "100%",
            }}
            options={{
              ...chartsOptions,
              indexAxis: "y" as const,
              aspectRatio: 0.5,
            }}
            data={{
              labels: Object.keys(eventsByCity),
              datasets: [
                {
                  backgroundColor: [...backgroundColors].reverse(),
                  borderColor: [...borderColors].reverse(),
                  label: "Events by cities",
                  data: Object.values(eventsByCity).map(
                    (byType) => byType.length
                  ),
                },
              ],
            }}
          />
        </ScrollArea>
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
          <Pie
            options={{ ...chartsOptions }}
            data={{
              labels: Object.keys(eventsByType),
              datasets: [
                {
                  backgroundColor: [...backgroundColors],
                  borderColor: [...borderColors],
                  label: "Events by types",
                  data: Object.values(eventsByType).map(
                    (byType) => byType.length
                  ),
                },
              ],
            }}
          />
          <Line
            options={{
              ...chartsOptions,
              elements: {
                point: {
                  radius: 0,
                },
              },
              animations: {
                tension: {
                  duration: 5000,
                  easing: "linear",
                  from: 1,
                  to: 0,
                  loop: true,
                },
              },
            }}
            data={{
              labels: numEvents.map(
                (d) =>
                  `${Math.floor(
                    (new Date().getTime() - d.time) / 1000
                  )} seconds ago`
              ),
              datasets: [
                {
                  borderColor: borderColors[5],
                  backgroundColor: backgroundColors[5],
                  label: `Events per seconds`,
                  data: numEvents.map((d) => d.num),
                },
              ],
            }}
          />
          <Space />
        </ScrollArea>
      </div>
    </>
  );
};

/**
 * 
 * 
 * <Doughnut
            options={{ ...chartsOptions }}
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
 */
