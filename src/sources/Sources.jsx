import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import ErrorToast from "../ErrorToast";
import SourceDialog from "./SourceDialog";

const url = import.meta.env.VITE_SLOGAN_URL;

export default function Sources() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/slogans-app/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently({
          audience: "https://tresosos.com/slogans",
        });
        const response = await fetch(`${url}sources`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, getAccessTokenSilently]);

  const handleDeleteClick = (id) => async (event) => {
    event.stopPropagation(); // Prevent row click
    if (!window.confirm("Are you sure you want to delete this source?")) {
      return;
    }
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      const response = await fetch(`${url}sources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        setError({ message: "Failed to delete" });
      } else {
        setData(data.filter((row) => row.id !== id));
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleSaveSource = (savedSource) => {
    if (sourceToEdit) {
      setData((prevData) =>
        prevData.map((row) => (row.id === savedSource.id ? savedSource : row)),
      );
    } else {
      setData((prevData) => [savedSource, ...prevData]);
    }
  };

  const handleAddClick = () => {
    setSourceToEdit(null);
    setDialogOpen(true);
  };

  const handleRowClick = (params) => {
    setSourceToEdit(params.row);
    setDialogOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", type: "number", flex: 1 },
    { field: "source", headerName: "Source", flex: 3 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            key="delete"
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: "20px" }}
        >
          <Typography variant="h4">Sources</Typography>
          <Tooltip title="Add a source">
            <IconButton color="primary" onClick={handleAddClick}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      </Container>
      <ErrorToast error={error} setError={setError} />
      <SourceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSource}
        sourceToEdit={sourceToEdit}
      />
    </div>
  );
}
