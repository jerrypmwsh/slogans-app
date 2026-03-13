import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingBackdrop from "../LoadingBackdrop";
import { useSnackbar } from "notistack";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();

  const [category, setCategory] = useState({ category: "", id: -1 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/slogans-app/");
      return;
    }

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently({
          audience: "https://tresosos.com/slogans",
        });
        const response = await fetch(`${url}categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }
        const json = await response.json();
        setCategory(json);
      } catch (error) {
        console.error("Error fetching category:", error);
        enqueueSnackbar("Error fetching category: " + error.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, isAuthenticated, getAccessTokenSilently, navigate, enqueueSnackbar]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });

      const payload = {
        ...category,
        updated_date_time: new Date().toISOString(),
      };

      const response = await fetch(`${url}categories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to update category");
      }

      enqueueSnackbar("Category saved successfully", { variant: "success" });
      navigate("/slogans-app/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      enqueueSnackbar("Error updating category: " + error.message, {
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setCategory({ ...category, category: e.target.value });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Category
        </Typography>

        {!loading && (
          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={3}>
              <TextField
                label="ID"
                value={category.id}
                disabled
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Category Name"
                value={category.category || ""}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/slogans-app/categories")}
                  disabled={saving}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Paper>
      <LoadingBackdrop open={saving || loading} />
    </Container>
  );
}
