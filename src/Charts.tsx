// @ts-nocheck
/* eslint-disable */

import {FunctionComponent, useEffect, useState} from "react";
import "chart.js/auto"; // ADD THIS
import {Grid, Text} from "@mantine/core";
import {envRegionMapping, LambdaURLAu, LambdaURLEU, LambdaURLUsEast, LiveEvent} from "./Events";
import axios, {AxiosInstance} from "axios";
import {StringParam, useQueryParams} from "use-query-params";

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

    const [latency, setLatency] = useState<Record<string, number>>({});


    const [money, setMoney] = useState<number>(0);
    const [newMoneyEu, setNewMoneyEu] = useState<number>(0);
    const [newMoneyAu, setNewMoneyAu] = useState<number>(0);
    const [newMoneyUs, setNewMoneyUs] = useState<number>(0);
    const [animationTick, setAnimationTick] = useState(0);

    const [query] = useQueryParams({
        env: StringParam,
    });

    const [env, setEnv] = useState(
        force(query.env, "prd")
    );

    function force<T>(v: T | null | undefined, fallback: T): T {
        return v !== null && v !== undefined ? v : fallback;
    }

    const getEvents = async () => {
        if (query.env) {
            for (const regionConfig of envRegionMapping[query.env]) {

                console.log(regionConfig);
            }
            //     const events = await client
            //         .get<LiveEvent[]>(`${regionConfig.lambdaEndpoint}&last=${tickSpeed}`)
            //         .then((res) => res.data)
            //         .catch((e) => {
            //             console.log(e);
            //             const liveEvent: LiveEvent = {
            //                 city: "",
            //                 event_id: "",
            //                 inserted_at: 0,
            //                 lat: "",
            //                 long: "",
            //                 region: regionConfig.region,
            //                 timestamp: 0,
            //                 type: "",
            //             };
            //             return [liveEvent];
            //         });
            //
            //     if (events[0]) {
            //         const total = events.reduce((previous, current) => {
            //             return current.timestamp + previous;
            //         }, 0);
            //         const mean = total / events.length;
            //         setLatency({...latency, [regionConfig.region]: Math.round((new Date().getTime() - mean) / 1000)});
            //     }
            //     console.log(latency)
            // }
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

        setNewMoneyUs(
            events.reduce((prev, current) => {
                if (current.price) {
                    if (typeof current.price === "string") {
                        const replaced = Number(current.price.replaceAll('"', ""));
                        const numSafe = isNaN(replaced) ? 0 : replaced;
                        return prev + numSafe;
                    } else {
                        return prev + (isNaN(current.price) ? 0 : current.price);
                    }
                } else {
                    return prev;
                }
            }, 0)
        );

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

        setNewMoneyEu(
            events.reduce((prev, current) => {
                if (current.price) {
                    if (typeof current.price === "string") {
                        const replaced = Number(current.price.replaceAll('"', ""));
                        const numSafe = isNaN(replaced) ? 0 : replaced;
                        return prev + numSafe;
                    } else {
                        return prev + (isNaN(current.price) ? 0 : current.price);
                    }
                } else {
                    return prev;
                }
            }, 0)
        );

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

        setNewMoneyAu(
            events.reduce((prev, current) => {
                if (current.price) {
                    if (typeof current.price === "string") {
                        const replaced = Number(current.price.replaceAll('"', ""));
                        const numSafe = isNaN(replaced) ? 0 : replaced;
                        return prev + numSafe;
                    } else {
                        return prev + (isNaN(current.price) ? 0 : current.price);
                    }
                } else {
                    return prev;
                }
            }, 0)
        );

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
        const promise: Promise<void> = getEvents();

        await Promise.all([promiseAu, promiseEu, promiseUs, promise]);

        if ([newMoneyAu, newMoneyEu, newMoneyUs].find((money) => money !== 0)) {
            setMoney(money + newMoneyAu + newMoneyEu + newMoneyUs);
        }

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


    return (
        <>
            <Grid style={{
                position: "fixed",
                bottom: 200,
                padding: 10,
                zIndex: 2,
                width: "80%",
                height: 100,
                left: "20%"
            }}>
                <Grid.Col span={4} style={{color: "white", borderLeft: "4px solid white"}}>
                    <Text size="xl" color={"darkgrey"}>Sales per minute (USD)</Text>
                    <Text weight="bold" style={{fontSize: "xx-large"}}>$1,532,000</Text>
                </Grid.Col>
                <Grid.Col span={4} style={{color: "white", borderLeft: "4px solid white"}}>
                    <Text size="xl" color={"darkgrey"}>Add to cart per minute</Text>
                    <Text weight="bold" style={{fontSize: "xx-large"}}>15,867</Text>
                </Grid.Col>
                <Grid.Col span={4} style={{color: "white", borderLeft: "4px solid white"}}>
                    <Text size="xl" color={"darkgrey"}>Transactions per minute</Text>
                    <Text weight="bold" style={{fontSize: "xx-large"}}>110,045</Text>
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
                    <Grid.Col span={4} style={{color: "white"}}>
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
                    <Grid.Col span={4} style={{color: "white"}}>
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
                    <Grid.Col span={4} style={{color: "white"}}>
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
