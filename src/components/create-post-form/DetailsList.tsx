import { Button, List } from "@mui/material";

import DetailsListItem from "./DetailsListItem";
import { IMatch } from "./schemas";
import ConfirmModal from "../UI/ConfirmDialog";
import { useState } from "react";

export interface IDetailsListItem {
  matches?: IMatch[];
  type: "HDP" | "OU";
  ahSide?: "HOME" | "AWAY";
  start: string;
  end: string;
}

interface IDetailsList {
  detailsList: IDetailsListItem[];
  onAddMatch: (match: IMatch, index: number) => void;
  removeMatch: (groupIndex: number, matchIndexes: number[]) => void;
  removeAHList: (index: number) => void;
}

export default function DetailsList(props: IDetailsList) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number | undefined>();
  return (
    <>
      <ul>
        {props.detailsList?.map((e, i) => (
          <div key={i}>
            <List
              component="li"
              sx={{
                width: "100%",
                bgcolor: "appBg.main",
                my: 1,
                borderRadius: "4px",
              }}
              disablePadding
            >
              <DetailsListItem
                key={i}
                index={i}
                start={e.start}
                end={e.end}
                type={e.type}
                ahSide={e.ahSide}
                onAddMatch={props.onAddMatch}
                matches={e.matches || []}
                removeMatch={props.removeMatch}
              />
            </List>
            <Button
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              color="error"
            >
              Delete
            </Button>
          </div>
        ))}
      </ul>
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        title="Are you sure?"
        description="Are you sure you want to delete this? This action cannot be undone"
        onConfirm={() => props.removeAHList(index!)}
      />
    </>
  );
}
