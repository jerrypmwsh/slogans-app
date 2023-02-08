import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid, Typography } from "@mui/material";

export default function LoadingBackdrop({ open }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Grid>
        <CircularProgress color="inherit" />
        <Typography variant="h6">Loading...</Typography>
      </Grid>
    </Backdrop>
  );
}
