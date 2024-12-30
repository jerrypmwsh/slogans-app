// v2 of editing and visualizing experience
import { useEffect, useState } from "react";
import { TextField, Autocomplete, Button, Box } from "@mui/material";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ErrorToast from "../ErrorToast";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function SloganDetail() {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [slogan, setSlogan] = useState();
  const [error, setError] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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

        const sloganJson = await slogansResponse.json();
        setSlogan({
          ...sloganJson,
          category: categoriesJson.find(
            (c) => c.category === sloganJson.category
          ),
          source: sourcesJson.find((src) => src.source === sloganJson.source),
        });
      } catch (e) {
        console.error(e);
        setError(e);
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
    console.log(requestPayload);

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
        setError({ message: response.text });
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  if (slogan === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <TextField
        label="Slogan"
        variant="outlined"
        fullWidth
        value={slogan.slogan}
        onChange={(e) =>
          setSlogan((prev) => ({ ...prev, slogan: e.target.value }))
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
            label="Autocomplete"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Autocomplete
        options={sourceOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.source
        }
        isOptionEqualToValue={(option, value) => option.source === value.source}
        value={slogan.source}
        onChange={(e, newValue) => {
          setSlogan((prev) => ({ ...prev, source: newValue }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Autocomplete"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <TextField
        label="source info"
        variant="outlined"
        fullWidth
        value={slogan.source_info}
        onChange={(e) =>
          setSlogan((prev) => ({ ...prev, source_info: e.target.value }))
        }
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      <ErrorToast error={error} setError={setError} />
      <ErrorToast error={error} setError={setError} />
    </Box>
  );
}
