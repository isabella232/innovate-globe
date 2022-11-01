import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { GlobeAndPanel } from "./GlobeAndPanel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Charts } from "./Charts";
import Konami from 'react-konami-code';
import gif from './dancing-skelly.gif';

function App() {
  function easterEgg() {
    var imgDiv = document.createElement("div");
    imgDiv.style.position = "fixed";
    imgDiv.style.zIndex = "2";
    imgDiv.style.bottom = "40%";
    imgDiv.style.padding = "10px";
    imgDiv.style.left = "230%";
    imgDiv.style.width = "200%";
    imgDiv.style.transform = "scale(3)";

    var img = document.createElement("img");
    img.src = gif;
    imgDiv.appendChild(img);

    let root = document.getElementById("root")
    if (root != null) {
      root.appendChild(imgDiv);
    }
  }
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <GlobeAndPanel /> 
                <Charts />
                <Konami action={easterEgg}>
                  {"Hey, I'm an Easter Egg! Look at me!"}
                </Konami>
              </>
            }
          />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
}

export default App;
