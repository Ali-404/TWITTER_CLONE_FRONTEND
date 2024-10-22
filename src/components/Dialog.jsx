/* eslint-disable react/prop-types */
import { Button, DialogActions, Dialog as DialogMUI, DialogTitle } from "@mui/material";

export default function Dialog({ onClose, open }) {

    // onClose(confermed = false)
  
    return (
      <DialogMUI hideBackdrop className="bg-black bg-opacity-30"  onClose={onClose} open={open} >
        <DialogTitle>Are you sure you want to delete this post ?</DialogTitle>
        <DialogActions>
            <Button variant="contained" color="error" onClick={() => onClose(true)} >DELETE</Button>
            <Button variant="contained" onClick={() => onClose(false)}  >Cancel</Button>
        </DialogActions>
      </DialogMUI>
    );
  }
  
