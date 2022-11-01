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

    var img = document.createElement("img");
    img.style.height = "90vh";
    img.style.position = "fixed";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";

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
