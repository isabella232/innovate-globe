import { FunctionComponent } from "react";
import { useState } from "react";
import { AnimatedGlobe } from "./AnimatedGlobe";
import {
  Button,
  Checkbox,
  ColorInput,
  Drawer,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
} from "@mantine/core";
import {
  useQueryParams,
  BooleanParam,
  NumberParam,
  StringParam,
} from "use-query-params";

export const GlobeAndPanel: FunctionComponent = () => {
  const [query, setQuery] = useQueryParams({
    renderRings: BooleanParam,
    renderArcs: BooleanParam,
    animate: BooleanParam,
    rotate: BooleanParam,
    debug: BooleanParam,
    tickSpeed: NumberParam,
    numRings: NumberParam,
    flightTime: NumberParam,
    arcRelLength: NumberParam,
    ringRadius: NumberParam,
    ringSpeed: NumberParam,
    numAnimation: NumberParam,
    arcDashGap: NumberParam,
    arcStroke: NumberParam,
    arcAltitude: NumberParam,
    atmosphereColor: StringParam,
    atmosphereAltitude: NumberParam,
    eartImg: StringParam,
    discoMode: BooleanParam,
  });

  function force<T>(v: T | null | undefined, fallback: T): T {
    return v !== null && v !== undefined ? v : fallback;
  }

  const [renderRings, setRenderRings] = useState(
    force(query.renderRings, true)
  );
  const [renderArcs, setRenderArcs] = useState(force(query.renderArcs, true));

  const [animate, setAnimate] = useState(force(query.animate, true));
  const [rotate, setRotate] = useState(force(query.rotate, true));
  const [debug, setDebug] = useState(force(query.debug, false));
  const [tickSpeed, setTickSpeed] = useState(force(query.tickSpeed, 500));
  const [numRings, setNumRings] = useState(force(query.numRings, 1));
  const [flightTime, setFlightTime] = useState(force(query.flightTime, 2000));
  const [arcRelativeLength, setArcRelativeLength] = useState(
    force(query.arcRelLength, 0.5)
  );
  const [ringRadius, setRingRadius] = useState(force(query.ringRadius, 3));
  const [ringSpeed, setRingSpeed] = useState(force(query.ringSpeed, 5));
  const [numberOfAnimation, setNumberOfAnimation] = useState(
    force(query.numAnimation, 50)
  );
  const [arcDashGap, setArcDashGap] = useState(force(query.arcDashGap, 2));
  const [arcStroke, setArcStroke] = useState(force(query.arcStroke, 1));
  const [arcAltitudeAutoScale, setArcAltitudeAutoScale] = useState(
    force(query.arcAltitude, 0.5)
  );
  const [atmosphereColor, setAtmosphereColor] = useState(
    force(query.atmosphereColor, "rgb(255,255,255)")
  );
  const [atmosphereAltitude, setAtmosphereAltitude] = useState(
    force(query.atmosphereAltitude, 0.2)
  );
  const [earthImg, setEarthImg] = useState(
    force(query.eartImg, "//unpkg.com/three-globe/example/img/earth-night.jpg")
  );
  const [discoMode, setDiscoMode] = useState(force(query.discoMode, false));
  const [opened, setOpened] = useState(false);

  return (
    <div className="App">
      <Group
        position="center"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <Button onClick={() => setOpened(true)}>Debug menu</Button>
      </Group>
      <Drawer
        overlayOpacity={0}
        opened={opened}
        onClose={() => setOpened(false)}
        title="Debug menu"
        padding="xl"
        size="xl"
        style={{ zIndex: 1 }}
      >
        <Stack>
          <ScrollArea style={{ height: "80vh" }} offsetScrollbars>
            <Checkbox
              label="Render rings"
              checked={renderRings}
              onChange={() => {
                setRenderRings(!renderRings);
                setQuery({ renderRings: !renderRings });
              }}
            />
            <Checkbox
              label="Render arcs"
              checked={renderArcs}
              onChange={() => {
                setRenderArcs(!renderArcs);
                setQuery({ renderArcs: !renderArcs });
              }}
            />
            <Checkbox
              label="Play animation"
              checked={animate}
              onChange={() => {
                setAnimate(!animate);
                setQuery({ animate: !animate });
              }}
            />
            <Checkbox
              label="Auto rotate"
              checked={rotate}
              onChange={() => {
                setRotate(!rotate);
                setQuery({ rotate: !rotate });
              }}
            />
            <Checkbox
              label="Debug"
              checked={debug}
              onChange={() => {
                setDebug(!debug);
                setQuery({ debug: !debug });
              }}
            />
            <NumberInput
              label="Tick speed"
              value={tickSpeed}
              onChange={(e) => {
                setTickSpeed(e!);
                setQuery({ tickSpeed: e! });
              }}
            />
            <NumberInput
              label="Number of animations"
              value={numberOfAnimation}
              onChange={(e) => {
                setNumberOfAnimation(e!);
                setQuery({ numAnimation: e! });
              }}
            />
            <NumberInput
              label="Flight time"
              value={flightTime}
              onChange={(e) => {
                setFlightTime(e!);
                setQuery({ flightTime: e! });
              }}
            />
            <NumberInput
              label="Arc relative length"
              value={arcRelativeLength}
              onChange={(e) => {
                setArcRelativeLength(e!);
                setQuery({ arcRelLength: e! });
              }}
              precision={2}
              step={0.1}
              min={0}
            />
            <NumberInput
              label="Arc dash gap"
              value={arcDashGap}
              onChange={(e) => {
                setArcDashGap(e!);
                setQuery({ arcDashGap: e! });
              }}
              precision={2}
              step={0.1}
              min={0}
            />
            <NumberInput
              label="Arc stroke"
              value={arcStroke}
              onChange={(e) => {
                setArcStroke(e!);
                setQuery({ arcStroke: e! });
              }}
            />
            <NumberInput
              label="Arc altitude"
              value={arcAltitudeAutoScale}
              onChange={(e) => {
                setArcAltitudeAutoScale(e!);
                setQuery({ arcAltitude: e! });
              }}
              precision={2}
              step={0.1}
              min={0}
            />
            <NumberInput
              label="Ring radius"
              value={ringRadius}
              onChange={(e) => {
                setRingRadius(e!);
                setQuery({ ringRadius: e! });
              }}
            />
            <NumberInput
              label="Ring speed"
              value={ringSpeed}
              onChange={(e) => {
                setRingSpeed(e!);
                setQuery({ ringSpeed: e! });
              }}
            />
            <NumberInput
              label="Number of rings"
              value={numRings}
              onChange={(e) => {
                setNumRings(e!);
                setQuery({ numRings: e! });
              }}
            />
            <ColorInput
              label="Atmosphere color"
              value={atmosphereColor}
              onChange={(e) => {
                setAtmosphereColor(e);
                setQuery({ atmosphereColor: e });
              }}
            />
            <NumberInput
              label="Atmosphere altitude"
              value={atmosphereAltitude}
              onChange={(e) => {
                setAtmosphereAltitude(e!);
                setQuery({ atmosphereAltitude: e! });
              }}
              precision={2}
              step={0.1}
              min={0}
            />
            <Select
              label="Earth image"
              onChange={(e) => {
                setEarthImg(e!);
                setQuery({ eartImg: e! });
              }}
              value={earthImg}
              data={[
                {
                  value: "//unpkg.com/three-globe/example/img/earth-day.jpg",
                  label: "Day",
                },
                {
                  value: "//unpkg.com/three-globe/example/img/earth-night.jpg",
                  label: "Night",
                },
                {
                  value:
                    "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
                  label: "Blue marble",
                },
                {
                  value: "//unpkg.com/three-globe/example/img/earth-dark.jpg",
                  label: "Dark",
                },
                {
                  value:
                    "//unpkg.com/three-globe/example/img/earth-topology.png",
                  label: "Topology",
                },
                {
                  value: "//unpkg.com/three-globe/example/img/earth-water.png",
                  label: "Water",
                },
              ]}
            ></Select>
            <Checkbox
              label="Hollow globe"
              checked={discoMode}
              onChange={() => {
                setDiscoMode(!discoMode);
                setQuery({
                  discoMode: !discoMode,
                });
              }}
            ></Checkbox>
          </ScrollArea>
        </Stack>
      </Drawer>

      <AnimatedGlobe
        autoRotate={rotate}
        renderRings={renderRings}
        renderArcs={renderArcs}
        anim={animate}
        debug={debug}
        tickSpeed={tickSpeed}
        numRings={numRings}
        flightTime={flightTime}
        arcRelativeLength={arcRelativeLength}
        ringRadius={ringRadius}
        ringSpeed={ringSpeed}
        numberOfAnimation={numberOfAnimation}
        arcDashGap={arcDashGap}
        earthImg={earthImg}
        arcStroke={arcStroke}
        atmosphereColor={atmosphereColor}
        atmosphereAltitude={atmosphereAltitude}
        arcAltitudeAutoScale={arcAltitudeAutoScale}
        discoMode={discoMode}
      />
    </div>
  );
};
