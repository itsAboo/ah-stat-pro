import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { MostStatDetail } from "../../types";

interface MostStatCardProps {
  title: string;
  details?: MostStatDetail | null;
}

interface MostStatsBarProps {
  mostHomeWin?: MostStatDetail | null;
  mostAwayWin?: MostStatDetail | null;
  mostOUWin?: MostStatDetail | null;
}

export default function MostStatsBar(props: MostStatsBarProps) {
  const MostStatCard = (props: MostStatCardProps) => {
    return (
      <Card sx={{ flex: 1 }}>
        <CardHeader sx={{ textAlign: "center" }} title={props.title} />
        <CardContent>
          {props.details &&
          (props.details.winRate > 0 ||
            props.details.drawRate > 0 ||
            props.details.lostRate > 0) ? (
            <>
              <div className="flex justify-between">
                <p className="font-semibold">Start AH</p>
                <p>{props.details.start}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">End AH</p>
                <p>{props.details.end}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Total matches</p>
                <p>{props.details.totalMatches}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">WIN</p>
                <p>{`${props.details.winRate?.toFixed(2)}%`}</p>
              </div>
            </>
          ) : (
            <p className="text-center italic text-muted">empty</p>
          )}
        </CardContent>
      </Card>
    );
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <MostStatCard title="Most Winning Home" details={props.mostHomeWin} />
      <MostStatCard title="Most Winning Away" details={props.mostAwayWin} />
      <MostStatCard title="Most Winning O/U" details={props.mostOUWin} />
    </Box>
  );
}
