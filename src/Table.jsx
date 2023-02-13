import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { useAuth0 } from "@auth0/auth0-react";
import ErrorToast from "./ErrorToast";
import LoadingBackdrop from "./LoadingBackdrop";

const url = import.meta.env.VITE_SLOGAN_URL;

// Unquote string (utility)
function unquote(value) {
  if (value.charAt(0) == '"' && value.charAt(value.length - 1) == '"')
    return value.substring(1, value.length - 1);
  return value;
}

// Parse a Link header
function parseLinkHeader(header) {
  if (header === null) {
    return;
  }
  try {
    var linkexp =
      /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
    var paramexp =
      /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;
    var matches = header.match(linkexp);
    var rels = new Object();
    for (var i = 0; i < matches.length; i++) {
      var split = matches[i].split(">");
      var href = split[0].substring(1);
      var ps = split[1];
      var link = new Object();
      link.href = href;
      var s = ps.match(paramexp);
      for (var j = 0; j < s.length; j++) {
        var p = s[j];
        var paramsplit = p.split("=");
        var name = paramsplit[0];
        link[name] = unquote(paramsplit[1]);
      }

      if (link.rel != undefined) {
        rels[link.rel] = link;
      }
    }
    return rels;
  } catch (error) {
    console.error(error);
  }
}

function EditToolbar(props) {
  const { setRows, setRowModesModel, setShouldBlock } = props;
  const { getAccessTokenSilently } = useAuth0();
  const handleClick = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      setShouldBlock(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slogan: "[NEW]",
          company: "[NEW]",
          category: "[NEW]",
          source: "[NEW]",
          source_info: "[NEW]",
          updated_date_time: Date.now(),
        }),
      });
      const json = await response.json();
      setRows((oldRows) => [json, ...oldRows]);
      const id = json.id;
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "slogan" },
      }));
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setShouldBlock(false);
    }
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Slogan
      </Button>
      <GridToolbar></GridToolbar>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
};

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

function extractSelectOptions(slogans) {
  const categories = new Set();
  const sources = new Set();
  slogans.forEach((s) => {
    categories.add(s.category);
    sources.add(s.source);
  });
  return { categories, sources };
}

function merge(a, b) {
  const c = new Set();
  a.forEach((element) => c.add(element));
  b.forEach((element) => c.add(element));
  return c;
}

export default function Table() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [sourceOptions, setSourceOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState({});
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [nextUrl, setNextUrl] = React.useState(`${url}?limit=5000`);
  const [shouldBlock, setShouldBlock] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://tresosos.com/slogans",
        });
        const response = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();
        setRows((oldRows) => [...oldRows, ...json]);
        const { categories, sources } = extractSelectOptions(json);
        setCategoryOptions((oldCategories) => merge(oldCategories, categories));
        setSourceOptions((oldSources) => merge(oldSources, sources));
        setLoading(false);
        const headers = response.headers;
        const link = headers.get("link");
        if (link !== undefined) {
          const parsed = parseLinkHeader(link);
          if (parsed !== undefined) {
            setNextUrl(parsed["next"]["href"]);
          }
        }
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, [nextUrl]);

  const handleRowEditStart = (params, event) => {};

  const handleRowEditStop = (params, event) => {};

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (params) => async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      setShouldBlock(true);
      const response = await fetch(`${url}/${params.row.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...params.row, updated_date_time: Date.now() }),
      });
      if (!response.ok) {
        setError({ message: response.text });
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setShouldBlock(false);
    }
    setRowModesModel({
      ...rowModesModel,
      [params.row.id]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteClick = (id) => async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      setShouldBlock(true);
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setShouldBlock(false);
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    handleSaveClick({ row: newRow }).apply();
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: "id", headerName: "ID", type: "number", editable: false },
    { field: "slogan", headerName: "Slogan", flex: 1, editable: true },
    { field: "company", headerName: "Company", flex: 1, editable: true },
    {
      field: "category",
      headerName: "Category",
      type: "singleSelect",
      valueOptions: [...categoryOptions],
      flex: 1,
      editable: true,
    },
    {
      field: "source",
      headerName: "Source",
      type: "singleSelect",
      valueOptions: [...sourceOptions],
      flex: 1,
      editable: true,
    },
    {
      field: "source_info",
      headerName: "Source Info",
      flex: 1,
      editable: true,
    },
    {
      field: "update_date_time",
      headerName: "Date Updated",
      type: "date",
      flex: 1,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(params)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params.id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 750,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
          Pagination: CustomPagination,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel, setShouldBlock },
        }}
        loading={loading && isAuthenticated}
        experimentalFeatures={{ newEditingApi: true }}
      />
      <ErrorToast error={error} setError={setError} />
      <LoadingBackdrop open={shouldBlock}></LoadingBackdrop>
    </Box>
  );
}
