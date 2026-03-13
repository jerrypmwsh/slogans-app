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
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function SloganDialog({ open, onClose, onSave, sloganToEdit }) {
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();
  const [slogan, setSlogan] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const isEditing = !!sloganToEdit;

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const token = await getAccessTokenSilently({
            audience: "https://tresosos.com/slogans",
          });

          const [categoriesResponse, sourcesResponse] = await Promise.all([
            fetch(`${url}categories`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${url}sources`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const categoriesJson = await categoriesResponse.json();
          setCategoryOptions(categoriesJson);
          const sourcesJson = await sourcesResponse.json();
          setSourceOptions(sourcesJson);

          if (isEditing) {
            // Pre-populate for editing
            // The table provides flat data (category string, source string), but we need objects for Autocomplete
            // Or maybe the table provides objects? Let's check Slogans.jsx columns.
            // Slogans.jsx columns: field "category" is likely just the name string based on the data grid.
            // Wait, looking at Slogans.jsx: { field: "category", ... }
            // The fetchSlogans response returns flat objects or nested?
            // The original SloganDetail fetches specific slogan by ID, which likely returns IDs or names.
            // Let's assume the passed `sloganToEdit` matches the shape of the row in DataGrid.
            // If the DataGrid row has strings for category/source, we need to find the matching object in options.

            const matchedCategory = categoriesJson.find(
              (c) => c.category === sloganToEdit.category
            );
            const matchedSource = sourcesJson.find(
              (s) => s.source === sloganToEdit.source
            );

            setSlogan({
              ...sloganToEdit,
              category: matchedCategory || null,
              source: matchedSource || null,
            });
          } else {
            // Defaults for creation
            setSlogan({
              slogan: "",
              company: "",
              category: categoriesJson.length > 0 ? categoriesJson[0] : null,
              source: sourcesJson.length > 0 ? sourcesJson[0] : null,
              source_info: "",
            });
          }
        } catch (e) {
          console.error(e);
          enqueueSnackbar("Failed to load options. Error: " + e.message, {
            variant: "error",
          });
        }
      };

      fetchData();
    }
  }, [open, getAccessTokenSilently, enqueueSnackbar, isEditing, sloganToEdit]);

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

      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `${url}slogans/${slogan.id}` : `${url}slogans`;

      const response = await fetch(endpoint, {
        method: method,
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
        // If editing, the response might be empty or the updated object.
        // If creating, it's the new object.
        // Let's try to parse JSON, if it fails (empty body), use local state + ID?
        // Usually PUT returns the updated object or 204.
        // Original SloganDetail used PUT.

        let savedSlogan = {};
        if (response.status !== 204) {
             savedSlogan = await response.json();
        } else {
            savedSlogan = { ...slogan };
        }

        // Construct display object
        const displaySlogan = {
          ...savedSlogan,
          category: slogan.category?.category,
          source: slogan.source?.source,
        };

        onSave(displaySlogan);
        onClose();
        enqueueSnackbar(`Slogan ${isEditing ? "updated" : "created"} successfully!`, {
          variant: "success",
        });
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
        <DialogTitle>{isEditing ? "Edit Slogan" : "Add a new slogan"}</DialogTitle>
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
