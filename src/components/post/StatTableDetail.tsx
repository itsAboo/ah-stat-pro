import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Box,
  Paper,
  Checkbox,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Edit, Check, Close, Delete, ArrowForward } from "@mui/icons-material";
import AddMatchModal from "../edit-post/AddMatchModal";
import { Match } from "../../types";
import { convertDateToStringDDMMYYYY } from "../../util/transform";
import {
  useRemoveMatches,
  useUpdateMatch,
} from "../../hooks/handicap-movement";
import ConfirmModal from "../UI/ConfirmDialog";
import BackdropProgress from "../UI/BackdropProgress";

interface StatTableDetailProps {
  editable: boolean;
  matches: Match[];
  start: string;
  end: string;
  postId: string;
  handicapMovementId: string;
}

const ROWS_PER_PAGE = 5;

const EMPTY = <p className="text-muted italic">empty</p>;

const headerTitles = [
  "Match Day",
  "Home",
  "Away",
  "League",
  "Full-time Score",
  "Result",
];

const RESULT_MAP = {
  W: "Win",
  L: "Lose",
  D: "Draw",
  P: "Pending",
};

const StatTableDetail = ({
  editable = false,
  matches = [],
  start,
  end,
  postId,
  handicapMovementId,
}: StatTableDetailProps) => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [data, setData] = useState<Match[]>(matches);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Match | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [matchModalOpen, setMatchModalOpen] = useState(false);

  const { mutate: updateMatch, isPending: isUpdateMatchPending } =
    useUpdateMatch({
      onSuccess: () => {
        setEditingId(null);
        setEditingData(null);
      },
    });

  const { mutate: removeMatches, isPending: isRemoveMatchesPending } =
    useRemoveMatches({
      onSuccess: () => {
        setSelectedIds([]);
        setEditingData(null);
        setEditingData(null);
        setConfirmOpen(false);
      },
    });

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    setData(matches);
  }, [matches]);

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedData = data.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const isSelected = (id: string) => selectedIds.includes(id);

  const handleToggle = (id: string) => {
    if (editingId !== null || !editable) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (editingId !== null || !editable) return;
    const allIdsOnPage = paginatedData.map((row) => row._id);
    const allSelected = allIdsOnPage.every((id) => selectedIds.includes(id!));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIdsOnPage.includes(id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...(allIdsOnPage.filter((id) => !prev.includes(id!)) as []),
      ]);
    }
  };

  const handleEdit = (row: Match) => {
    setEditingId(row._id!);
    setEditingData({ ...row });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleUpdate = () => {
    if (editingData) {
      updateMatch({
        postId,
        handicapMovementId,
        matchId: editingData?._id,
        home: editingData?.home,
        away: editingData?.away,
        league: editingData?.league,
        fullTimeScore: editingData?.fullTimeScore,
        matchDay: editingData?.matchDay,
        result: editingData?.result || "P",
      });
    }
  };

  const handleRemoveMatches = () => {
    removeMatches({
      postId,
      handicapMovementId,
      matchIds: selectedIds,
    });
  };

  const handleInputChange = (field: keyof Match, value: string) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        [field]: value,
      });
    }
  };

  const handleCloseMatchModal = () => {
    setMatchModalOpen(false);
  };

  const last10Match = matches
    .map((m, index) => ({ ...m, originalIndex: index }))
    .slice()
    .filter((m) => m.result !== "P")
    .sort((a, b) => {
      const timeA = new Date(a.matchDay!).getTime();
      const timeB = new Date(b.matchDay!).getTime();

      if (timeA === timeB) {
        return a.originalIndex - b.originalIndex;
      }

      return timeB - timeA;
    })
    .slice(0, 10)
    .sort((a, b) => b.originalIndex - a.originalIndex);

  return (
    <>
      <Box
        sx={{
          p: 2,
          backgroundColor: (theme) =>
            theme.palette.appBgSecond?.main ?? "#f5f5f5",
        }}
      >
        <div className="pb-3 text-lg leading-tight flex justify-between items-center">
          <h1>
            <span className="font-semibold">{start}</span> {">>>"}{" "}
            <span className="font-semibold">{end}</span>
          </h1>
          {last10Match.length > 0 && (
            <h2 className="flex items-center gap-2">
              <span>Last {last10Match.length} Match |</span>
              <span className="space-x-2">
                {last10Match.map((m, i) => (
                  <span
                    className={
                      m.result === "W"
                        ? "text-green-500"
                        : m.result === "L"
                        ? "text-red-500"
                        : m.result === "D"
                        ? "text-muted"
                        : undefined
                    }
                    key={i}
                  >
                    {m.result}
                  </span>
                ))}
              </span>
              <ArrowForward fontSize="small" />
            </h2>
          )}
          {editable && (
            <Button
              onClick={() => setMatchModalOpen((prev) => !prev)}
              sx={{ my: 1 }}
              variant="contained"
            >
              Add
            </Button>
          )}
        </div>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {editable && (
                  <TableCell padding="normal">
                    <Checkbox
                      checked={paginatedData.every((row) =>
                        isSelected(row._id!)
                      )}
                      indeterminate={
                        paginatedData.some((row) => isSelected(row._id!)) &&
                        !paginatedData.every((row) => isSelected(row._id!))
                      }
                      onChange={handleToggleAll}
                      disabled={editingId !== null}
                    />
                  </TableCell>
                )}
                {headerTitles.map((title, i) => (
                  <TableCell key={i}>{title}</TableCell>
                ))}
                {editable && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => {
                const isEditing = editingId === row._id;
                const currentData = isEditing ? editingData! : row;

                return (
                  <TableRow
                    key={row._id}
                    onClick={() =>
                      !isEditing && editable && handleToggle(row._id!)
                    }
                    selected={isSelected(row._id!) && editable}
                    sx={{
                      cursor: isEditing
                        ? "default"
                        : editable
                        ? "pointer"
                        : "default",
                      ":hover": {
                        backgroundColor: isDarkMode
                          ? undefined
                          : (theme) => theme.palette.appBg?.main || "#f5f5f5",
                      },
                      opacity:
                        isDarkMode && isSelected(row._id!) && editable
                          ? 0.75
                          : 1,
                    }}
                  >
                    {editable && (
                      <TableCell
                        padding="normal"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected(row._id!)}
                          onChange={() => handleToggle(row._id!)}
                          disabled={editingId !== null}
                        />
                      </TableCell>
                    )}

                    {/* Match Day */}
                    <TableCell>
                      {convertDateToStringDDMMYYYY(new Date(row.matchDay!))}
                    </TableCell>

                    {/* Home */}
                    <TableCell
                      onClick={(e) => isEditing && e.stopPropagation()}
                    >
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={currentData.home || ""}
                          onChange={(e) =>
                            handleInputChange("home", e.target.value)
                          }
                          variant="standard"
                          fullWidth
                          sx={{
                            "& .MuiInput-root": {
                              "&:hover:not(.Mui-disabled):before": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                              "&.Mui-focused:after": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      ) : (
                        row.home || EMPTY
                      )}
                    </TableCell>

                    {/* Away */}
                    <TableCell
                      onClick={(e) => isEditing && e.stopPropagation()}
                    >
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={currentData.away || ""}
                          onChange={(e) =>
                            handleInputChange("away", e.target.value)
                          }
                          variant="standard"
                          fullWidth
                          sx={{
                            "& .MuiInput-root": {
                              "&:hover:not(.Mui-disabled):before": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                              "&.Mui-focused:after": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      ) : (
                        row.away || EMPTY
                      )}
                    </TableCell>

                    {/* League */}
                    <TableCell
                      onClick={(e) => isEditing && e.stopPropagation()}
                    >
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={currentData.league || ""}
                          onChange={(e) =>
                            handleInputChange("league", e.target.value)
                          }
                          variant="standard"
                          fullWidth
                          sx={{
                            "& .MuiInput-root": {
                              "&:hover:not(.Mui-disabled):before": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                              "&.Mui-focused:after": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      ) : (
                        row.league || EMPTY
                      )}
                    </TableCell>

                    {/* Full-time Score */}
                    <TableCell
                      onClick={(e) => isEditing && e.stopPropagation()}
                    >
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={currentData.fullTimeScore || ""}
                          onChange={(e) =>
                            handleInputChange("fullTimeScore", e.target.value)
                          }
                          variant="standard"
                          fullWidth
                          sx={{
                            "& .MuiInput-root": {
                              "&:hover:not(.Mui-disabled):before": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                              "&.Mui-focused:after": {
                                borderBottomColor: isDarkMode
                                  ? "#ffffff"
                                  : (theme) => theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                      ) : (
                        row.fullTimeScore
                      )}
                    </TableCell>

                    {/* Result */}
                    <TableCell
                      onClick={(e) => isEditing && e.stopPropagation()}
                    >
                      {isEditing ? (
                        <FormControl size="small" fullWidth>
                          <Select
                            value={currentData.result}
                            onChange={(e) =>
                              handleInputChange(
                                "result",
                                e.target.value as Match["result"]
                              )
                            }
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isDarkMode ? "#ffffff" : undefined,
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: isDarkMode ? "#ffffff" : undefined,
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: isDarkMode
                                    ? "#ffffff"
                                    : undefined,
                                  borderWidth: "2px",
                                },
                              "& .MuiInput-root": {
                                "&:hover:not(.Mui-disabled):before": {
                                  borderBottomColor: isDarkMode
                                    ? "#ffffff"
                                    : (theme) => theme.palette.primary.main,
                                },
                                "&.Mui-focused:after": {
                                  borderBottomColor: isDarkMode
                                    ? "#ffffff"
                                    : (theme) => theme.palette.primary.main,
                                },
                              },
                            }}
                          >
                            <MenuItem value="W">Win</MenuItem>
                            <MenuItem value="L">Lose</MenuItem>
                            <MenuItem value="D">Draw</MenuItem>
                            <MenuItem value="P">Pending</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <p
                          className={
                            row.result === "W"
                              ? "text-green-500"
                              : row.result === "L"
                              ? "text-red-500"
                              : row.result === "D"
                              ? "text-muted"
                              : "inherit"
                          }
                        >
                          {RESULT_MAP[row.result]}
                        </p>
                      )}
                    </TableCell>

                    {/* Action */}
                    {editable && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {isEditing ? (
                          <Box display="flex" flexDirection="column" gap={1}>
                            <Button
                              disabled={isUpdateMatchPending}
                              color="success"
                              variant="contained"
                              size="small"
                              onClick={handleUpdate}
                              startIcon={
                                isUpdateMatchPending ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <Check fontSize="small" />
                                )
                              }
                            >
                              Update
                            </Button>
                            <Button
                              disabled={isUpdateMatchPending}
                              color="error"
                              variant="outlined"
                              size="small"
                              onClick={handleCancel}
                              startIcon={<Close />}
                            >
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            color="success"
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(row)}
                            disabled={
                              editingId !== null ||
                              selectedIds.includes(row._id!) ||
                              isRemoveMatchesPending
                            }
                          >
                            <Edit />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          px={1}
        >
          {selectedIds.length > 0 && editable ? (
            <Button
              variant="contained"
              color="primary"
              disabled={editingId !== null}
              onClick={() => setConfirmOpen(true)}
              startIcon={
                isRemoveMatchesPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Delete />
                )
              }
            >
              DELETE ({selectedIds.length})
            </Button>
          ) : (
            <Box />
          )}

          <Pagination
            count={Math.ceil(data.length / ROWS_PER_PAGE)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            disabled={editingId !== null}
          />
        </Box>
      </Box>
      <AddMatchModal
        key={handicapMovementId}
        postId={postId}
        handicapMovementId={handicapMovementId}
        open={matchModalOpen}
        onClose={handleCloseMatchModal}
      />
      <ConfirmModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title="Are you sure ?"
        description="Are you sure you want to delete this match? This action cannot be undone"
        onConfirm={handleRemoveMatches}
      />
      {(isUpdateMatchPending || isRemoveMatchesPending) && (
        <BackdropProgress
          open={isUpdateMatchPending || isRemoveMatchesPending}
        />
      )}
    </>
  );
};

export default StatTableDetail;
