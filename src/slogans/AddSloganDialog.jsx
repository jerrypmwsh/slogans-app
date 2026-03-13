import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  Stack,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function AddSloganDialog({ open, onClose, onSave }) {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const [slogan, setSlogan] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories and sources when the dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const token = await getAccessTokenSilently({
            audience: "https://tresosos.com/slogans",
          });

          const [categoriesResponse, sourcesResponse] = await Promise.all([
            fetch(`${url}categories`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${url}sources`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

          const categoriesJson = await categoriesResponse.json();
          setCategoryOptions(categoriesJson);
          const sourcesJson = await sourcesResponse.json();
          setSourceOptions(sourcesJson);

          // Reset slogan state with defaults
          setSlogan({
            slogan: "",
            company: "",
            category: categoriesJson.length > 0 ? categoriesJson[0] : null,
            source: sourcesJson.length > 0 ? sourcesJson[0] : null,
            source_info: "",
          });
        } catch (e) {
          console.error(e);
          enqueueSnackbar("Failed to load options. Error: " + e.message, {
            variant: "error",
          });
        }
      };

      fetchData();
    }
  }, [open, getAccessTokenSilently, enqueueSnackbar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestPayload = {
      ...slogan,
      category_id: slogan.category?.id,
      source_id: slogan.source?.id,
      updated_date_time: Date.now(),
    };
    // Remove objects to send only IDs
    delete requestPayload.category;
    delete requestPayload.source;

    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });

      const response = await fetch(`${url}slogans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        enqueueSnackbar("Failed to save. Error: " + response.statusText, {
          variant: "error",
        });
      } else {
        const newSlogan = await response.json();
        // Construct the full object to return to the parent (including the category/source objects for display)
        const displaySlogan = {
            ...newSlogan,
            category: slogan.category?.category,
            source: slogan.source?.source,
        };

        onSave(displaySlogan);
        onClose();
        enqueueSnackbar("Slogan created successfully!", { variant: "success" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save. Error: " + error.message, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add a new slogan</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Enter a slogan"
              variant="outlined"
              fullWidth
              autoFocus
              value={slogan.slogan || ""}
              onChange={(e) =>
                setSlogan((prev) => ({ ...prev, slogan: e.target.value }))
              }
            />
            <TextField
              label="Company"
              variant="outlined"
              fullWidth
              value={slogan.company || ""}
              onChange={(e) =>
                setSlogan((prev) => ({ ...prev, company: e.target.value }))
              }
            />
            <Autocomplete
              options={categoryOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.category || ""
              }
              isOptionEqualToValue={(option, value) =>
                option.id === value?.id
              }
              value={slogan.category || null}
              onChange={(e, newValue) => {
                setSlogan((prev) => ({ ...prev, category: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              options={sourceOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.source || ""
              }
              isOptionEqualToValue={(option, value) =>
                option.id === value?.id
              }
              value={slogan.source || null}
              onChange={(e, newValue) => {
                setSlogan((prev) => ({ ...prev, source: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Source"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <TextField
              label="Source Info"
              variant="outlined"
              fullWidth
              value={slogan.source_info || ""}
              onChange={(e) =>
                setSlogan((prev) => ({ ...prev, source_info: e.target.value }))
              }
            />
          </Stack>
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
