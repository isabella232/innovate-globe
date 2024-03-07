/* eslint-disable */

import { FunctionComponent, useEffect, useState, useRef } from "react";
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

function onBFCMWeekend(day: string) {
    return bfcmDays.includes(day);
}

const euClient: AxiosInstance = axios.create();
const usClient: AxiosInstance = axios.create();
const auClient: AxiosInstance = axios.create();
const client: AxiosInstance = axios.create();

const bfcmDays = ["2023-11-24", "2023-11-25", "2023-11-26", "2023-11-27"];
const isBFCMWeekend = onBFCMWeekend(new Date().toISOString().split('T')[0]);

export const Charts: FunctionComponent<ChartsProps> = (props) => {
    const [latencyUs, setLatencyUs] = useState<number>(0);
    const [latencyEu, setLatencyEu] = useState<number>(0);
    const [latencyAu, setLatencyAu] = useState<number>(0);

    const [purchasesPerMinute, setPurchasesPerMinute] = useState<number>(0);
    const [revenuePerMinute, setRevenuePerMinute] = useState<number>(0);
    const [addToCartsPerMinute, setAddToCartsPerMinute] = useState<number>(0);

    const prevPurchaseStateRef = useRef(0);
    const prevRevenueStateRef = useRef(0);
    const prevAddToCartStateRef = useRef(0);
    const [purchasesPerDay, setPurchasesPerDay] = useState<number>(0);
    const [revenuePerDay, setRevenuePerDay] = useState<number>(0);
    const [addToCartsPerDay, setAddToCartsPerDay] = useState<number>(0);

    const prevBfcmRevenueRef = useRef(0);
    const [bfcmRevenue, setBfcmRevenue] = useState<number>(0);

    const [animationTick, setAnimationTick] = useState(0);

    const [query, setQuery] = useQueryParams({
        env: StringParam,
    });

    const [env, setEnv] = useState<string>(
        force(query.env, "prd")
    );

    useEffect(() => {
        if (query.env !== env && query.env) {
            console.log("environment is now: ", query.env)
            setEnv(query.env!);
        } else { 
            console.log("environment set to default: prd")
            setQuery({env: "prd"})
            setEnv("prd");
        } 
    }, [query.env, env])

    useEffect(() => {
        prevPurchaseStateRef.current = purchasesPerDay;
    }, [purchasesPerDay]);

    useEffect(() => {
        prevRevenueStateRef.current = revenuePerDay;
    }, [revenuePerDay]);

    useEffect(() => {
        prevAddToCartStateRef.current = addToCartsPerDay;
    }, [addToCartsPerDay]);

    useEffect(() => {
        prevBfcmRevenueRef.current = bfcmRevenue;
    }, [bfcmRevenue]);

    function force<T>(v: T | null | undefined, fallback: T): T {
        return v !== null && v !== undefined ? v : fallback;
    }

    const getMetrics = async () => {
        if (!query.env) {
            query.env = "prd";
        }
        if (query.env) {
            var purchasesPerMinuteAcrossRegions = 0;
            var revenuePerMinuteAcrossRegions = 0;
            var addToCartsPerMinuteAcrossRegions = 0;

            var purchasesPerDayAcrossRegions = 0;
            var revenuePerDayAcrossRegions = 0;
            var addToCartsPerDayAcrossRegions = 0;

            var arrayPromises:any = [];
            var currentdate = new Date();
            var currentMinute = currentdate.getMinutes();
            currentdate.setMilliseconds(0);
            currentdate.setSeconds(0);
            currentdate.setMinutes(currentMinute - 1);
            var currentDay = currentdate.toISOString().split('T')[0];
            var isOnBFCMWeekend = onBFCMWeekend(currentDay);

            for (const regionConfig of envRegionMapping[query.env]) {
                arrayPromises.push(await client
                    .get<TimeBucketMetric[]>(`${regionConfig.lambdaEndpoint}&timeBucket=${currentdate.toISOString()}&timeBucketType=minutely`).catch((e) => {
                        console.log("Caught an error calling the lambda", e);
                        return new Promise(() => { return {"data":[]}});
                    }));
                arrayPromises.push(await client
                    .get<TimeBucketMetric[]>(`${regionConfig.lambdaEndpoint}&timeBucket=${currentDay}&timeBucketType=daily`));
            }
            await Promise.all(arrayPromises);
            for (const promise of arrayPromises) {
                if (Array.isArray(promise.data)) {
                    const metrics = promise.data;
                    metrics.forEach((metric: TimeBucketMetric) => {
                        if (metric.timeBucketType === 'minutely') {
                            if (metric.type === 'purchases') {
                                purchasesPerMinuteAcrossRegions += Number(metric.count);
                            }
                            if (metric.type === 'revenue') {
                                revenuePerMinuteAcrossRegions += Number(metric.count);
                            }
                            if (metric.type === 'addToCart') {
                                addToCartsPerMinuteAcrossRegions += Number(metric.count);
                            }
                        } else if (metric.timeBucketType === 'daily') {
                            if (metric.type === 'purchases') {
                                purchasesPerDayAcrossRegions += Number(metric.count);
                            }
                            if (metric.type === 'revenue') {
                                revenuePerDayAcrossRegions += Number(metric.count);
                            }
                            if (metric.type === 'addToCart') {
                                addToCartsPerDayAcrossRegions += Number(metric.count);
                            }
                        }
                    })
                }
                setPurchasesPerMinute(purchasesPerMinuteAcrossRegions);
                setRevenuePerMinute(revenuePerMinuteAcrossRegions);
                setAddToCartsPerMinute(addToCartsPerMinuteAcrossRegions);

                setPurchasesPerDay(purchasesPerDayAcrossRegions);
                setRevenuePerDay(revenuePerDayAcrossRegions);
                setAddToCartsPerDay(addToCartsPerDayAcrossRegions);
                if (isOnBFCMWeekend) {
                    setBfcmRevenue(revenuePerDayAcrossRegions);
                }
            }
        }
    };
    const getUsEvents = async () => {
        const events = await usClient
            .get<LiveEvent[]>(`${LambdaURLUsEast}&last=${props.tickSpeed}`)
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                const liveEvent: LiveEvent = {
                    city: "",
                    event_id: "",
                    inserted_at: 0,
                    lat: "",
                    lng: "",
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
            .get<LiveEvent[]>(`${LambdaURLEU}&last=${props.tickSpeed}`)
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                const liveEvent: LiveEvent = {
                    city: "",
                    event_id: "",
                    inserted_at: 0,
                    lat: "",
                    lng: "",
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
            .get<LiveEvent[]>(`${LambdaURLAu}&last=${props.tickSpeed}`)
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                const liveEvent: LiveEvent = {
                    city: "",
                    event_id: "",
                    inserted_at: 0,
                    lat: "",
                    lng: "",
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
        }, props.tickSpeed);
        return () => {
            clearInterval(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animationTick]);

    useEffect(() => {
        getMetrics()
        const timeout = setInterval(async () => {
            getMetrics()
        }, 60000);
        return () => {
            clearInterval(timeout);
        };
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
                    <Text size="xl" color={"darkgrey"}>Total sales today (USD)</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>
                        <CountUp
                            start={prevRevenueStateRef.current}
                            end={revenuePerDay}
                            duration={10}
                            separator=","
                            decimal="."
                            decimals={2}
                            prefix="$"
                        />
                    </Text>
                </Grid.Col>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Total add to cart today</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>
                        <CountUp
                            start={prevAddToCartStateRef.current}
                            end={addToCartsPerDay}
                            duration={10}
                            separator=","
                        />
                    </Text>
                </Grid.Col>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Total transactions today</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>
                        <CountUp
                            start={prevPurchaseStateRef.current}
                            end={purchasesPerDay}
                            duration={10}
                            separator=","
                        />
                    </Text>
                </Grid.Col>
            </Grid>
            {isBFCMWeekend && <Grid style={{
                position: "fixed",
                top: "40%",
                padding: 10,
                zIndex: 5,
                width: "80%",
                left: "10%"
            }}>
                <Grid.Col span={10} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text color={"white"} style={{ fontSize: "xxx-large" }}>BFCM sales (USD)</Text>
                    <Text weight="bold" style={{ fontSize: "xxx-large" }}>
                        <CountUp
                            start={prevBfcmRevenueRef.current}
                            end={bfcmRevenue}
                            duration={10}
                            separator=","
                            decimal="."
                            decimals={2}
                            prefix="$"
                        />
                    </Text>
                </Grid.Col>
            </Grid> }
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
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>{USDollar.format(revenuePerMinute)}</Text>
                </Grid.Col>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Add to cart per minute</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>{addToCartsPerMinute}</Text>
                </Grid.Col>
                <Grid.Col span={4} style={{ color: "white", borderLeft: "4px solid white" }}>
                    <Text size="xl" color={"darkgrey"}>Transactions per minute</Text>
                    <Text weight="bold" style={{ fontSize: "xx-large" }}>{purchasesPerMinute}</Text>
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
