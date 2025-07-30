import { Card, CardContent, Divider, Skeleton, Box } from "@mui/material";

export default function PostListCardSkeleton() {
  return (
    <Card sx={{ width: "100%", height: "100%" }}>
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
            <Box sx={{ flex: 1, pr: 1 }}>
              <Skeleton
                animation="wave"
                variant="text"
                width="100%"
                height={24}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width="60%"
                height={18}
              />
            </Box>
            <Skeleton
              animation="wave"
              variant="circular"
              width={24}
              height={24}
            />
          </Box>

          <Divider />

          <CardContent sx={{ pt: 1 }}>
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={16}
            />
            <Skeleton animation="wave" variant="text" width="90%" height={16} />
            <Skeleton animation="wave" variant="text" width="95%" height={16} />
            <Box mt={1}>
              <Skeleton
                animation="wave"
                variant="text"
                width="80%"
                height={16}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width="75%"
                height={16}
              />
            </Box>
          </CardContent>
        </Box>

        {/* Bottom Section */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between" }}
          px={2}
          pb={1.25}
        >
          <Skeleton animation="wave" variant="text" width="40%" height={14} />
        </Box>
      </Box>
    </Card>
  );
}
