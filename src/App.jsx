import "./App.css";
import Table from "./Table";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to="/slogans-app/" />;
  }
  return <Table></Table>;
}

export default App;
