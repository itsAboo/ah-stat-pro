import { Card, Skeleton } from "@mui/material";

export default function MyPostsCardSkeleton() {
  return (
    <Card sx={{ width: "100%", height: "100%", py: "20px", px: "10px" }}>
      <Skeleton animation="wave" variant="text" width="40%" />
      <Skeleton animation="wave" variant="text" width="70%" height={24} />
    </Card>
  );
}
