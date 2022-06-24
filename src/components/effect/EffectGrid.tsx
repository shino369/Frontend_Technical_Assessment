import * as React from "react";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Zoom from "@mui/material/Zoom";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Theme } from "@mui/material/styles";
import CheckRoundIcon from "@rsuite/icons/CheckRound";

interface Props {
  children: any;
  data: any[];
  selected?: string;
  checked: boolean;
  effectType: "fade" | "zoom" | "none";
  isMobile?: boolean;
  onSelect: (value: string) => void;
}

const ICON_SIZE = 100;

const EffectGrid: React.FC<Props> = ({
  children,
  data,
  checked,
  selected,
  effectType,
  isMobile,
  onSelect,
}) => {
  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ display: "flex" }} className="row">
        {data.map((item, index) => (
          <div
            key={index}
            style={{ minWidth: "280px" }}
            className={`col-3 position-relative ${isMobile? "mx-auto" : ""}`}
          >
            <Zoom
              onClick={() => {
                onSelect(item.id);
              }}
              in={checked}
              style={{ transitionDelay: checked ? `${index * 100}ms` : "0ms", zIndex: 1, backgroundColor: "transparent" }}
            >
              {children(item, index)}
            </Zoom>
            {item.id === selected && (
              <div className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center">
                <CheckRoundIcon
                  height={ICON_SIZE}
                  width={ICON_SIZE}
                  style={{opacity: 0.5}}
                  fill={"pink"}
                />
              </div>
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default EffectGrid;
