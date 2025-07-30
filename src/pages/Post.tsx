import { Divider, IconButton } from "@mui/material";
import MostStatsBar from "../components/post/MostStatsBar";
import TableStat from "../components/post/StatTable";
import { useGetPost } from "../hooks/post";
import { convertDateToStringDDMMYYYY } from "../util/transform";
import { useState } from "react";
import { Edit } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/auth";
import PostPageSkeleton from "../components/skeleton/PostPageSkeleton";

export default function Post() {
  const { data: post, isLoading: isPostLoading, isError } = useGetPost();
  const { data: user, isLoading: isUserLoading } = useUser();

  const [activeTableIndex, setActiveTableIndex] = useState(0);

  const navigate = useNavigate();

  if (isPostLoading || isUserLoading) {
    return <PostPageSkeleton />;
  }

  if (!post || isError) {
    return <Navigate to="/404" />;
  }

  const rows1 =
    post?.handicapMovements?.filter(
      (h) => h.type === "HDP" && h.ahSide === "HOME"
    ) || [];

  const rows2 =
    post?.handicapMovements?.filter(
      (h) => h.type === "HDP" && h.ahSide === "AWAY"
    ) || [];

  const rows3 = post?.handicapMovements?.filter((h) => h.type === "OU") || [];

  const handleSetActiveTableIndex = (index: number) => {
    setActiveTableIndex(index);
  };

  const isOwnPost = user?.posts.includes(post?.id as string);

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold flex items-start gap-2">
          {post?.title}{" "}
          {isOwnPost && (
            <IconButton onClick={() => navigate(`/post/${post?.id}/edit`)}>
              <Edit fontSize="small" />
            </IconButton>
          )}
        </h1>
        <p className="text-muted text-xs">
          Last updated{" "}
          {convertDateToStringDDMMYYYY(new Date(post?.updatedAt as string))} ,
          Created by {post?.author}
        </p>
        <p className="line-clamp-5 mt-2">{post?.description}</p>
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
      <div className="my-3 sm:my-6 flex justify-end"></div>
      <TableStat
        postId={post?.id as string}
        activeTableIndex={activeTableIndex}
        onSetActiveTableIndex={handleSetActiveTableIndex}
        tables={[
          { label: "Home Asian Handicap", rows: rows1 },
          { label: "Away Asian Handicap", rows: rows2 },
          { label: "O/U", rows: rows3 },
        ]}
      />
    </>
  );
}
