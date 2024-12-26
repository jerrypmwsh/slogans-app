// v2 of editing and visualizing experience
import React, { useState } from "react";
import { TextField, Autocomplete, Button, Box } from "@mui/material";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export default function SloganDetail() {
  const [textValue, setTextValue] = useState("");
  const [autoValue, setAutoValue] = useState(null);
  const [dateValue, setDateValue] = useState(Date.now());

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ textValue, autoValue, dateValue });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <TextField
        label="Text Input"
        variant="outlined"
        fullWidth
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
      />

      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        value={autoValue}
        onChange={(e, newValue) => setAutoValue(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Autocomplete"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker label="Date Picker" value={dayjs(dateValue)} />
      </LocalizationProvider>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
