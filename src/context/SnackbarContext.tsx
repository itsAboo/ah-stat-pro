import { Alert, Slide, Snackbar, SnackbarCloseReason } from "@mui/material";
import { createContext, useContext, useState, ReactNode } from "react";

interface ISnackBar {
  id: string;
  open: boolean;
  severity?: "error" | "info" | "success" | "warning";
  message?: string;
  autoHideDuration?: number;
}

interface SnackbarInput {
  severity?: "error" | "info" | "success" | "warning";
  message?: string;
  autoHideDuration?: number;
}

interface SnackbarContextType {
  snackbar: (props: SnackbarInput) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbars, setSnackbars] = useState<ISnackBar[]>([]);

  const handleClose = (id: string) => {
    setSnackbars((prev) =>
      prev.map((snackbar) =>
        snackbar.id === id ? { ...snackbar, open: false } : snackbar
      )
    );
  };

  const handleExited = (id: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  };

  const snackbar = (props: SnackbarInput) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newSnackbar: ISnackBar = {
      id,
      open: true,
      severity: "success",
      autoHideDuration: 3000,
      ...props,
    };
    setSnackbars((prev) => [...prev, newSnackbar]);
  };

  return (
    <SnackbarContext.Provider value={{ snackbar }}>
      {children}
      {snackbars.map((item, index) => (
        <Snackbar
          key={item.id}
          open={item.open}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          autoHideDuration={item.autoHideDuration}
          onClose={(_, reason?: SnackbarCloseReason) => {
            if (reason === "clickaway") return;
            handleClose(item.id);
          }}
          slots={{
            transition: Slide,
          }}
          slotProps={{
            transition: {
              direction: "left",
              onExited: () => handleExited(item.id),
            },
          }}
          sx={{
            bottom: `${16 + index * 70}px !important`,
          }}
        >
          <Alert
            onClose={() => handleClose(item.id)}
            severity={item.severity}
            variant="filled"
            sx={{ width: "100%", color: "#ffffff" }}
          >
            {item.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
}
