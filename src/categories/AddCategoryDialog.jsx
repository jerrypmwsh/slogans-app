import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function AddCategoryDialog({ open, onClose, onSave }) {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) {
      enqueueSnackbar("Category name is required", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });

      const response = await fetch(`${url}categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        enqueueSnackbar(
          "Failed to create category. Error: " + response.statusText,
          {
            variant: "error",
          },
        );
      } else {
        const newCategory = await response.json();
        onSave(newCategory);
        onClose();
        setCategory(""); // Reset form
        enqueueSnackbar("Category created successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to create category. Error: " + error.message, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategory("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add a new category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="category"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
