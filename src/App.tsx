import { useState } from "react";
import { AnimatedGlobe } from "./AnimatedGlobe";

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

  return (
    <div className="App">
      {new URL(document.location.href).searchParams.get("admin") === "1" && (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            padding: 10,
            zIndex: 9999,
            backgroundColor: "white",
          }}
        >
          <div>
            <label>
              Render rings
              <input
                type="checkbox"
                checked={renderRings}
                onChange={() => setRenderRings(!renderRings)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Render arcs
              <input
                type="checkbox"
                checked={renderArcs}
                onChange={() => setRenderArcs(!renderArcs)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Animation
              <input
                type="checkbox"
                checked={animate}
                onChange={() => setAnimate(!animate)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Auto rotate
              <input
                type="checkbox"
                checked={rotate}
                onChange={() => setRotate(!rotate)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Debug
              <input
                type="checkbox"
                checked={debug}
                onChange={() => setDebug(!debug)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Tick speed
              <input
                type="number"
                value={tickSpeed}
                onChange={(e) => setTickSpeed(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Number of animations
              <input
                type="number"
                value={numberOfAnimation}
                onChange={(e) => setNumberOfAnimation(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Flight time
              <input
                type="number"
                value={flightTime}
                onChange={(e) => setFlightTime(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Arc relative length
              <input
                type="text"
                value={arcRelativeLength}
                onChange={(e) => setArcRelativeLength(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Arc dash gap
              <input
                type="text"
                value={arcDashGap}
                onChange={(e) => setArcDashGap(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Arc stroke
              <input
                type="number"
                value={arcStroke}
                onChange={(e) => setArcStroke(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Arc altitude
              <input
                type="number"
                value={arcAltitudeAutoScale}
                onChange={(e) =>
                  setArcAltitudeAutoScale(Number(e.target.value))
                }
              ></input>
            </label>
          </div>
          <div>
            <label>
              Ring radius
              <input
                type="text"
                value={ringRadius}
                onChange={(e) => setRingRadius(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Ring speed
              <input
                type="text"
                value={ringSpeed}
                onChange={(e) => setRingSpeed(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Number of rings
              <input
                type="number"
                value={numRings}
                onChange={(e) => setNumRings(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Atmosphere color
              <input
                type="color"
                value={atmosphereColor}
                onChange={(e) => setAtmosphereColor(e.target.value)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Atmosphere altitude
              <input
                type="text"
                value={atmosphereAltitude}
                onChange={(e) => setAtmosphereAltitude(Number(e.target.value))}
              ></input>
            </label>
          </div>
          <div>
            <label>
              Earth
              <select onChange={(e) => setEarthImg(e.target.value)}>
                <option value="//unpkg.com/three-globe/example/img/earth-day.jpg">
                  Day
                </option>
                <option value="//unpkg.com/three-globe/example/img/earth-night.jpg">
                  Night
                </option>
                <option value="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg">
                  Blue marble
                </option>
                <option value="//unpkg.com/three-globe/example/img/earth-dark.jpg">
                  Dark
                </option>
                <option value="//unpkg.com/three-globe/example/img/earth-topology.png">
                  Topology
                </option>
                <option value="//unpkg.com/three-globe/example/img/earth-water.png">
                  Water
                </option>
              </select>
            </label>
          </div>
        </div>
      )}

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
