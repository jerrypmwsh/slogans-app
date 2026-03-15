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
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
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
            const matchedCategory = categoriesJson.find(
              (c) => c.category === sloganToEdit.category,
            );
            const matchedSource = sourcesJson.find(
              (s) => s.source === sloganToEdit.source,
            );

            setSlogan({
              ...sloganToEdit,
              category: matchedCategory || null,
              source: matchedSource || null,
            });
          } else {
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
    delete requestPayload.category;
    delete requestPayload.source;

    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });

      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing
        ? `${url}slogans/${slogan.id}`
        : `${url}slogans`;

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
        let savedSlogan = {};
        if (response.status !== 204) {
          savedSlogan = await response.json();
        } else {
          savedSlogan = { ...slogan };
        }

        const displaySlogan = {
          ...savedSlogan,
          category: slogan.category?.category,
          source: slogan.source?.source,
        };

        onSave(displaySlogan);
        onClose();
        enqueueSnackbar(
          `Slogan ${isEditing ? "updated" : "created"} successfully!`,
          {
            variant: "success",
          },
        );
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

  const handleInsertDate = () => {
    setSlogan((prev) => ({
      ...prev,
      source_info: dayjs().format("MMM D, YYYY [@] h:mm A"),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? "Edit Slogan" : "Add a new slogan"}
        </DialogTitle>
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
              isOptionEqualToValue={(option, value) => option.id === value?.id}
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
              isOptionEqualToValue={(option, value) => option.id === value?.id}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Insert current date/time">
                      <IconButton onClick={handleInsertDate} edge="end">
                        <AccessTimeIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
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
