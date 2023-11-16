export interface LiveEvent {
    city: string;
    event_id: string;
    inserted_at: number;
    lat: string;
    long: string;
    region: "us-east-1";
    timestamp: number;
    type: string;
    productAction?: string;
    price?: string | number;
}

export interface TimeBucketMetric {
    type: string;
    bucketTimestamp: string;
    count: string;
}

export const AWSRegionGeo = {
    "us-east-1": {
        lat: 37.926868,
        lng: -78.024902,
    },
    "eu-west-1": {
        lat: 53.350140,
        lng: 6.2603,
    },
    "ap-southeast-2": {
        lat: -33.865143,
        lng: 151.2099,
    },
};

export const envRegionMapping: any = {
    "dev": [
        {
            "region": "us-east-1",
            "lambdaEndpoint": `https://gdattsifnijqe42uhkuv4oi5nm0fhbxc.lambda-url.us-east-1.on.aws/?password=${localStorage.getItem(
                "pw"
            )}`
        },
        {
            "region": "eu-west-1",
            "lambdaEndpoint": `https://f3dgz4dpurrrasgkew3m3fjxni0gfjep.lambda-url.eu-west-1.on.aws/?password=${localStorage.getItem(
                "pw"
            )}`
        }
    ],
    "prd": [
        {
            "region": "us-east-1",
            "lambdaEndpoint": `https://rha5ieunhnmgc3d4xtsow4dj240mggtt.lambda-url.us-east-1.on.aws/?password=${localStorage.getItem(
                "pw"
            )}`
        },
        {
            "region": "eu-west-1",
            "lambdaEndpoint": `https://c6xdcpmacp66i4njcrrwatb73i0opcjr.lambda-url.eu-west-1.on.aws/?password=${localStorage.getItem(
                "pw"
            )}`
        },
        {
            "region": "ap-southeast-2",
            "lambdaEndpoint": `https://72fup7tch7frsprfdvbctvaiv40sommb.lambda-url.ap-southeast-2.on.aws/?password=${localStorage.getItem(
                "pw"
            )}`
        }
    ]
}

export const LambdaURLUsEast = `https://rha5ieunhnmgc3d4xtsow4dj240mggtt.lambda-url.us-east-1.on.aws/?password=${localStorage.getItem(
    "pw"
)}`;

export const LambdaURLEU = `https://c6xdcpmacp66i4njcrrwatb73i0opcjr.lambda-url.eu-west-1.on.aws/?password=${localStorage.getItem(
    "pw"
)}`;

export const LambdaURLAu = `https://72fup7tch7frsprfdvbctvaiv40sommb.lambda-url.ap-southeast-2.on.aws/?password=${localStorage.getItem(
    "pw"
)}`;
