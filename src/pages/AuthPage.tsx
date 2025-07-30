import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  isCharacterAndNumber,
  isMaxLength,
  isMinLength,
} from "../util/validate";
import { useAuth } from "../hooks/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AuthPage() {
  const params = useParams();

  const [formInput, setFormInput] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { error: mutateError, mutate, isPending, reset } = useAuth();

  useEffect(() => {
    if (mutateError) {
      setError((prev) => ({ ...prev, username: mutateError.message }));
    }
  }, [mutateError]);

  useEffect(() => {
    setError({ username: "", password: "", name: "" });
  }, [params.action]);

  if (params.action !== "signin" && params.action !== "signup") {
    return <Navigate to="/auth/signup" />;
  }

  const handleChange = (
    field: "username" | "password" | "name",
    val: string
  ) => {
    if (mutateError) {
      setError({ username: "", password: "", name: "" });
      reset();
    }

    if (error[field]) {
      setError((prev) => ({ ...prev, [field]: "" }));
    }
    setFormInput((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let formIsValid = true;

    if (
      !isCharacterAndNumber(formInput.username) ||
      !isMinLength(formInput.username, 6)
    ) {
      setError((prev) => ({
        ...prev,
        username:
          "Username must be at least 6 characters and contain only letters and numbers.",
      }));
      formIsValid = false;
    }

    if (!isMinLength(formInput.password, 6)) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      formIsValid = false;
    }

    if (!isMaxLength(formInput.name, 10)) {
      setError((prev) => ({
        ...prev,
        name: "Name must be below 10 characters",
      }));
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    mutate({ ...formInput, action: params.action as "signup" | "signin" });
  };

  return (
    <div className="border-2 border-primary sm:mt-8 rounded-md w-full sm:max-w-[350px] mx-auto p-4">
      <h1 className="text-2xl">
        {params.action === "signin" ? "Sign in" : "Sign up"}
      </h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" error={!!error.username}>
          <FormLabel>Username</FormLabel>
          <TextField
            id="username"
            margin="dense"
            error={!!error.username}
            onChange={(e) => handleChange("username", e.target.value)}
            label="*required"
            disabled={isPending}
          />
          <FormHelperText>
            {error.username || "Enter your username (letters and numbers only)"}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth error={!!error.password}>
          <FormLabel>Password</FormLabel>
          <TextField
            sx={{
              "& input::-ms-reveal": {
                display: "none !important",
              },
              "& input::-ms-clear": {
                display: "none !important",
              },
            }}
            disabled={isPending}
            id="password"
            margin="dense"
            label="*required"
            type={showPassword ? "text" : "password"}
            error={!!error.password}
            onChange={(e) => handleChange("password", e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormHelperText>
            {error.password || "Must be at least 6 characters"}
          </FormHelperText>
        </FormControl>
        {params.action === "signup" && (
          <FormControl margin="dense" fullWidth error={!!error.name}>
            <FormLabel>Name</FormLabel>
            <TextField
              id="name"
              error={!!error.name}
              onChange={(e) => handleChange("name", e.target.value)}
              label="optional"
              type="text"
              margin="dense"
              disabled={isPending}
            />
            <FormHelperText>
              {error.name || "Maximum 10 characters allowed"}
            </FormHelperText>
          </FormControl>
        )}

        <div className="my-4">
          {params.action === "signin" ? (
            <p className="text-center">
              <span> Don't have any account ? </span>
              <Link className="text-primary hover:opacity-70" to="/auth/signup">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-center">
              <span>Already have an account ? </span>
              <Link className="text-primary hover:opacity-70" to="/auth/signin">
                Sign In
              </Link>
            </p>
          )}
        </div>

        <Button
          disabled={isPending || !!error.username || !!error.password}
          type="submit"
          sx={{ mt: 2, height: "40px" }}
          fullWidth
          variant="contained"
        >
          {isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : params.action === "signin" ? (
            "Sign in"
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </div>
  );
}
