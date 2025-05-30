import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import App from "./App.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
);
