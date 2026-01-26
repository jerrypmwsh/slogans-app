import React, { useState } from "react";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Link, Navigate, useNavigate } from "react-router-dom";

// TODO: contextualize
const url = import.meta.env.VITE_SLOGAN_URL;

export default function Slogans() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  if (!isAuthenticated) {
    navigate("/slogans-app/");
  }

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = async (event) => {
    if (event.key === "Enter") {
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
      }
    }
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
  ];

  return (
    <div>
      <Container
        style={{
          marginTop: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/slogans-app/slogans/new")}
          >
            Add Slogan
          </Button>
          <TextField
            label="Search"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            style={{ width: "100%", marginBottom: "20px" }}
          />
        </Stack>
        <Typography variant="h6" style={{ marginBottom: "10px" }}>
          {data.length} result(s) found
        </Typography>
      </Container>
      {data.length > 0 && (
        <DataGrid
          initialState={{
            ...data.initialState,
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25, 100]}
          rows={data}
          columns={columns}
          onRowClick={(params, event, details) => {
            navigate("/slogans-app/slogans/" + params.row.id);
            console.log(params);
            console.log(details);
          }}
        ></DataGrid>
      )}
    </div>
  );
}
