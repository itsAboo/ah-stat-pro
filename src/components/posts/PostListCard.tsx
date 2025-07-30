import {
  LockOutline,
  Public,
  LockClock,
  Verified,
  ManageAccounts,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { AccessRequest, MostStatDetail, PostAccess, User } from "../../types";
import { convertDateToStringDDMMYYYY } from "../../util/transform";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../../util/auth";
import React from "react";

const Separate = <span className="mx-2">|</span>;

interface PostListCardProps {
  id: string;
  title: string;
  description?: string;
  author?: string;
  updatedAt?: string;
  mostWin?: MostStatDetail;
  mostDraw?: MostStatDetail;
  mostLost?: MostStatDetail;
  access: "public" | "private";
  user?: User | null | undefined;
  onOpenConfirm?: (postId: string) => void;
  postAccess: PostAccess | null;
  accessRequests: AccessRequest[] | null;
}

export default React.memo(function PostListCard(props: PostListCardProps) {
  const [isNotAllow, setIsNotAllow] = useState(
    () => props.access === "private"
  );

  const navigate = useNavigate();

  const handleNavigateToPost = () => {
    navigate(`/post/${props.id}`);
  };

  const handleNavigateWithSendAccess = () => {
    if (!props.user) {
      navigate("/auth/signin");
    } else if (props.accessRequests?.some((ac) => ac.status === "pending")) {
      return;
    }
    props.onOpenConfirm?.(props.id);
  };

  useEffect(() => {
    if (props.user) {
      setIsNotAllow(() => {
        return (
          props.access === "private" &&
          !props.user?.accessiblePostIds?.includes(props.id) &&
          !props.user?.posts.includes(props.id) &&
          !!props.user &&
          !!getToken() &&
          !props.postAccess
        );
      });
    } else {
      setIsNotAllow(true);
    }
  }, [props.user, props.id, props.access, props.title, navigate, props.postAccess]);

  const accessIcon = () => {
    if (props.user?.posts.includes(props.id)) return <ManageAccounts />;
    if (props.accessRequests?.some((ac) => ac.status === "pending"))
      return <LockClock />;
    if (props.accessRequests?.some((ac) => ac.status === "approved"))
      return <Verified />;
    if (props.access === "private") return <LockOutline />;
    return <Public />;
  };

  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <CardActionArea
        onClick={
          isNotAllow ? handleNavigateWithSendAccess : handleNavigateToPost
        }
        sx={{ height: "100%" }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top Section */}
          <Box>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Box>
                <p className="leading-tight font-bold line-clamp-2">
                  {props.title}
                </p>
                <Typography
                  variant="body2"
                  fontStyle="italic"
                  fontSize={12}
                  color="text.secondary"
                >
                  Last updated{" "}
                  {props.updatedAt
                    ? convertDateToStringDDMMYYYY(props.updatedAt)
                    : "N/A"}
                </Typography>
              </Box>
              {accessIcon()}
            </Box>

            <Divider />

            <CardContent sx={{ pt: 1 }}>
              <p className="text-sm leading-tight line-clamp-3">
                {props.description}
              </p>

              <Box mt={1} className="text-sm">
                {props.mostWin && (
                  <p>
                    Most <span className="text-green-500">WIN</span>
                    {Separate}
                    <span>{props.mostWin?.ahSide}</span>{" "}
                    <span>{props.mostWin?.start}</span> <span>{">>>"}</span>{" "}
                    <span>{props.mostWin?.end}</span>
                    {Separate}
                    <span className="font-semibold">
                      {props.mostWin?.winRate.toFixed(2)}%
                    </span>
                  </p>
                )}
                {props.mostLost && (
                  <p>
                    Most <span className="text-red-500">LOSE</span>
                    {Separate}
                    <span>{props.mostLost?.ahSide}</span>{" "}
                    <span>{props.mostLost?.start}</span> <span>{">>>"}</span>{" "}
                    <span>{props.mostLost?.end}</span>
                    {Separate}
                    <span className="font-semibold">
                      {props.mostLost?.lostRate.toFixed(2)}%
                    </span>
                  </p>
                )}
                {props.mostDraw && (
                  <p>
                    Most <span className="text-muted">DRAW</span>
                    {Separate}
                    <span>{props.mostDraw?.ahSide}</span>{" "}
                    <span>{props.mostDraw?.start}</span> <span>{">>>"}</span>{" "}
                    <span>{props.mostDraw?.end}</span>
                    {Separate}
                    <span className="font-semibold">
                      {props.mostDraw?.drawRate.toFixed(2)}%
                    </span>
                  </p>
                )}
              </Box>
            </CardContent>
          </Box>

          {/* Bottom Section */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between" }}
            px={2}
            pb={1.25}
          >
            <Typography variant="caption">By {props.author}</Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
});
