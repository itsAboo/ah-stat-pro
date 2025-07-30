import { Box, Card, Paper, Skeleton } from "@mui/material";

export default function NotificationSectionSkeleton() {
  return (
    <Paper className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Notifications</h1>
      <Box display="flex" flexDirection="column" gap={2}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} sx={{ bgcolor: "appBgContrast.main", padding: 1.5 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <div>
                <Skeleton variant="circular" width={50} height={50} />
              </div>
              <div className="w-full">
                <Skeleton animation="wave" width="60%" />
                <Skeleton animation="wave" width="40%" />
                <Skeleton animation="wave" width="65%" />
                <Skeleton animation="wave" width="35%" />
              </div>
            </Box>
          </Card>
        ))}
      </Box>
    </Paper>
  );
}
