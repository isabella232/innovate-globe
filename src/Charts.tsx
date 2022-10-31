import { FunctionComponent, useEffect, useState } from "react";
import "chart.js/auto"; // ADD THIS
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { Space } from "@mantine/core";

export const Charts: FunctionComponent = () => {
  const [data, setData] = useState<Array<{ num: number; time: number }>>([]);
  const [animationTick, setAnimationTick] = useState(0);

  const emitData = async () => {
    const numEvents = Math.floor(Math.random() * (50 - 0 + 1) + 0);
    const newData = data
      .concat({ num: numEvents, time: new Date().getTime() })
      .slice(-10);

    setData(newData);
    setAnimationTick(animationTick + 1);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await emitData();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationTick]);

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        right: 0,
        zIndex: 2,
        width: 300,
      }}
    >
      <Line
        options={{ responsive: true, color: "white" }}
        data={{
          labels: data
            .reverse()
            .map((d) => `${new Date().getTime() - d.time} ms`),
          datasets: [
            {
              borderColor: "#F05245",
              backgroundColor: "#F05245",
              label: "Events per seconds",
              data: data.reverse().map((d) => d.num),
            },
          ],
        }}
      />
      <Space />
      <Doughnut
        options={{ responsive: true }}
        data={{
          labels: [],
          datasets: [
            {
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              label: "Events per seconds",
              data: data.reverse().map((d) => d.num),
            },
          ],
        }}
      />
      <Bar
        options={{ responsive: true, color: "white" }}
        data={{
          labels: data
            .reverse()
            .map((d) => `${new Date().getTime() - d.time} ms`),
          datasets: [
            {
              borderColor: "#FFE300",
              backgroundColor: "#FFE300",
              label: "Events per seconds",
              data: data.reverse().map((d) => d.num),
            },
          ],
        }}
      />
    </div>
  );
};
