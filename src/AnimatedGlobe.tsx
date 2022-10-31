import { FunctionComponent, useEffect, useRef, useState } from "react";
import ReactGlobeGl, { GlobeMethods } from "react-globe.gl";

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

interface AnimatedGlobeProps {
  renderRings: boolean;
  renderArcs: boolean;
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
  earthImg: string;
  atmosphereColor: string;
  atmosphereAltitude: number;
  arcAltitudeAutoScale: number;
}

export const AnimatedGlobe: FunctionComponent<AnimatedGlobeProps> = ({
  renderRings,
  renderArcs,
  anim,
  autoRotate,
  debug,
  tickSpeed,
  numRings,
  flightTime,
  arcRelativeLength,
  ringRadius,
  ringSpeed,
  numberOfAnimation,
  arcDashGap,
  earthImg,
  arcStroke,
  atmosphereColor,
  atmosphereAltitude,
  arcAltitudeAutoScale,
}) => {
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const [ringsData, setRingsData] = useState<RingData[]>([]);
  const [animationTick, setAnimationTick] = useState(0);
  const globeRef = useRef<GlobeMethods>();

  const emitArc = async () => {
    const datum = [...Array(numberOfAnimation).keys()].map(() => {
      const startLat = (Math.random() - 0.5) * 180;
      const startLng = (Math.random() - 0.5) * 360;
      const endLat = 37.926868;
      const endLng = -78.024902;
      const color = `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%,${
        85 + 10 * Math.random()
      }%`;

      const arc = {
        startLat,
        startLng,
        endLat,
        endLng,
        color,
        timestamp: new Date().getTime(),
      };
      const sourceRing = {
        lat: startLat,
        lng: startLng,
        color,
        timestamp: new Date().getTime(),
      };

      return {
        arc,
        sourceRing,
      };
    });

    const arcs = datum.map((d) => d.arc);
    const sourceRings = datum.map((d) => d.sourceRing);
    const evictionTimeForArcs = flightTime * 2;
    const evictionTimeForRings = flightTime * arcRelativeLength;

    setArcsData((arcsData: ArcData[]) => [...arcsData, ...arcs]);
    setTimeout(
      () =>
        setArcsData((arcsDataToEvict: ArcData[]) => {
          return arcsDataToEvict.filter((d) => {
            return (
              Math.abs(d.timestamp - new Date().getTime()) <=
              evictionTimeForArcs
            );
          });
        }),
      evictionTimeForArcs
    );

    setRingsData((ringsData: RingData[]) => [...ringsData, ...sourceRings]);
    setTimeout(
      () =>
        setRingsData((ringsDataToEvict: RingData[]) => {
          return ringsDataToEvict.filter((d) => {
            return (
              Math.abs(d.timestamp - new Date().getTime()) <=
              evictionTimeForRings
            );
          });
        }),
      evictionTimeForRings
    );

    setAnimationTick(animationTick + 1);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await emitArc();
    }, tickSpeed);
    return () => {
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationTick]);

  if (globeRef.current) {
    (globeRef.current.controls() as any).autoRotate = autoRotate;
  }

  if (!anim) {
    globeRef.current?.pauseAnimation();
  } else {
    globeRef.current?.resumeAnimation();
  }

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
            ]
          : []
      }
      labelSize={() => 1}
      labelResolution={2}
      labelIncludeDot={false}
      labelsTransitionDuration={0}
      labelColor={() => "rgba(255, 165, 0, 0.75)"}
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
      backgroundImageUrl="/night-sky.png"
      globeImageUrl={earthImg}
      atmosphereColor={atmosphereColor}
      atmosphereAltitude={atmosphereAltitude}
    />
  );
};