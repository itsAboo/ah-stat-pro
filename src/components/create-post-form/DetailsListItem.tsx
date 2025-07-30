import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import MatchForm from "./MatchForm";
import { useState } from "react";
import { IMatch } from "./schemas";
import MatchTableDetails from "./MatchTableDetails";

interface DetailsListItemProps {
  index: number;
  matches: IMatch[];
  type: "HDP" | "OU";
  ahSide?: "HOME" | "AWAY";
  start: string;
  end: string;
  onAddMatch: (match: IMatch, index: number) => void;
  removeMatch: (groupIndex: number, matchIndexes: number[]) => void;
}

export default function DetailsListItem(props: DetailsListItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemText>
          <span>
            Type : <span className="font-semibold">{props.type}</span>
          </span>
          <span className="font-semibold mx-2 text-primary">|</span>
          {props.type === "HDP" && (
            <>
              <span>
                AH Side : <span className="font-semibold">{props.ahSide}</span>
              </span>
              <span className="font-semibold mx-2 text-primary">|</span>
            </>
          )}
          <span>
            AH Start <span className="font-semibold">{props.start}</span>
          </span>
          <span className="font-semibold mx-2 text-primary">|</span>
          <span>
            AH End <span className="font-semibold">{props.end}</span>
          </span>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} unmountOnExit>
        <Paper sx={{ p: 2 }}>
          {props.matches?.length > 0 && (
            <MatchTableDetails
              removeMatch={props.removeMatch}
              matches={props.matches || []}
              groupIndex={props.index}
            />
          )}
          <MatchForm
            onAddMatch={(match) => props.onAddMatch(match, props.index)}
          />
        </Paper>
      </Collapse>
    </>
  );
}
