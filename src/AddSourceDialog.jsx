import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function AddSourceDialog(props) {
  const { open, setOpen, save } = props;
  const [value, setValue] = useState();

  const handleClose = () => {
    setOpen(false);
    setValue("");
  };
  const handleDialogSubmit = (event) => {
    event.preventDefault();
    save({ source: value });
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleDialogSubmit}>
        <DialogTitle>Add a new source</DialogTitle>
        <DialogContent>
          <TextField
            id="dialogue-source"
            label="source"
            type="text"
            variant="standard"
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
