import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingBackdrop from "../LoadingBackdrop";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function CategoryCreate() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/slogans-app/");
    }
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    if (!category.trim()) {
        enqueueSnackbar("Category name is required", { variant: "warning" });
        return;
    }

    setSaving(true);
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
        const text = await response.text();
        throw new Error(text || "Failed to create category");
      }

      const newCategory = await response.json();
      enqueueSnackbar("Category created successfully", { variant: "success" });
      navigate(`/slogans-app/categories/${newCategory.id}`);
    } catch (error) {
      console.error("Error creating category:", error);
      enqueueSnackbar("Error creating category: " + error.message, {
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Create Category
      </Typography>

      <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              label="Category Name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              required
              autoFocus
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
              >
                Create
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/slogans-app/categories")}
                disabled={saving}
              >
                Back
              </Button>
            </Stack>
          </Stack>
        </Box>

      <LoadingBackdrop open={saving} />
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
}
