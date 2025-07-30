import React, { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import {
  useDeletePostAccess,
  useGetPostAccessAccepted,
} from "../hooks/post-access";
import { useParams } from "react-router-dom";
import TableSkeleton from "../components/skeleton/TableSkeleton";
import ConfirmModal from "../components/UI/ConfirmDialog";
import BackdropProgress from "../components/UI/BackdropProgress";
import { convertDateToStringDDMMYYYY } from "../util/transform";

export default function AccessList() {
  const params = useParams();
  const { data, isLoading } = useGetPostAccessAccepted(params.postId as string);
  const { mutate: deletePostAccesses, isPending: isDeleting } =
    useDeletePostAccess(params.postId as string);

  const handleDeletePostAccesses = (postAccessIds: string[]) => {
    deletePostAccesses(postAccessIds);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <AccessTable
        data={data!}
        onDeleteItems={handleDeletePostAccesses}
        isDeleting={isDeleting}
      />
    </div>
  );
}

interface Data {
  id: string;
  name: string;
  approvedAt: Date | string;
}

function AccessTable({
  data,
  onDeleteItems,
  isDeleting,
}: {
  data: Data[] | [];
  onDeleteItems: (ids: string[]) => void;
  isDeleting: boolean;
}) {
  const [rows, setRows] = useState<Data[] | []>(data ?? []);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = useState(false);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(rows && rows.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelected = (_: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteSelected = () => {
    if (!open) {
      setOpen(true);
      return;
    }
    setRows(rows && rows.filter((row) => !selected.includes(row.id)));
    setSelected([]);
    onDeleteItems(selected);
  };

  const handleClickDelete = (id: string) => {
    setSelected([id]);
    setOpen(true);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - rows.length);

  const visibleRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setRows(Array.isArray(data) ? data : []);
  }, [data]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(selected?.length > 0 && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.activatedOpacity
                  ),
              }),
            }}
          >
            {selected?.length > 0 ? (
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selected?.length} selected
              </Typography>
            ) : (
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Access List
              </Typography>
            )}

            {selected?.length > 0 && (
              <Tooltip title="Delete">
                <IconButton onClick={handleDeleteSelected}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
          <TableContainer>
            <Table
              sx={{
                minWidth: 750,
                tableLayout: "fixed",
                width: "100%",
              }}
              aria-labelledby="tableTitle"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected?.length > 0 && selected?.length < rows?.length
                      }
                      checked={
                        rows?.length > 0 && selected?.length === rows?.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Approved Date</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows?.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleSelected(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">
                        {convertDateToStringDDMMYYYY(row.approvedAt)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickDelete(row.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <ConfirmModal
        onConfirm={handleDeleteSelected}
        open={open}
        setOpen={setOpen}
        title="Are you sure?"
        description="Are you sure you want to delete this access? This action cannot be undone"
      />
      {isDeleting && <BackdropProgress open={isDeleting} />}
    </>
  );
}
