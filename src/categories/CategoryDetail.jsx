import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

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
  }, [id, isAuthenticated, getAccessTokenSilently, navigate]);

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
    <Container style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Edit Category
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField label="ID" value={category.id} disabled fullWidth />
            <TextField
              label="Category Name"
              value={category.category || ""}
              onChange={handleChange}
              fullWidth
              required
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
              >
                Save
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
      )}

      <LoadingBackdrop open={saving || loading} />
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
}
