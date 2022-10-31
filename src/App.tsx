import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { GlobeAndPanel } from "./GlobeAndPanel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Charts } from "./Charts";

function App() {
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <GlobeAndPanel /> <Charts />
              </>
            }
          />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
}

export default App;
