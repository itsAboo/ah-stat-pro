import { Box, Card, Skeleton } from "@mui/material";
import TableSkeleton from "./TableSkeleton";

export default function PostPageSkeleton() {
  return (
    <>
      <div className="mb-4">
        <Skeleton animation="wave" width="30%" height={48} />
        <Skeleton animation="wave" width="40%" />
        <Skeleton animation="wave" width="20%" />
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} sx={{ flex: 1, height: 200, p: 2 }}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" width="70%" />
                <Skeleton animation="wave" width="50%" />
              </div>
              <div>
                <Skeleton animation="wave" width="30%" />
              </div>
            </div>
          </Card>
        ))}
      </Box>
      <div className="my-6 flex justify-end"></div>
      <TableSkeleton />
    </>
  );
}
