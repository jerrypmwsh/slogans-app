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

const url = import.meta.env.VITE_SLOGAN_URL;

export default function Categories() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

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
        const response = await fetch(`${url}categories`, {
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
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      const response = await fetch(`${url}categories/${id}`, {
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

  const columns = [
    { field: "id", headerName: "ID", type: "number", flex: 1 },
    { field: "category", headerName: "Category", flex: 3 },
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
          <Typography variant="h4">Categories</Typography>
          <Tooltip title="Add a category">
            <IconButton
              color="primary"
              onClick={() => navigate("/slogans-app/categories/new")}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            onRowClick={(params) => {
              navigate("/slogans-app/categories/" + params.row.id);
            }}
          />
        </div>
      </Container>
      <ErrorToast error={error} setError={setError} />
    </div>
  );
}
