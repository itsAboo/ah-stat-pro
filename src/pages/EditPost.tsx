import MostStatsBar from "../components/post/MostStatsBar";
import TableStat from "../components/post/StatTable";
import { useDeletePost, useEditPost, useGetPost } from "../hooks/post";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddHandicapModal from "../components/edit-post/AddHandicapModal";
import { useEffect, useMemo, useState } from "react";
import { convertDateToStringDDMMYYYY } from "../util/transform";
import { Delete, Edit, MoreHoriz, ViewList } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmModal from "../components/UI/ConfirmDialog";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import BackdropProgress from "../components/UI/BackdropProgress";
import { useUser } from "../hooks/auth";
import PostPageSkeleton from "../components/skeleton/PostPageSkeleton";

const formSchema = z.object({
  title: z
    .string()
    .min(6, { message: "Title must contain at least 6 characters" }),
  description: z.string().optional(),
  access: z.enum(["public", "private"]).optional(),
});

type PostFormData = z.infer<typeof formSchema>;

export default function EditPost() {
  const { data: post, isLoading: isPostLoading } = useGetPost();
  const { data: user, isLoading: isUserLoading } = useUser();

  const [ahModalOpen, setAhModalOpen] = useState(false);

  const [activeTableIndex, setActiveTableIndex] = useState(0);

  const [showDeleteButtons, setShowDeleteButtons] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [editing, setEditing] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!user && !!post && !user?.posts.includes(post?.id as string)) {
      navigate("/404", { replace: true });
    }
  }, [navigate, user?.posts, post?.id, post, user]);

  const { mutate: updatePost, isPending: isUpdatePostPending } = useEditPost({
    onSuccess: () => {
      setEditing(false);
    },
  });

  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    onSuccess: () => navigate("/"),
  });

  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    reset,
    control,
  } = useForm<PostFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        description: post.description ?? "",
        access: post.access,
      });
    }
  }, [post, reset]);

  const handleOpenMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  const rows1 = useMemo(() => {
    return (
      post?.handicapMovements?.filter(
        (h) => h.type === "HDP" && h.ahSide === "HOME"
      ) || []
    );
  }, [post]);

  const rows2 = useMemo(() => {
    return (
      post?.handicapMovements?.filter(
        (h) => h.type === "HDP" && h.ahSide === "AWAY"
      ) || []
    );
  }, [post]);

  const rows3 = useMemo(() => {
    return post?.handicapMovements?.filter((h) => h.type === "OU") || [];
  }, [post]);

  const rows = useMemo(() => [rows1, rows2, rows3], [rows1, rows2, rows3]);

  useEffect(() => {
    if (rows[activeTableIndex].length === 0) {
      setShowDeleteButtons(false);
    }
  }, [activeTableIndex, rows]);

  if (isPostLoading || isUserLoading) {
    return <PostPageSkeleton />;
  }

  if (!post) {
    return <Navigate to="/404" />;
  }

  const handleCloseAhModal = () => {
    setAhModalOpen(false);
  };

  const handleSetActiveTableIndex = (index: number) => {
    setActiveTableIndex(index);
  };

  const handleSetEditing = () => {
    setEditing((prev) => !prev);
    handleCloseMore();
  };

  const handleUpdateForm = (data: PostFormData) => {
    updatePost({
      postId: post?.id as string,
      title: data.title,
      description: data.description,
      access: data.access,
    });
  };

  const handleShowConfirmDelete = () => {
    setAnchorEl(null);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    const postId = params.postId;
    if (!postId) {
      throw new Error("Post id not found");
    }
    deletePost({ postId });
  };

  const moreOpen = Boolean(anchorEl);
  const morePopoverId = moreOpen ? "more-popover" : undefined;

  return (
    <>
      <div
        className={`mb-4 flex ${
          editing && "flex-col-reverse"
        } justify-between ${editing ? "items-end" : "items-start"}`}
      >
        {editing ? (
          <form
            className="flex flex-col w-full"
            onSubmit={handleSubmit(handleUpdateForm)}
          >
            <FormControl error={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <TextField
                disabled={isUpdatePostPending}
                error={!!errors.title}
                id="title"
                {...register("title")}
              />
              <FormHelperText>
                {errors.title?.message || "At least 6 characters"}
              </FormHelperText>
            </FormControl>
            <FormControl margin="normal" error={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <TextField
                disabled={isUpdatePostPending}
                error={!!errors.description}
                id="description"
                {...register("description")}
              />
              <FormHelperText>
                {errors.description?.message || "Optional"}
              </FormHelperText>
            </FormControl>
            <FormControl margin="normal" error={!!errors.access} fullWidth>
              <InputLabel id="access-label">Access</InputLabel>
              <Controller
                name="access"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="access-label" label="Access">
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.access?.message || "Post accessibility"}
              </FormHelperText>
            </FormControl>
            <div className="w-full flex justify-end gap-2">
              <Button
                startIcon={
                  isUpdatePostPending ? (
                    <CircularProgress size={20} />
                  ) : undefined
                }
                disabled={!isDirty || isUpdatePostPending}
                variant="contained"
                type="submit"
              >
                Update
              </Button>
              <Button
                disabled={isUpdatePostPending}
                onClick={() => {
                  setEditing(false);
                  reset();
                }}
                type="button"
              >
                cancel
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold">{post?.title}</h1>
            <p className="text-muted text-xs">
              Last updated{" "}
              {convertDateToStringDDMMYYYY(new Date(post?.updatedAt as string))}{" "}
              , Created by {post?.author}
            </p>
            <p className="line-clamp-5 mt-2">{post?.description}</p>
          </div>
        )}

        <div>
          <IconButton onClick={handleOpenMore}>
            <MoreHoriz fontSize="large" />
          </IconButton>
          <Menu
            id={morePopoverId}
            open={moreOpen}
            anchorEl={anchorEl}
            onClose={handleCloseMore}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleSetEditing}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem onClick={() => navigate(`/post/${post.id}/edit/access`)}>
              <ListItemIcon>
                <ViewList />
              </ListItemIcon>
              Access List
            </MenuItem>
            <MenuItem onClick={handleShowConfirmDelete}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </div>
      </div>
      <Divider
        sx={{
          borderColor: "primary.main",
          borderBottomWidth: "3px",
          my: {
            xs: 2,
            sm: 4,
          },
        }}
      />
      <MostStatsBar
        mostHomeWin={post?.mostHomeWin}
        mostAwayWin={post?.mostAwayWin}
        mostOUWin={post?.mostOUWin}
      />
      <div className="my-6 flex justify-between">
        <Button
          disabled={rows[activeTableIndex].length === 0}
          color="success"
          sx={{ color: "white", opacity: showDeleteButtons ? 0.7 : 1 }}
          variant="contained"
          onClick={() => setShowDeleteButtons((prev) => !prev)}
        >
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.currentTarget.blur();
            setAhModalOpen((prev) => !prev);
          }}
          variant="contained"
        >
          Add Handicap
        </Button>
      </div>
      <TableStat
        showDeleteButtons={showDeleteButtons}
        key={post?.id}
        postId={post?.id as string}
        editable
        tables={[
          { label: "Home Asian Handicap", rows: rows1 },
          { label: "Away Asian Handicap", rows: rows2 },
          { label: "O/U", rows: rows3 },
        ]}
        onSetActiveTableIndex={handleSetActiveTableIndex}
        activeTableIndex={activeTableIndex}
      />
      <AddHandicapModal
        activeTableIndex={activeTableIndex}
        onSetActiveTableIndex={handleSetActiveTableIndex}
        postId={post?.id as string}
        open={ahModalOpen}
        onClose={handleCloseAhModal}
      />
      <ConfirmModal
        onConfirm={handleConfirmDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Are you sure ?"
        description="Are you sure you want to delete this post? This action cannot be undone"
      />
      {isDeletePostPending && <BackdropProgress open={isDeletePostPending} />}
    </>
  );
}
