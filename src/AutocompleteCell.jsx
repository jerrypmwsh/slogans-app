import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";

export default function AutocompleteCell(props) {
  const { id, value, field, colDef } = props;
  const apiRef = useGridApiContext();

  return (
    <Autocomplete
      value={value}
      options={colDef.valueOptions}
      renderInput={(params) => (
        <TextField {...params} variant="standard" size="small" />
      )}
      onChange={(event) => {
        apiRef.current.setEditCellValue({
          id,
          field,
          value: event.target.innerText,
        });
      }}
      fullWidth
      disableClearable
    ></Autocomplete>
  );
}
