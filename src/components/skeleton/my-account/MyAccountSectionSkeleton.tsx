import { Avatar, Box, Paper, Skeleton } from "@mui/material";

export default function MyAccountSectionSkeleton() {
  return (
    <Paper className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Account</h1>
      <div className="flex items-start gap-8">
        <Skeleton variant="circular">
          <Avatar sx={{ width: 128, height: 128, fontSize: 36 }}></Avatar>
        </Skeleton>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Skeleton animation="wave" height={36} />
          <Skeleton animation="wave" height={36} width="70%" />
          <Skeleton animation="wave" height={36} width="85%" />
        </Box>
      </div>
    </Paper>
  );
}
