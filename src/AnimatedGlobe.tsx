import { FunctionComponent, useEffect, useRef, useState } from "react";
import ReactGlobeGl, { GlobeMethods } from "react-globe.gl";
import globeData from "./data/admin-data.json";
import {
  AWSRegionGeo,
  LambdaURLAu,
  LambdaURLCaCentral,
  LambdaURLEU,
  LambdaURLUsEast,
  LiveEvent,
} from "./Events";
import { uniqBy } from "lodash";
import * as THREE from "three";

interface ArcData {
  filter?: any;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  timestamp: number;
}

interface RingData {
  lat: number;
  lng: number;
  color: string;
  timestamp: number;
}

interface LabelData {
  lat: number;
  lng: number;
  text: string;
  timestamp: number;
}

interface AnimatedGlobeProps {
  renderRings: boolean;
  renderArcs: boolean;
  renderLabels: boolean;
  anim: boolean;
  autoRotate: boolean;
  debug: boolean;
  tickSpeed: number;
  numRings: number;
  flightTime: number;
  arcRelativeLength: number;
  ringRadius: number;
  ringSpeed: number;
  numberOfAnimation: number;
  arcDashGap: number;
  arcStroke: number;
  atmosphereAltitude: number;
  arcAltitudeAutoScale: number;
  env: string;
}

