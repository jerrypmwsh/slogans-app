import { useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";

export default function AutocompleteCell(props) {
  const { id, value, field, colDef, hasFocus } = props;
  const apiRef = useGridApiContext();

  const inputRef = useRef();
  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  return (
    <Autocomplete
      value={value}
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
      fullWidth
      disableClearable
    ></Autocomplete>
  );
}
