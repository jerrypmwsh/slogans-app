import "./App.css";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <Table></Table>;
}

export default App;
