import { Alert, Snackbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function ErrorToast({ error, setError }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError({});
  };
  return (
    <Snackbar
      color="primary"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={Object.keys(error).length > 0}
      onClose={handleClose}
    >
      <Alert severity="error" onClose={handleClose}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {error.message}
        </Typography>
      </Alert>
    </Snackbar>
  );
}
