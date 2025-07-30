import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { IMatch } from "./schemas";
import ConfirmModal from "../UI/ConfirmDialog";

interface MatchTableDetailsProps {
  matches: IMatch[];
  removeMatch: (groupIndex: number, matchIndexes: number[]) => void;
  groupIndex: number;
}

const RESULT_VALUE = {
  P: "Pending",
  W: "Win",
  D: "Draw",
  L: "Lose",
};

const Empty = () => {
  return <p className="italic">empty</p>;
};

export default function MatchTableDetails({
  matches,
  removeMatch,
  groupIndex,
}: MatchTableDetailsProps) {
  const [rows, setRows] = useState(matches);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const rowsPerPage = 5;
  const startIndex = page * rowsPerPage;
  const visibleRows = rows.slice(startIndex, startIndex + rowsPerPage);

  const isSelected = (index: number) => selected.includes(index);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((_, i) => startIndex + i);
      setSelected((prev) => Array.from(new Set([...prev, ...newSelected])));
    } else {
      const newSelected = selected.filter(
        (i) => i < startIndex || i >= startIndex + rowsPerPage
      );
      setSelected(newSelected);
    }
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleClickDelete = () => {
    setOpen((prev) => !prev);
  };

  const handleDeleteSelected = () => {
    removeMatch(groupIndex, selected);
    const remaining = rows.filter((_, index) => !selected.includes(index));
    setRows(remaining);
    setSelected([]);
    if ((page + 1) * rowsPerPage > remaining.length && page > 0) {
      setPage(page - 1);
    }
  };

  const allVisibleSelected = visibleRows.every((_, i) =>
    selected.includes(startIndex + i)
  );

  const someVisibleSelected =
    visibleRows.some((_, i) => selected.includes(startIndex + i)) &&
    !allVisibleSelected;

  useEffect(() => {
    setRows(matches);
  }, [matches]);

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={someVisibleSelected}
                    checked={allVisibleSelected}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Match Day</TableCell>
                <TableCell>Home</TableCell>
                <TableCell>Away</TableCell>
                <TableCell>League</TableCell>
                <TableCell>Full-time score</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, i) => {
                const index = startIndex + i;
                const selectedRow = isSelected(index);
                return (
                  <TableRow
                    key={index}
                    hover
                    selected={selectedRow}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleSelect(index)}
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedRow}
                        onChange={() => handleSelect(index)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.matchDay || Empty()}</TableCell>
                    <TableCell>{row.home || Empty()}</TableCell>
                    <TableCell>{row.away || Empty()}</TableCell>
                    <TableCell>{row.league || Empty()}</TableCell>
                    <TableCell>{row.fullTimeScore || Empty()}</TableCell>
                    <TableCell>{RESULT_VALUE[row.result] || Empty()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
        >
          {selected.length > 0 ? (
            <Button color="error" onClick={handleClickDelete}>
              Delete ({selected.length})
            </Button>
          ) : (
            <Box />
          )}
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Box>
      </Paper>
      <ConfirmModal
        onConfirm={handleDeleteSelected}
        open={open}
        setOpen={setOpen}
        title="Are you sure?"
        description="Are you sure you want to delete this selected? This action cannot be undone"
      />
    </>
  );
}
