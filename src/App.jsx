import "./App.css";
import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { appTheme } from "./Theme";
import NavBar from "./NavBar";
import Table from "./Table";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <Container>
        <NavBar></NavBar>
        <Table></Table>
      </Container>
    </ThemeProvider>
  );
}

export default App;
