import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  TablePagination,
  Badge,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  RemoveCircleOutline,
} from "@mui/icons-material";
import StatTableDetail from "./StatTableDetail";
import { HandicapMovement } from "../../types";
import { convertDateToStringDDMMYYYY } from "../../util/transform";
import ConfirmModal from "../UI/ConfirmDialog";
import { useDeleteHandicap } from "../../hooks/handicap-movement";
import BackdropProgress from "../UI/BackdropProgress";

type Props = {
  tables: { label: string; rows: HandicapMovement[] }[];
  editable?: boolean;
  showDeleteButtons?: boolean;
  activeTableIndex: number;
  onSetActiveTableIndex: (index: number) => void;
  onDeleteRow?: (rowId: string, tableIndex: number) => void;
  postId: string;
};

const headerTitles = [
  "Last Update",
  "Start AH",
  "End AH",
  "Total Matches",
  "Win Rate",
  "Draw Rate",
  "Lose Rate",
  "Last 5 match",
];

const StatTable: React.FC<Props> = ({
  tables: initialTables,
  editable = false,
  showDeleteButtons = false,
  activeTableIndex = 0,
  onSetActiveTableIndex,
  postId,
}) => {
  const [tables, setTables] = useState(initialTables);
  const [openRows, setOpenRows] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const rowsPerPage = 15;

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(
    null
  );

  const { mutate, isPending } = useDeleteHandicap();

  useEffect(() => {
    setTables(initialTables);
  }, [initialTables]);

  const handleHeaderClick = (index: number) => {
    onSetActiveTableIndex(index);
    setOpenRows([]);
    setPage(0);
  };

  const handleToggleRow = (id: string) => {
    if (!id) return;

    setOpenRows((prev: string[]) => {
      const openSet = new Set(prev);

      if (openSet.has(id)) {
        openSet.delete(id);
      } else {
        openSet.add(id);
      }

      return Array.from(openSet);
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteRow = () => {
    mutate({
      handicapMovementId: selectedIdToDelete!,
      postId,
    });
  };

  const currentTable = tables[activeTableIndex];
  const currentRows = currentTable?.rows || [];

  const sortedRows = [...currentRows].sort((a, b) => {
    if (a.start === b.start) {
      return a.end < b.end ? -1 : a.end > b.end ? 1 : 0;
    }
    return a.start < b.start ? -1 : 1;
  });

  const totalColumns = headerTitles.length + 1 + (showDeleteButtons ? 1 : 0);

  return (
    <>
      <Paper
        sx={{
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
      >
        <TableContainer>
          <Table
            sx={{
              width: "100%",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
              overflow: "hidden",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell colSpan={totalColumns} sx={{ padding: 0 }}>
                  <Box display="flex">
                    {tables.map((table, index) => (
                      <Box
                        key={index}
                        flex={1}
                        textAlign="center"
                        onClick={() => handleHeaderClick(index)}
                        sx={(theme) => ({
                          cursor: "pointer",
                          fontWeight: "bold",
                          padding: 2,
                          borderRight:
                            index !== tables.length - 1
                              ? "1px solid #ccc"
                              : "none",
                          borderRadius:
                            index === 0
                              ? "4px 0 0 0"
                              : index === tables.length - 1
                              ? "0 4px 0 0"
                              : "0",
                          backgroundColor:
                            activeTableIndex === index
                              ? theme.palette.mode === "dark"
                                ? "#0d4672"
                                : "#d7d7d7"
                              : theme.palette.mode === "dark"
                              ? "#125d96"
                              : "white",
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "#000",
                          overflow: "hidden",
                        })}
                      >
                        {table.label}
                      </Box>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                {showDeleteButtons && (
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                )}
                {headerTitles.map((title, i) => (
                  <TableCell
                    key={i}
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    {title}
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const maxRate = Math.max(
                    row.winRate!,
                    row.drawRate!,
                    row.lostRate!
                  );
                  return (
                    <React.Fragment key={row._id}>
                      <TableRow
                        sx={{
                          cursor: "pointer",
                          ":hover": (theme) =>
                            theme.palette.mode === "dark"
                              ? { opacity: 0.75 }
                              : { backgroundColor: theme.palette.appBg.main },
                        }}
                        onClick={() => handleToggleRow(row._id!)}
                      >
                        {showDeleteButtons && (
                          <TableCell>
                            <IconButton
                              disabled={isPending}
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIdToDelete(row._id!);
                                setConfirmModalOpen(true);
                              }}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(244, 67, 54, 0.08)",
                                },
                              }}
                            >
                              <RemoveCircleOutline />
                            </IconButton>
                          </TableCell>
                        )}
                        <TableCell>
                          {convertDateToStringDDMMYYYY(
                            new Date(row.updatedAt!)
                          )}
                        </TableCell>
                        <TableCell>{row.start}</TableCell>
                        <TableCell>{row.end}</TableCell>
                        <TableCell>{row.totalMatches}</TableCell>
                        <TableCell>
                          <p
                            className={
                              row.winRate === maxRate && row.winRate !== 0
                                ? "text-green-400 font-semibold"
                                : undefined
                            }
                          >
                            {row.winRate?.toFixed(2)} %
                          </p>
                        </TableCell>
                        <TableCell>
                          <p
                            className={
                              row.drawRate === maxRate && row.drawRate !== 0
                                ? "text-muted font-semibold"
                                : undefined
                            }
                          >
                            {row.drawRate?.toFixed(2)} %
                          </p>
                        </TableCell>
                        <TableCell>
                          <p
                            className={
                              row.lostRate === maxRate && row.lostRate !== 0
                                ? "text-red-500 font-semibold"
                                : undefined
                            }
                          >
                            {row.lostRate?.toFixed(2)} %
                          </p>
                        </TableCell>
                        <TableCell>
                          {row.last5MatchWinRate?.toFixed(2)} %
                        </TableCell>

                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRow(row._id!);
                            }}
                          >
                            {openRows.includes(row._id!) ? (
                              <KeyboardArrowUp />
                            ) : row.matches?.some(
                                (match) => match.result === "P"
                              ) ? (
                              <Badge
                                overlap="circular"
                                variant="dot"
                                color="error"
                              >
                                <KeyboardArrowDown />
                              </Badge>
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          colSpan={totalColumns}
                          style={{ padding: 0 }}
                        >
                          <Collapse
                            in={openRows.includes(row._id!)}
                            timeout="auto"
                            unmountOnExit
                          >
                            <StatTableDetail
                              postId={row.postId!}
                              handicapMovementId={row._id!}
                              start={row.start}
                              end={row.end}
                              matches={row.matches!}
                              editable={editable}
                            />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ padding: 2 }}
        >
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={currentRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </Paper>
      <ConfirmModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        onConfirm={handleDeleteRow}
        title="Are you sure ?"
        description="Are you sure you want to delete this handicap? This action cannot be undone"
      />
      <BackdropProgress open={isPending} />
    </>
  );
};

export default StatTable;
