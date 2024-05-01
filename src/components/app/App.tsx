import LayoutComponent from "../layout/layout";
import { QueryClient, QueryClientProvider } from "react-query";

const queryCilent = new QueryClient();

function App() {
  return (
    <div>
      <QueryClientProvider client={queryCilent}>
        <LayoutComponent />
      </QueryClientProvider>
    </div>
  );
}

export default App;
