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

export default function CategoryDialog({ open, onClose, onSave, categoryToEdit }) {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = !!categoryToEdit;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setCategory(categoryToEdit.category);
      } else {
        setCategory("");
      }
    }
  }, [open, isEditing, categoryToEdit]);

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

      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing
        ? `${url}categories/${categoryToEdit.id}`
        : `${url}categories`;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, updated_date_time: Date.now() }),
      });

      if (!response.ok) {
        enqueueSnackbar("Failed to save category. Error: " + response.statusText, {
          variant: "error",
        });
      } else {
        let savedCategory = {};
        if (response.status !== 204) {
            savedCategory = await response.json();
        } else {
            savedCategory = { ...categoryToEdit, category };
        }

        onSave(savedCategory);
        onClose();
        enqueueSnackbar(`Category ${isEditing ? "updated" : "created"} successfully!`, {
          variant: "success",
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save category. Error: " + error.message, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? "Edit Category" : "Add a new category"}</DialogTitle>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
