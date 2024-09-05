import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function AddCategoryDialog(props) {
  const { open, setOpen, save } = props;
  const [value, setValue] = useState();

  const handleClose = () => {
    setOpen(false);
    setValue("");
  };
  const handleDialogSubmit = (event) => {
    event.preventDefault();
    save({ category: value });
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleDialogSubmit}>
        <DialogTitle>Add a new category</DialogTitle>
        <DialogContent>
          <TextField
            id="dialogue-category"
            label="category"
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
