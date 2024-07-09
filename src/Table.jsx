import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { Badge, LinearProgress } from "@mui/material";
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
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbar,
} from "@mui/x-data-grid";
import { useAuth0 } from "@auth0/auth0-react";
import ErrorToast from "./ErrorToast";
import LoadingBackdrop from "./LoadingBackdrop";
import AutocompleteCell from "./AutocompleteCell";

const url = import.meta.env.VITE_SLOGAN_URL;

function EditToolbar(props) {
  const { setRows, rowLength, setRowModesModel, setShouldBlock } = props;
  const { getAccessTokenSilently } = useAuth0();
  const handleClick = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://tresosos.com/slogans",
      });
      setShouldBlock(true);
      const response = await fetch(`${url}/slogans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slogan: "",
          company: "",
          category_id: 0,
          source_id: 0,
          source_info: "",
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
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button>
        <Badge max={1e6} color="primary" badgeContent={rowLength}></Badge>
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
};

export default function Table() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [categoryOptions, setCategoryOptions] = React.useState({});
  const [sourceOptions, setSourceOptions] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState({});
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [shouldBlock, setShouldBlock] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://tresosos.com/slogans",
        });
        const response = await fetch(`${url}slogans`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();
        setRows(json);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchCategoryOptions = async () => {
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
        const object = json.reduce(
          (obj, item) => ((obj[item.category] = item.id), obj),
          {}
        );
        setCategoryOptions(object);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };
    fetchCategoryOptions();
  }, []);

  React.useEffect(() => {
    const fetchSourceOptions = async () => {
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
        const object = json.reduce(
          (obj, item) => ((obj[item.source] = item.id), obj),
          {}
        );
        setSourceOptions(object);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };
    fetchSourceOptions();
  }, []);

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
      const s = { ...params.row, updated_date_time: Date.now() };
      s.source_id = sourceOptions[s.source];
      s.category_id = categoryOptions[s.category];
      const response = await fetch(`${url}slogans/${params.row.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(s),
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
      const response = await fetch(`${url}/slogans/${id}`, {
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
    return updatedRow;
  };

  const columns = [
    { field: "id", headerName: "ID", type: "number", editable: false },
    { field: "slogan", headerName: "Slogan", flex: 3, editable: true },
    {
      field: "company",
      headerName: "Product/Company",
      flex: 2,
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      type: "singleSelect",
      valueOptions: Object.keys(categoryOptions).sort(),
      flex: 2,
      editable: true,
      renderEditCell: (params) => {
        return <AutocompleteCell {...params} />;
      },
    },
    {
      field: "source",
      headerName: "Source",
      type: "singleSelect",
      valueOptions: Object.keys(sourceOptions).sort(),
      flex: 2,
      editable: true,
      renderEditCell: (params) => {
        return <AutocompleteCell {...params} />;
      },
    },
    {
      field: "source_info",
      headerName: "Source Info",
      type: "string",
      flex: 1,
      editable: true,
    },
    {
      field: "update_date_time",
      headerName: "Date Updated",
      type: "date",
      valueGetter: (value, row) => new Date(row.update_date_time),
      flex: 1,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() =>
                setRowModesModel({
                  ...rowModesModel,
                  [id]: { mode: GridRowModes.View },
                })
              }
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
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

  var rowLength = rows.length;
  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
          loadingOverlay: LinearProgress,
        }}
        slotProps={{
          toolbar: { setRows, rowLength, setRowModesModel, setShouldBlock },
          AutocompleteCell: { categoryOptions },
        }}
        loading={loading && isAuthenticated}
        experimentalFeatures={{ newEditingApi: true }}
        hideFooterSelectedRowCount
      />

      <ErrorToast error={error} setError={setError} />
      <LoadingBackdrop open={shouldBlock}></LoadingBackdrop>
    </div>
  );
}
