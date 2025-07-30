import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Pagination,
  Paper,
} from "@mui/material";
import { useDeletePost, useGetMyPosts } from "../../hooks/post";
import { convertDateToStringDDMMYYYY } from "../../util/transform";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../UI/ConfirmDialog";
import { ChangeEvent, useState } from "react";
import BackdropProgress from "../UI/BackdropProgress";
import MyPostsCardSkeleton from "../skeleton/my-account/MyPostsCardSkeleton";

export default function MyPostsSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: posts, isLoading } = useGetMyPosts({
    page,
    maxPerPage: 10,
  });

  const { mutate: deletePost, isPending: isDeletePostPending } =
    useDeletePost();

  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    navigate(`/post/${id}/edit`);
  };

  const handleShowConfirmDelete = (postId: string) => {
    setSelectedPostId(postId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedPostId) {
      throw new Error("Post id not found");
    }
    deletePost({ postId: selectedPostId });
  };

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <Paper className="p-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">My posts</h1>
        <Box display="flex" flexDirection="column" sx={{ flex: 1 }} gap={2}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <MyPostsCardSkeleton key={i} />
            ))
          ) : posts?.posts && posts.posts?.length > 0 ? (
            posts.posts.map((post, i) => (
              <Card key={i} sx={{ position: "relative" }}>
                <CardActionArea
                  onClick={() => navigate(`/post/${post.id}`)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <CardContent>
                    <div className="leading-tight mb-2">
                      <h1 className="text-2xl font-semibold">{post.title}</h1>
                      <p className="text-xs text-muted">
                        Last updated{" "}
                        {convertDateToStringDDMMYYYY(
                          new Date(post.updatedAt as string)
                        )}
                      </p>
                    </div>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ position: "absolute", top: 0, right: 0 }}>
                  <IconButton onClick={() => handleNavigate(post.id!)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleShowConfirmDelete(post.id!)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))
          ) : (
            <p className="text-muted italic text-center">
              You have no posts{" "}
              <Link className="text-primary" to={"/create"}>
                Click here
              </Link>{" "}
              to create
            </p>
          )}
        </Box>
        <div className="w-full flex justify-center my-4">
          <Pagination
            onChange={handleChangePage}
            count={posts?.pageCount}
            page={page}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </Paper>
      <ConfirmModal
        open={showConfirm}
        setOpen={setShowConfirm}
        onConfirm={handleConfirmDelete}
        title="Are you sure ?"
        description="Are you sure you want to delete this post? This action cannot be undone"
      />
      {isDeletePostPending && <BackdropProgress open={isDeletePostPending} />}
    </>
  );
}
