import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface IConfirmModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  title: string;
  description?: string;
}

const ConfirmModal = ({
  open,
  setOpen,
  onConfirm,
  title,
  description,
}: IConfirmModalProps) => {
  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog
      keepMounted={false}
      container={document.body}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleConfirm}>
          Ok
        </Button>
        <Button
          sx={(theme) => ({
            color: theme.palette.appGrey.main,
          })}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
