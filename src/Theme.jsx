import { createTheme } from "@mui/material/styles";

const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#00897b",
    },
    secondary: {
      main: "#f7f3f1",
    },
  },
};

export const appTheme = createTheme(themeOptions);
