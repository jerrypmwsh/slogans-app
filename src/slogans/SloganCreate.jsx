// v2 of editing and visualizing experience
import { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Container,
  Paper,
} from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function SloganCreate() {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [slogan, setSlogan] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
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

        setSlogan((prev) => ({
          ...prev,
          category: categoriesJson[0],
          source: sourcesJson[0],
        }));
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to save. Error: " + error, {
          variant: "error",
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestPayload = {
      ...slogan,
      category_id: slogan.category.id,
      source_id: slogan.source.id,
      updated_date_time: Date.now(),
    };
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
        console.log(response);
        enqueueSnackbar("Failed to save. Error: " + response.text, {
          variant: "error",
        });
      } else {
        const s = await response.json();
        navigate(`/slogans-app/slogans/${s.id}`);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to save. Error: " + error, {
        variant: "error",
      });
    }
  };
  if (categoryOptions.length === 0 || sourceOptions.length === 0) {
    return <div>Loading...</div>;
  }

  const formComponents = [
    <TextField
      label="Enter a slogan"
      variant="outlined"
      fullWidth
      value={slogan.slogan}
      onChange={(e) =>
        setSlogan((prev) => ({ ...prev, slogan: e.target.value }))
      }
      onFocus={(event) => {
        event.target.select();
      }}
    />,
    <TextField
      label="Company"
      variant="outlined"
      fullWidth
      value={slogan.company}
      onChange={(e) =>
        setSlogan((prev) => ({ ...prev, company: e.target.value }))
      }
    />,
    <Autocomplete
      options={categoryOptions}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.category
      }
      isOptionEqualToValue={(option, value) =>
        option.category === value.category
      }
      value={categoryOptions[0]}
      onChange={(e, newValue) => {
        setSlogan((prev) => ({ ...prev, category: newValue }));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Enter a category"
          variant="outlined"
          fullWidth
        />
      )}
    />,
    <Autocomplete
      options={sourceOptions}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.source
      }
      isOptionEqualToValue={(option, value) => option.source === value.source}
      value={sourceOptions[0]}
      onChange={(e, newValue) => {
        setSlogan((prev) => ({ ...prev, source: newValue }));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Enter a source"
          variant="outlined"
          fullWidth
        />
      )}
    />,
    <TextField
      label="source info"
      variant="outlined"
      fullWidth
      value={slogan.source_info}
      onChange={(e) =>
        setSlogan((prev) => ({ ...prev, source_info: e.target.value }))
      }
    />,
  ];

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignContent: "center",
          minHeight: "50vh",
          gap: 2,
          minWidth: "60vh",
        }}
      >
        {formComponents.map((fc) => (
          <Paper>{fc}</Paper>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        ,
      </Box>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </Container>
  );
}
