import { Backdrop, CircularProgress } from "@mui/material";

interface BackdropProgressProps {
  open: boolean;
}

export default function BackdropProgress({ open }: BackdropProgressProps) {
  return (
    <Backdrop sx={(theme) => ({ zIndex: theme.zIndex.modal + 1 })} open={open}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}
