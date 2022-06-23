import * as React from "react";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Zoom from "@mui/material/Zoom";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Theme } from "@mui/material/styles";

interface Props {
  children: any;
  data: any[];
  checked: boolean;
  effectType: "fade" | "zoom" | "none";
}

const EffectGrid: React.FC<Props> = ({ children, data, checked, effectType }) => {
  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ display: "flex" }}>
        {data.map((item, index) => (
          <Zoom
            key={index}
            in={checked}
            style={{ transitionDelay: checked ? `${index * 300}ms` : "0ms" }}
          >
            {children(item)}
          </Zoom>
        ))}
      </Box>
    </Box>
  );
};

export default EffectGrid;
