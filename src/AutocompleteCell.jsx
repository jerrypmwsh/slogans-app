import { useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";

export default function AutocompleteCell(props) {
  const { id, value, field, colDef, hasFocus, getOptionLabel } = props;
  const apiRef = useGridApiContext();

  const inputRef = useRef();
  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  const val = colDef.valueOptions.find(
    (element) => getOptionLabel(element) === value
  );

  return (
    <Autocomplete
      value={val}
      options={colDef.valueOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          size="small"
          inputRef={inputRef}
        />
      )}
      onChange={(event) => {
        apiRef.current.setEditCellValue({
          id,
          field,
          value: event.target.innerText,
        });
      }}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return getOptionLabel(option);
      }}
      isOptionEqualToValue={(option, value) => {
        if (typeof value === "string") {
          return value === getOptionLabel(option);
        } else {
          return getOptionLabel(option) === getOptionLabel(value);
        }
      }}
      fullWidth
      disableClearable
    ></Autocomplete>
  );
}
