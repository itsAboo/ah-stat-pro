import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../api/user";
import { useForm } from "react-hook-form";
import { useSnackbar } from "../../context/SnackbarContext";

export default function ChangePasswordSection() {
  type FormValues = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  type FormErrors = {
    message?: string;
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { snackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
    reset,
    watch,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      reset();

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      snackbar({
        message: "Password updated successfully",
      });
    },
    onError: (error: FormErrors) => {
      if (
        error &&
        typeof error === "object" &&
        ("newPassword" in error ||
          "oldPassword" in error ||
          "confirmPassword" in error)
      ) {
        Object.entries(error).forEach(([field, message]) => {
          setError(field as keyof FormValues, {
            type: "server",
            message: message,
          });
        });
      } else if (error instanceof Error) {
        snackbar({
          message: error.message,
          severity: "error",
        });
      } else {
        snackbar({
          message: "An unknown error occurred",
          severity: "error",
        });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    if (newPassword === oldPassword) {
      setError("newPassword", {
        type: "validate",
        message: "New password must be different from current password",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("newPassword", {
        type: "validate",
        message: "New password and confirm password must be the same",
      });
      setError("confirmPassword", {
        type: "validate",
        message: "New password and confirm password must be the same",
      });
      return;
    }

    mutate(data);
  };

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (newPassword && confirmPassword) {
      clearErrors(["newPassword", "confirmPassword"]);
    }
  }, [newPassword, confirmPassword, clearErrors]);

  return (
    <Paper className="p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Change password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="sm:w-[70%] space-y-4">
        <FormControl fullWidth error={!!errors.oldPassword}>
          <FormLabel>Old password</FormLabel>
          <TextField
            label="*required"
            margin="dense"
            type={showPassword.oldPassword ? "text" : "password"}
            error={!!errors.oldPassword}
            {...register("oldPassword", {
              required: "Old password is required",
              minLength: {
                value: 6,
                message: "Must be at least 6 characters",
              },
            })}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          oldPassword: !prev.oldPassword,
                        }))
                      }
                      edge="end"
                    >
                      {showPassword.oldPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormHelperText>{errors.oldPassword?.message}</FormHelperText>
        </FormControl>

        <FormControl margin="dense" fullWidth error={!!errors.newPassword}>
          <FormLabel>New password</FormLabel>
          <TextField
            label="*required"
            margin="dense"
            type={showPassword.newPassword ? "text" : "password"}
            error={!!errors.newPassword}
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Must be at least 6 characters",
              },
            })}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          newPassword: !prev.newPassword,
                        }))
                      }
                      edge="end"
                    >
                      {showPassword.newPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormHelperText>{errors.newPassword?.message}</FormHelperText>
        </FormControl>

        <FormControl margin="dense" fullWidth error={!!errors.confirmPassword}>
          <FormLabel>Confirm password</FormLabel>
          <TextField
            label="*required"
            margin="dense"
            type={showPassword.confirmPassword ? "text" : "password"}
            error={!!errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              minLength: {
                value: 6,
                message: "Must be at least 6 characters",
              },
            })}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirmPassword: !prev.confirmPassword,
                        }))
                      }
                      edge="end"
                    >
                      {showPassword.confirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
        </FormControl>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            disabled={
              !isDirty ||
              isPending ||
              !!errors.oldPassword ||
              !!errors.newPassword ||
              !!errors.confirmPassword
            }
            sx={{ width: "60px", height: "40px" }}
          >
            {isPending ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </div>
      </form>
    </Paper>
  );
}
