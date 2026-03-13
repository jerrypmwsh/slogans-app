// v2 of editing and visualizing experience
import { useEffect, useState, useRef } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import LoadingBackdrop from "../LoadingBackdrop";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function SloganDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getAccessTokenSilently } = useAuth0();

  const [slogan, setSlogan] = useState({
    slogan: "",
    company: "",
    source_info: "",
    category: null,
    source: null,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const processed = useRef(false);

  useEffect(() => {
    if (location.state?.snackbar && !processed.current) {
      enqueueSnackbar(location.state.snackbar, { variant: "success" });
      processed.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state, enqueueSnackbar]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently({
          audience: "https://tresosos.com/slogans",
        });

        const [slogansResponse, categoriesResponse, sourcesResponse] =
          await Promise.all([
            fetch(`${url}slogans/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
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

        if (slogansResponse.ok) {
          const sloganJson = await slogansResponse.json();
          setSlogan({
            ...sloganJson,
            category:
              categoriesJson.find((c) => c.category === sloganJson.category) ||
              null,
            source:
              sourcesJson.find((src) => src.source === sloganJson.source) ||
              null,
          });
        } else {
          enqueueSnackbar("Failed to fetch slogan", { variant: "error" });
        }
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to load data. Error: " + e.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getAccessTokenSilently, enqueueSnackbar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slogan.category || !slogan.source) {
      enqueueSnackbar("Category and Source are required", {
        variant: "warning",
      });
      return;
    }

    const requestPayload = {
      ...slogan,
      category_id: slogan.category.id,
      source_id: slogan.source.id,
      updated_date_time: Date.now(),
    };
    // Remove objects to send only IDs if backend expects that,
    // though the original code deleted them.
    // We'll follow original logic of deleting specific fields if needed
    // or just sending the payload as constructed.
    // The original code:
    delete requestPayload.category;
    delete requestPayload.source;

    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });

      const response = await fetch(`${url}slogans/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestPayload),
      });
      if (!response.ok) {
        console.log(response);
        enqueueSnackbar("Failed to save. Error: " + response.statusText, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Slogan Saved", {
          variant: "success",
          autoHideDuration: 2000,
        });
        navigate("/slogans-app/slogans");
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save. Error: " + error.message, {
        variant: "error",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Slogan
        </Typography>

        {!loading && (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Slogan"
                variant="outlined"
                fullWidth
                value={slogan.slogan}
                onChange={(e) =>
                  setSlogan((prev) => ({ ...prev, slogan: e.target.value }))
                }
                required
              />
              <TextField
                label="Company"
                variant="outlined"
                fullWidth
                value={slogan.company}
                onChange={(e) =>
                  setSlogan((prev) => ({ ...prev, company: e.target.value }))
                }
              />
              <Autocomplete
                options={categoryOptions}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.category
                }
                isOptionEqualToValue={(option, value) =>
                  option.category === value.category
                }
                value={slogan.category}
                onChange={(e, newValue) => {
                  setSlogan((prev) => ({ ...prev, category: newValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />
              <Autocomplete
                options={sourceOptions}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.source
                }
                isOptionEqualToValue={(option, value) =>
                  option.source === value.source
                }
                value={slogan.source}
                onChange={(e, newValue) => {
                  setSlogan((prev) => ({ ...prev, source: newValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Source"
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />
              <TextField
                label="Source Info"
                variant="outlined"
                fullWidth
                value={slogan.source_info}
                onChange={(e) =>
                  setSlogan((prev) => ({
                    ...prev,
                    source_info: e.target.value,
                  }))
                }
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/slogans-app/slogans")}
                >
                  Back
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Paper>
      <LoadingBackdrop open={loading} />
    </Container>
  );
}
