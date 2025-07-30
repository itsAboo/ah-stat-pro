import {
  Avatar,
  Button,
  CircularProgress,
  Paper,
  TextField,
} from "@mui/material";

import { useUpdateName, useUser } from "../../hooks/auth";
import { FormEvent, useState } from "react";
import MyAccountSectionSkeleton from "../skeleton/my-account/MyAccountSectionSkeleton";

export default function MyAccountSection() {
  const { data: user, isLoading } = useUser();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState({
    value: "",
    error: "",
  });

  const { mutate: updateName, isPending: isUpdateNamePending } = useUpdateName({
    onSuccess: () => setIsEditing(false),
  });

  const handleUpdateName = (e: FormEvent) => {
    e.preventDefault();
    if (name.value.length < 6) {
      setName((prev) => ({
        ...prev,
        error: "Name must be at least 6 characters",
      }));
      return;
    }
    updateName({ name: name.value });
  };

  const handleChange = (val: string) => {
    setName((prev) => ({ ...prev, value: val, error: "" }));
  };

  if (isLoading) {
    return <MyAccountSectionSkeleton />;
  }

  return (
    <Paper className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Account</h1>
      <div className="flex items-start gap-8">
        <Avatar
          sx={{
            width: {
              sm: 128,
            },
            height: {
              sm: 128,
            },
            fontSize: {
              sm: 36,
            },
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <div className="w-full flex flex-col space-y-2">
          <div>
            <h2 className="font-semibold">Username</h2>
            <TextField
              sx={{
                "& .MuiInput-underline.Mui-disabled:before": {
                  borderBottomStyle: "solid !important",
                },
              }}
              variant="standard"
              disabled
              fullWidth
              margin="dense"
              placeholder={user?.username || ""}
            />
          </div>
          <form onSubmit={handleUpdateName}>
            <h2 className="font-semibold">Name</h2>
            <TextField
              helperText={name.error}
              error={!!name.error}
              onChange={(e) => handleChange(e.target.value)}
              disabled={isUpdateNamePending}
              onFocus={() => setIsEditing(true)}
              sx={{
                "& .MuiInput-underline.Mui-disabled:before": {
                  borderBottomStyle: "solid !important",
                },
              }}
              variant="standard"
              fullWidth
              margin="dense"
              placeholder={user?.name || ""}
            />
            {isEditing && (
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdateNamePending || !!name.error}
                  startIcon={
                    isUpdateNamePending ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : undefined
                  }
                  variant="contained"
                  size="small"
                >
                  update
                </Button>
              </div>
            )}
          </form>
          <div className="flex justify-between my-2">
            <h2 className="font-semibold">Posts</h2>
            <p>{user?.posts.length}</p>
          </div>
        </div>
      </div>
    </Paper>
  );
}
