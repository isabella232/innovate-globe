import { FunctionComponent, useEffect, useState } from "react";
import "chart.js/auto"; // ADD THIS
import { Bar, Line, Pie } from "react-chartjs-2";
import { ScrollArea, Space, Text } from "@mantine/core";
import { LambdaURL, LiveEvent } from "./Events";
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
  /*const [eventsByRegion, setEventsByRegion] = useState<Dictionary<LiveEvent[]>>(
    {}
  );*/
  const [eventsByCity, setEventsByCity] = useState<Dictionary<LiveEvent[]>>({});
  const [eventsByType, setEventsByType] = useState<Dictionary<LiveEvent[]>>({});
  const [latency, setLatency] = useState<number>(0);
  const [money, setMoney] = useState<number>(0);
  const [animationTick, setAnimationTick] = useState(0);
  const chartsOptions = {
    responsive: true,
    color: "white",
  };

  const emitData = async () => {
    const resFast = (await (
      await fetch(`${LambdaURL}&last=${tickSpeed}`)
    ).json()) as LiveEvent[];

    const numberOfEvents = resFast.length;
    const byTypes = groupBy(resFast, (r) =>
      r.type.replace("api.analytics.", "")
    );
    //const byRegion = groupBy(resSlow, (r) => r.region);
    const byCity = groupBy(
      resFast.filter((d) => d.city !== "null" && d.city !== null),
      (r) => r.city
    );

    const newNumEvents = numEvents
      .concat({ num: numberOfEvents, time: new Date().getTime() })
      .slice(-100);

    if (Object.keys(byTypes).length && animationTick % 5 === 0) {
      setEventsByType(byTypes);
    }
    if (Object.keys(byCity).length && animationTick % 5 === 0) {
      setEventsByCity(byCity);
    }
    const newMoney = resFast.reduce((prev, current) => {
      if (current.price) {
        return prev + Number(current.price);
      } else {
        return prev;
      }
    }, 0);

    setMoney(money + newMoney);
    setNumEvents(newNumEvents);
    if (resFast[0]) {
      const total = resFast.reduce((previous, current) => {
        return current.timestamp + previous;
      }, 0);
      const mean = total / resFast.length;
      setLatency(Math.round((new Date().getTime() - mean) / 1000));
    } else {
      setLatency(0);
    }

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

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 10,
          padding: 10,
          left: 0,
          top: 50,
          zIndex: 2,
          width: "15%",
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
          top: "15%",
          padding: 10,
          right: 20,
          zIndex: 2,
          width: "25%",
        }}
      >
        <ScrollArea style={{ height: "100%" }}>
          {localStorage.getItem("pw") === null && (
            <Text size="xl" weight="bold" color="red">
              You need to input the password in debug menu ! Test4...
            </Text>
          )}
          <Text size="xl" weight="bold" color="white">
            Add to cart amount:
          </Text>
          <Text color="green" size={30}>
            {formatter.format(money)}
          </Text>
          <Text size="xl" color="white" weight="bold">
            Current latency:
          </Text>
          <Text
            size={30}
            color={
              latency === 0
                ? "grey"
                : latency < 5
                ? "green"
                : latency < 20
                ? "yellow"
                : "red"
            }
          >
            {latency.toString()} seconds
          </Text>

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

          <Space />
        </ScrollArea>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          padding: 10,
          right: 20,
          zIndex: 2,
          width: "80%",
        }}
      >
        <Line
          options={{
            ...chartsOptions,
            elements: {
              point: {
                radius: 0,
              },
            },
            aspectRatio: 6,
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
      </div>
    </>
  );
};
