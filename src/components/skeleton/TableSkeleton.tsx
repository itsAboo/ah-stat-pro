import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function TableSkeleton() {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: 7 }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton animation="wave" variant="text" width="60%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 7 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: 7 }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton animation="wave" variant="text" width="100%" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