export const AnimatedGlobe: FunctionComponent<AnimatedGlobeProps> = ({
  renderRings,
  renderArcs,
  renderLabels,
  anim,
  autoRotate,
  debug,
  tickSpeed,
  numRings,
  flightTime,
  arcRelativeLength,
  ringRadius,
  ringSpeed,
  arcDashGap,
  arcStroke,
  arcAltitudeAutoScale,
    env
}) => {
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const [ringsData, setRingsData] = useState<RingData[]>([]);
  const [labelsData, setLabelsData] = useState<LabelData[]>([]);
  const [animationTick, setAnimationTick] = useState(0);
  const [geometryCount, setGeometryCount] = useState(0);

  const globeRef = useRef<GlobeMethods>();

  const emitArc = async () => {
    const resUsEast = (await (
      await fetch(`${LambdaURLUsEast}&last=${tickSpeed}`)
    ).json()) as LiveEvent[];
    const resEu: LiveEvent[] = (await (
      await fetch(`${LambdaURLEU}&last=${tickSpeed}`)
    ).json()) as LiveEvent[];
    const resAu: LiveEvent[] = (await (
      await fetch(`${LambdaURLAu}&last=${tickSpeed}`)
    ).json()) as LiveEvent[];
    const resCaCentral: LiveEvent[] = (await (
      await fetch(`${LambdaURLCaCentral}&last=${tickSpeed}`)
    ).json()) as LiveEvent[];

    type validRegions = "us-east-1" | "eu-west-1" | "ap-southeast-2" | "ca-central-1";

    const resTotal: Record<validRegions, LiveEvent[]> = {
      "us-east-1": resUsEast,
      "eu-west-1": resEu,
      "ap-southeast-2": resAu,
      "ca-central-1": resCaCentral,
    };

    const datum = Object.entries(resTotal).flatMap(([region, liveEvents]) => {
      return liveEvents.map((liveEvent) => {
        const lattitude = Number(liveEvent.lat);
        const longitude = Number(liveEvent.lng);
        const timestamp = new Date().getTime();

        return {
          arc: {
            startLat: lattitude,
            endLat: AWSRegionGeo[region as validRegions].lat,
            startLng: longitude,
            endLng: AWSRegionGeo[region as validRegions].lng,
            color: "#8f7000",
            timestamp,
          } as ArcData,
          sourceRing: {
            lat: lattitude,
            lng: longitude,
            timestamp,
          } as RingData,
          label: {
            lat: lattitude,
            lng: longitude,
            text: liveEvent.city,
            timestamp,
          } as LabelData,
        };
      });
    });

    const arcs = datum.map((d) => d.arc);
    const sourceRings = datum.map((d) => d.sourceRing);
    const labels = renderLabels ? datum.map((d) => d.label) : [];
    const evictionTimeForArcs = flightTime;
    const evictionTimeForRings = flightTime * arcRelativeLength;
    const evictionTimeForLabels = flightTime;

    setArcsData((arcsData: ArcData[]) => {
      const now = Date.now();
      const filteredArcs = arcsData.filter((d) => {
        return Math.abs(d.timestamp - now) <= evictionTimeForArcs;
      });
      return [...filteredArcs, ...arcs];
    });

    setRingsData((ringsData: RingData[]) => {
      const filteredRings = ringsData.filter((d) => {
        return (
          Math.abs(d.timestamp - new Date().getTime()) <= evictionTimeForRings
        );
      });
      return [...filteredRings, ...sourceRings];
    });

    setLabelsData((labelsData: LabelData[]) => {
      const filteredLabels = labelsData.filter((d) => {
        return (
          Math.abs(d.timestamp - new Date().getTime()) <=
            evictionTimeForLabels &&
          d.text !== "null" &&
          d.text !== null
        );
      });
      return uniqBy([...filteredLabels, ...labels], (d) => d.text).map((d) => {
        return {
          ...d,
          text: d.text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        };
      });
    });

    setAnimationTick(animationTick + 1);
    if (debug && animationTick % 10 === 0 && animationTick !== 0) {
      const sceneJSON = globeRef.current?.scene().toJSON();
      setGeometryCount(sceneJSON.geometries.length);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      emitArc();
    }, tickSpeed);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationTick]);

  if (globeRef.current) {
    (globeRef.current.controls() as any).autoRotate = autoRotate;
    (globeRef.current.controls() as any).autoRotateSpeed = 0.6;
  }

  if (!anim) {
    globeRef.current?.pauseAnimation();
  } else {
    globeRef.current?.resumeAnimation();
  }

  const material = new THREE.MeshPhongMaterial({
    color: '#9dabf2',
    emissive: '#062d70'
  });


  return (
    <ReactGlobeGl
      labelsData={
        debug
          ? [
              { lat: 0, lng: 0, text: `Tick: ${animationTick.toString()}` },
              {
                lat: 2,
                lng: 0,
                text: `Arcs: ${arcsData.length}`,
              },
              {
                lat: 4,
                lng: 0,
                text: `Rings: ${ringsData.length}`,
              },
              {
                lat: 6,
                lng: 0,
                text: `Memory: ${Math.round(
                  (window.performance as any).memory.usedJSHeapSize / 1048576
                )} MB / ${Math.round(
                  (window.performance as any).memory.jsHeapSizeLimit / 1048576
                )} MB`,
              },
              {
                lat: 8,
                lng: 0,
                text: `ThreeJS Geometry count: ${
                  geometryCount === 0 ? "..." : geometryCount
                }`,
              },
              {
                lat: 10,
                lng: 0,
                text: `Labels: ${labelsData.length}`,
              },
            ].concat(labelsData)
          : labelsData
      }
      labelSize={() => 1}
      labelAltitude={0}
      labelResolution={2}
      labelIncludeDot={false}
      labelsTransitionDuration={0}
      ref={globeRef}
      arcsData={renderArcs ? arcsData : []}
      arcColor={"color"}
      arcDashLength={arcRelativeLength}
      arcDashGap={arcDashGap}
      arcDashInitialGap={1}
      arcDashAnimateTime={flightTime}
      arcsTransitionDuration={0}
      arcAltitudeAutoScale={arcAltitudeAutoScale}
      arcStroke={arcStroke === 1 ? null : arcStroke}
      ringsData={renderRings ? ringsData : []}
      ringColor={"color"}
      ringResolution={100}
      ringMaxRadius={ringRadius}
      ringPropagationSpeed={ringSpeed}
      ringRepeatPeriod={(flightTime * arcRelativeLength) / numRings}
      globeMaterial={material}
      backgroundColor={"#181d3a"}
      hexPolygonsData={[...globeData.features]}
      hexPolygonColor={() => '#34ad95'}
      hexPolygonMargin={0.3}
      showGlobe={true}
      htmlElementsData={[
        {
          ...AWSRegionGeo["us-east-1"],
          size: 1,
        },
        {
          ...AWSRegionGeo["eu-west-1"],
          size: 1,
        },
        {
          ...AWSRegionGeo["ap-southeast-2"],
          size: 1,
        },
        {
          ...AWSRegionGeo["ca-central-1"],
          size: 1,
        },
      ].concat([])}
      htmlElement={() => {
        const el = document.createElement("img");
        el.setAttribute("src", "/favicon.png");
        return el;
      }}
    />
  );
};
