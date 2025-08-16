import { useEffect, useState } from "react";
import { useUser } from "../../hooks/auth";
import { useGetPosts } from "../../hooks/post";
import PostListCard from "./PostListCard";
import ConfirmModal from "../UI/ConfirmDialog";
import {
  useGetAccessesRequest,
  useSendAccessRequest,
} from "../../hooks/access-request";
import BackdropProgress from "../UI/BackdropProgress";
import { useGetPostAccesses } from "../../hooks/post-access";
import { Button, Pagination } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import PostListCardSkeleton from "../skeleton/PostListCardSkeleton";

export default function PostList() {
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const { data: posts, isLoading: isPostLoading } = useGetPosts({
    maxPerPage: 9,
    page,
  });
  const { data: user, isLoading: isUserLoading } = useUser();
  const { mutate: sendAccessRequest, isPending } = useSendAccessRequest();
  const { data: postAccesses, isLoading: isPostAccessesLoading } =
    useGetPostAccesses(user?.id as string);
  const { data: accessRequest, isLoading: isAccessRequestLoading } =
    useGetAccessesRequest();

  useEffect(() => {
    if (searchParams.get("page") && !isNaN(Number(searchParams.get("page")))) {
      setPage(Number(searchParams.get("page")));
    }
  }, [searchParams]);

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
    setPage(value);
  };

  const handleConfirmSendRequestAccess = (postId: string) => {
    sendAccessRequest({
      postId,
      userId: user && user.id ? user.id : "",
    });
  };

  const handleOpenConfirm = (postId: string) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  const isLoading =
    isPostLoading ||
    isUserLoading ||
    isPostAccessesLoading ||
    isAccessRequestLoading;

  return (
    <>
      {!isLoading && (
        <div className="flex justify-end items-center">
          <Button component={Link} to="/create" variant="contained">
            Create
          </Button>
        </div>
      )}
      <div className="mt-2 sm:mt-3 flex flex-col min-h-[calc(100vh-200px)]">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:place-items-center lg:grid-cols-3 gap-2 lg:gap-4 p-2 items-start">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-full sm:max-w-[345px] h-[280px]">
                    <PostListCardSkeleton />
                  </div>
                ))
              : posts?.posts.map((post) => (
                  <div
                    key={post.id}
                    className="w-full sm:max-w-[345px] h-[280px]"
                  >
                    <PostListCard
                      id={post.id!}
                      title={post.title}
                      description={post.description}
                      author={post.author}
                      mostWin={post.mostWin}
                      mostDraw={post.mostDraw}
                      mostLost={post.mostLost}
                      updatedAt={post.updatedAt}
                      access={post.access!}
                      user={user}
                      onOpenConfirm={handleOpenConfirm}
                      postAccess={
                        postAccesses?.find(
                          (pa) =>
                            pa.postId === post.id && pa.userId === user?.id
                        ) || null
                      }
                      accessRequests={
                        accessRequest?.filter(
                          (ac) =>
                            ac.requesterId === user?.id &&
                            ac.postId === post.id &&
                            !user?.posts?.includes(post.id)
                        ) || null
                      }
                    />
                  </div>
                ))}
          </div>
        </div>

        <div className="p-4 flex justify-center">
          <Pagination
            onChange={handleChangePage}
            count={posts?.pageCount}
            page={page}
            variant="outlined"
            shape="rounded"
          />
        </div>

        <ConfirmModal
          open={open}
          setOpen={setOpen}
          onConfirm={() => handleConfirmSendRequestAccess(selectedPostId!)}
          title="This Post is private"
          description="You need permission from the owner to view this post. Send a request to gain access."
        />
        <BackdropProgress open={isPending} />
      </div>
    </>
  );
}
