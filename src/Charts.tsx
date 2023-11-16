/* eslint-disable */

import { FunctionComponent, useEffect, useState } from "react";
import "chart.js/auto"; // ADD THIS
import { Grid, Text } from "@mantine/core";
import {
    envRegionMapping,
    LambdaURLAu,
    LambdaURLEU,
    LambdaURLUsEast,
    LiveEvent,
    TimeBucketMetric,
} from "./Events";
import axios, { AxiosInstance } from "axios";
import { StringParam, useQueryParams } from "use-query-params";
import CountUp from 'react-countup';

export interface ChartsProps {
    tickSpeed?: number;
}


const euClient: AxiosInstance = axios.create();
const usClient: AxiosInstance = axios.create();
const auClient: AxiosInstance = axios.create();
const client: AxiosInstance = axios.create();

export const Charts: FunctionComponent<ChartsProps> = ({
    tickSpeed = 1000,
}) => {
    const [latencyUs, setLatencyUs] = useState<number>(0);
    const [latencyEu, setLatencyEu] = useState<number>(0);
    const [latencyAu, setLatencyAu] = useState<number>(0);

    const [totalPurchases, setTotalPurchases] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [totalAddToCarts, setTotalAddToCarts] = useState<number>(0);

    const [prevTotalRevenueAccumulator, setPrevTotalRevenueAccumulator] = useState<number>(0);
    const [totalRevenueAccumulator, setTotalRevenueAccumulator] = useState<number>(0);


    const [latency, setLatency] = useState<Record<string, number>>({});


    const [animationTick, setAnimationTick] = useState(0);

    const [query] = useQueryParams({
        env: StringParam,
    });

    const [env, setEnv] = useState<string>(
        force(query.env, "prd")
    );

    useEffect(() => {
        if (query.env !== env) {
            console.log("environment is now: ", query.env)
            setEnv(query.env!);
        }
    }, [query.env, env])

    function force<T>(v: T | null | undefined, fallback: T): T {
        return v !== null && v !== undefined ? v : fallback;
    }

    const getMetrics = async () => {
        if (query.env) {
            var purchases = 0;
            var revenue = 0;
            var addToCarts = 0;
            var arrayPromises = [];
            for (const regionConfig of envRegionMapping[query.env]) {
                var currentdate = new Date();
                var currentMinute = currentdate.getMinutes();
                currentdate.setMilliseconds(0)
                currentdate.setSeconds(0)
                currentdate.setMinutes(currentMinute - 1)
                arrayPromises.push(await client
                    .get<TimeBucketMetric[]>(`${regionConfig.lambdaEndpoint}&metrics=${currentdate.toISOString()}`));
            }
            await Promise.all(arrayPromises);
            for (const promise of arrayPromises) {
                if (Array.isArray(promise.data)) {
                    const metrics = promise.data;
                    metrics.forEach((metric: TimeBucketMetric) => {
                        if (metric.type === 'purchases') {
                            console.log(`Purchases from region`, metric.count)
                            purchases += Number(metric.count);
                        }
                        if (metric.type === 'revenue') {
                            console.log(`revenue from region`, metric.count)
                            revenue += Number(metric.count);
                        }
                        if (metric.type === 'addToCart') {
                            console.log(`addToCart from region`, metric.count)
                            addToCarts += Number(metric.count);
                        }
                    })
                }
                setTotalPurchases(purchases);
                setTotalRevenue(revenue);
                setTotalAddToCarts(addToCarts);
                const previousRevenue = totalRevenueAccumulator;
                setPrevTotalRevenueAccumulator(previousRevenue);
                const currentTotalRevenue = totalRevenueAccumulator + revenue;
                console.log("current total", currentTotalRevenue)
                setTotalRevenueAccumulator(currentTotalRevenue);
            }
        }
    };
    const getUsEvents = async () => {
        const events = await usClient
            .get<LiveEvent[]>(`${LambdaURLUsEast}&last=${tickSpeed}`)
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                const liveEvent: LiveEvent = {
                    city: "",
                    event_id: "",
                    inserted_at: 0,
                    lat: "",
                    long: "",
                    region: "us-east-1",
                    timestamp: 0,
                    type: "",
                };
                return [liveEvent];
            });

        if (events[0]) {
            const total = events.reduce((previous, current) => {
                return current.timestamp + previous;
            }, 0);
            const mean = total / events.length;
            setLatencyUs(Math.round((new Date().getTime() - mean) / 1000));
        }
    };

    const getEuEvents = async () => {
        const events = await euClient
            .get<LiveEvent[]>(`${LambdaURLEU}&last=${tickSpeed}`)
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                const liveEvent: LiveEvent = {
                    city: "",
                    event_id: "",
                    inserted_at: 0,
                    lat: "",
                    long: "",
                    region: "us-east-1",
                    timestamp: 0,
                    type: "",
                };
                return [liveEvent];
            });

        if (events[0]) {
            const total = events.reduce((previous, current) => {
                return current.timestamp + previous;
            }, 0);
            const mean = total / events.length;
            setLatencyEu(Math.round((new Date().getTime() - mean) / 1000));
        }
    };

    const getAuEvents = async () => {
        const events = await auClient
            .get<LiveEvent[]>(`${LambdaURLAu}&last=${tickSpeed}`)
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                const liveEvent: LiveEvent = {
                    city: "",
                    event_id: "",
                    inserted_at: 0,
                    lat: "",
                    long: "",
                    region: "us-east-1",
                    timestamp: 0,
                    type: "",
                };
                return [liveEvent];
            });

        if (events[0]) {
            const total = events.reduce((previous, current) => {
                return current.timestamp + previous;
            }, 0);
            const mean = total / events.length;
            setLatencyAu(Math.round((new Date().getTime() - mean) / 1000));
        }
    };

    const emitData = async () => {
        const promiseAu: Promise<void> = getAuEvents();
        const promiseEu: Promise<void> = getEuEvents();
        const promiseUs: Promise<void> = getUsEvents();


        await Promise.all([promiseAu, promiseEu, promiseUs]);

        setAnimationTick(animationTick + 1);
    };

    useEffect(() => {
        const timeout = setInterval(async () => {
            await emitData();
        }, tickSpeed);
        return () => {
            clearInterval(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animationTick]);

    useEffect(() => {
        if (env !== undefined) {
            getMetrics()
            const timeout = setInterval(async () => {
                getMetrics()
            }, 60000);
            return () => {
                clearInterval(timeout);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [env]);

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });


    return (
        <>
            <Grid style={{
                position: "fixed",
                top: 100,
                padding: 10,
                zIndex: 2,
                width: "80%",
                height: 100,
                left: "20%"
            }}>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Total Sales (USD)</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>
                        <CountUp
                            start={prevTotalRevenueAccumulator}
                            end={totalRevenueAccumulator}
                            duration={10}
                            separator=","
                            decimal="."
                            decimals={2}
                            prefix="$"
                        />
                    </Text>
                </Grid.Col>
            </Grid>
            <Grid style={{
                position: "fixed",
                bottom: 100,
                padding: 10,
                zIndex: 2,
                width: "80%",
                height: 100,
                left: "20%"
            }}>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Sales per minute (USD)</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>{USDollar.format(totalRevenue)}</Text>
                </Grid.Col>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Add to cart per minute</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>{totalAddToCarts}</Text>
                </Grid.Col>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Transactions per minute</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>{totalPurchases}</Text>
                </Grid.Col>
            </Grid>


            <div style={{
                position: "fixed",
                bottom: 0,
                padding: 10,
                zIndex: 2,
                width: "320px",
                height: 120,
                left: 0
            }}>
                <Text color="white" weight={"bold"}>Latency</Text>
                <>
                    {Object.entries(latency).map(([key, value]) => {
                        return <Text color="white" key={key}>{value.toString()} seconds</Text>
                    })}
                </>


                <Grid>
                    <Grid.Col span={4} style={{ color: "white" }}>
                        <Text size={14} color="white">
                            us-east-1
                        </Text>
                        <Text
                            size="sm"
                            color={
                                latencyUs === 0
                                    ? "grey"
                                    : latencyUs < 5
                                        ? "green"
                                        : latencyUs < 20
                                            ? "yellow"
                                            : "red"
                            }
                        >
                            {latencyUs.toString()} seconds
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={4} style={{ color: "white" }}>
                        <Text size={14} color="white">
                            eu-west-1
                        </Text>
                        <Text
                            size="sm"
                            color={
                                latencyEu === 0
                                    ? "grey"
                                    : latencyEu < 5
                                        ? "green"
                                        : latencyEu < 20
                                            ? "yellow"
                                            : "red"
                            }
                        >
                            {latencyEu.toString()} seconds
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={4} style={{ color: "white" }}>
                        <Text size={14} color="white">
                            ap-southeast-2
                        </Text>
                        <Text
                            size="sm"
                            color={
                                latencyAu === 0
                                    ? "grey"
                                    : latencyAu < 5
                                        ? "green"
                                        : latencyAu < 20
                                            ? "yellow"
                                            : "red"
                            }
                        >
                            {latencyAu.toString()} seconds
                        </Text>
                    </Grid.Col>
                </Grid>
            </div>


        </>
    );
};
