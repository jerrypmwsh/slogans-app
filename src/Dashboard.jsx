import * as React from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { Box } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const url = import.meta.env.VITE_SLOGAN_URL;

var colorIncrement = 30;
var timesCalled = 0;
function gimmeAColor() {
  const color = (colorIncrement * timesCalled) % 360;
  timesCalled += 30;
  return color;
}

function toNivoData(d) {
  const children = [];
  Object.entries(d).forEach(([category, count]) => {
    children.push({
      name: category,
      color: `hsl(${gimmeAColor()}, 70%, 50%)`,
      loc: count,
    });
  });

  return {
    name: "categories",
    color: "hsl(173, 70%, 50%)",
    children: children.sort((a, b) => b["loc"] - a["loc"]),
  };
}

export default function Dashboard() {
  const [categories, setCategories] = React.useState([]);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to="/slogans-app" />;
  }
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://tresosos.com/slogans",
        });
        const response = await fetch(`${url}slogans/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        setCategories(toNivoData(json));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return (
    <Box
      sx={{
        height: 750,
        width: "100%",
      }}
    >
      <ResponsiveTreeMap
        data={categories}
        identity="name"
        value="loc"
        valueFormat=".02s"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        labelSkipSize={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.2]],
        }}
        parentLabelPosition="left"
        parentLabelTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.1]],
        }}
      />
    </Box>
  );
}
