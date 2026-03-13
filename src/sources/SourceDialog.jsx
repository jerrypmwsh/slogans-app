import React, { useState, useEffect } from "react";
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

export default function SourceDialog({ open, onClose, onSave, sourceToEdit }) {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = !!sourceToEdit;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setSource(sourceToEdit.source);
      } else {
        setSource("");
      }
    }
  }, [open, isEditing, sourceToEdit]);

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

      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing
        ? `${url}sources/${sourceToEdit.id}`
        : `${url}sources`;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source, updated_date_time: Date.now() }),
      });

      if (!response.ok) {
        enqueueSnackbar("Failed to save source. Error: " + response.statusText, {
          variant: "error",
        });
      } else {
        let savedSource = {};
         if (response.status !== 204) {
            savedSource = await response.json();
        } else {
            savedSource = { ...sourceToEdit, source };
        }

        onSave(savedSource);
        onClose();
        enqueueSnackbar(`Source ${isEditing ? "updated" : "created"} successfully!`, {
          variant: "success",
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save source. Error: " + error.message, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? "Edit Source" : "Add a new source"}</DialogTitle>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
