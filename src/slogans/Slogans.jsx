import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import ErrorToast from "../ErrorToast";
import SloganDialog from "./SloganDialog";

// TODO: contextualize
const url = import.meta.env.VITE_SLOGAN_URL;

export default function Slogans() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sloganToEdit, setSloganToEdit] = useState(null);

  const handleDeleteClick = (id) => async (event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this slogan?")) {
      return;
    }
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      const response = await fetch(`${url}/slogans/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status != 200) {
        setError({ message: "Failed to delete" });
      } else {
        enqueueSnackbar("Slogan deleted successfully!", { variant: "success" });
        setData(data.filter((row) => row.id !== id));
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const fetchSlogans = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      // TODO: probably some string sanitization
      const response = await fetch(`${url}slogans?search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSlogans();
    }
  }, [isAuthenticated]);

  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      fetchSlogans();
    }
  };

  const handleSaveSlogan = (savedSlogan) => {
    if (sloganToEdit) {
      setData((prevData) =>
        prevData.map((row) => (row.id === savedSlogan.id ? savedSlogan : row)),
      );
    } else {
      setData((prevData) => [savedSlogan, ...prevData]);
    }
  };

  const handleAddClick = () => {
    setSloganToEdit(null);
    setDialogOpen(true);
  };

  const handleRowClick = (params) => {
    setSloganToEdit(params.row);
    setDialogOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", type: "number", flex: 2, editable: false },
    { field: "slogan", headerName: "Slogan", flex: 3, editable: false },
    { field: "company", headerName: "Company", flex: 2, editable: false },
    { field: "category", headerName: "Category", flex: 2, editable: false },
    { field: "source", headerName: "Source", flex: 2, editable: false },
    {
      field: "source_info",
      headerName: "SourceInfo",
      flex: 3,
      editable: false,
    },
    {
      field: "update_date_time",
      headerName: "Last Updated",
      type: "number",
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div>
      <Container
        style={{
          marginTop: "50px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ width: "100%", mb: 3 }}>
          <TextField
            label="Search Slogans"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            sx={{ flexGrow: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch({ key: "Enter" })}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Add a slogan">
            <IconButton color="primary" onClick={handleAddClick}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="h6" style={{ marginBottom: "10px" }}>
          {data.length} result(s) found
        </Typography>
        {
          <DataGrid
            initialState={{
              ...data.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25, 100]}
            rows={data}
            columns={columns}
            onRowClick={handleRowClick}
            loading={loading}
          ></DataGrid>
        }
      </Container>
      <ErrorToast error={error} setError={setError} />
      <SloganDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSlogan}
        sloganToEdit={sloganToEdit}
      />
    </div>
  );
}
