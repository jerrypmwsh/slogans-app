import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function AddSourceDialog({ open, onClose, onSave }) {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source.trim()) {
      enqueueSnackbar("Source name is required", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });

      const response = await fetch(`${url}sources`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source }),
      });

      if (!response.ok) {
        enqueueSnackbar("Failed to create source. Error: " + response.statusText, {
          variant: "error",
        });
      } else {
        const newSource = await response.json();
        onSave(newSource);
        onClose();
        setSource(""); // Reset form
        enqueueSnackbar("Source created successfully!", { variant: "success" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to create source. Error: " + error.message, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSource("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add a new source</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="source"
            label="Source Name"
            type="text"
            fullWidth
            variant="outlined"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
