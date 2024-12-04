// CONTEXT
import { ThemeProvider } from "../context/ThemeContext";

// ROUTER
import Router from "../router/Router";

function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;