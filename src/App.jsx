import "./App.css";
import { Container } from "@mui/material";
import NavBar from "./NavBar";
import Table from "./Table";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to="/slogans-app/" />;
  }
  return (
    <Container>
      <NavBar></NavBar>
      <Table></Table>
    </Container>
  );
}

export default App;
