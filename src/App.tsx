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

function App() {
  const [renderRings, setRenderRings] = useState(true);
  const [renderArcs, setRenderArcs] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [rotate, setRotate] = useState(true);
  const [debug, setDebug] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(500);
  const [numRings, setNumRings] = useState(1);
  const [flightTime, setFlightTime] = useState(2000);
  const [arcRelativeLength, setArcRelativeLength] = useState(0.5);
  const [ringRadius, setRingRadius] = useState(3);
  const [ringSpeed, setRingSpeed] = useState(5);
  const [numberOfAnimation, setNumberOfAnimation] = useState(50);
  const [arcDashGap, setArcDashGap] = useState(2);
  const [arcStroke, setArcStroke] = useState(1);
  const [arcAltitudeAutoScale, setArcAltitudeAutoScale] = useState(0.5);
  const [atmosphereColor, setAtmosphereColor] = useState("rgb(255,255,255)");
  const [atmosphereAltitude, setAtmosphereAltitude] = useState(0.2);
  const [earthImg, setEarthImg] = useState(
    "//unpkg.com/three-globe/example/img/earth-night.jpg"
  );
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
              onChange={() => setRenderRings(!renderRings)}
            />
            <Checkbox
              label="Render arcs"
              checked={renderArcs}
              onChange={() => setRenderArcs(!renderArcs)}
            />
            <Checkbox
              label="Play animation"
              checked={animate}
              onChange={() => setAnimate(!animate)}
            />
            <Checkbox
              label="Auto rotate"
              checked={rotate}
              onChange={() => setRotate(!rotate)}
            />
            <Checkbox
              label="Debug"
              checked={debug}
              onChange={() => setDebug(!debug)}
            />
            <NumberInput
              label="Tick speed"
              value={tickSpeed}
              onChange={(e) => setTickSpeed(e!)}
            />
            <NumberInput
              label="Number of animations"
              value={numberOfAnimation}
              onChange={(e) => setNumberOfAnimation(e!)}
            />
            <NumberInput
              label="Flight time"
              value={flightTime}
              onChange={(e) => setFlightTime(e!)}
            />
            <NumberInput
              label="Arc relative length"
              value={arcRelativeLength}
              onChange={(e) => setArcRelativeLength(e!)}
              precision={2}
              step={0.1}
              min={0}
            />
            <NumberInput
              label="Arc dash gap"
              value={arcDashGap}
              onChange={(e) => setArcDashGap(e!)}
              precision={2}
              step={0.1}
              min={0}
            />
            <NumberInput
              label="Arc stroke"
              value={arcStroke}
              onChange={(e) => setArcStroke(e!)}
            />
            <NumberInput
              label="Arc altitude"
              value={arcAltitudeAutoScale}
              onChange={(e) => setArcAltitudeAutoScale(e!)}
              precision={2}
              step={0.1}
              min={0}
            />
            <NumberInput
              label="Ring radius"
              value={ringRadius}
              onChange={(e) => setRingRadius(e!)}
            />
            <NumberInput
              label="Ring speed"
              value={ringSpeed}
              onChange={(e) => setRingSpeed(e!)}
            />
            <NumberInput
              label="Number of rings"
              value={numRings}
              onChange={(e) => setNumRings(e!)}
            />
            <ColorInput
              label="Atmosphere color"
              value={atmosphereColor}
              onChange={(e) => setAtmosphereColor(e)}
            />
            <NumberInput
              label="Atmosphere altitude"
              value={atmosphereAltitude}
              onChange={(e) => setAtmosphereAltitude(e!)}
              precision={2}
              step={0.1}
              min={0}
            />
            <Select
              label="Earth image"
              onChange={(e) => setEarthImg(e!)}
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
      />
    </div>
  );
}

export default App;
