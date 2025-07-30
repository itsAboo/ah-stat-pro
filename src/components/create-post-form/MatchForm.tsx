import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IMatch, matchSchema, MatchSchema } from "./schemas";
import { useState } from "react";
import { convertDateToStringDDMMYYYY } from "../../util/transform";
import AutoCompleteTextField from "../UI/AutoCompleteTextField";
import { league } from "../../util/league";
import teams from "../../util/teams";

export interface MatchFormProps {
  onAddMatch: (match: IMatch) => void;
}

const matchFormSchema = matchSchema;

type MatchFormData = MatchSchema;

export default function MatchForm({ onAddMatch }: MatchFormProps) {
  const [formData, setFormData] = useState<MatchFormData>({
    home: "",
    away: "",
    league: "",
    matchDay: convertDateToStringDDMMYYYY(new Date()),
    fullTimeScore: "",
    result: "P",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof MatchFormData, string>>
  >({});

  const handleChange = (key: keyof MatchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleAddMatch = () => {
    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = matchFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof MatchFormData;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onAddMatch(result.data);

    setFormData({
      home: "",
      away: "",
      league: "",
      fullTimeScore: "",
      matchDay: convertDateToStringDDMMYYYY(new Date()),
      result: "P",
    });
    setErrors({});
  };

  return (
    <>
      <AutoCompleteTextField
        margin="normal"
        value={formData.home!}
        options={teams.filter((t) => t.name !== formData.away)}
        label="Home"
        getOptionLabel={(opt) => opt.name!}
        onChange={(val) => handleChange("home", val)}
        error={!!errors.home}
        helperText={errors.home || "Home team name"}
      />
      <AutoCompleteTextField
        margin="normal"
        value={formData.away!}
        options={teams.filter((t) => t.name !== formData.home)}
        label="Away"
        getOptionLabel={(opt) => opt.name!}
        onChange={(val) => handleChange("away", val)}
        error={!!errors.away}
        helperText={errors.away || "Away team name"}
      />
      <AutoCompleteTextField
        margin="normal"
        value={formData.league!}
        options={league}
        label="League"
        getOptionLabel={(opt) => opt.name}
        onChange={(val) => handleChange("league", val)}
        error={!!errors.league}
        helperText={errors.league || "League match"}
      />

      <div className="flex flex-col sm:flex-row sm:gap-4">
        <TextField
          value={formData.matchDay}
          onChange={(e) => handleChange("matchDay", e.target.value)}
          error={!!errors.matchDay}
          fullWidth
          margin="normal"
          label="Match Day"
          helperText={errors.matchDay || "DD/MM/YYYY"}
        />
        <TextField
          value={formData.fullTimeScore}
          onChange={(e) => handleChange("fullTimeScore", e.target.value)}
          error={!!errors.fullTimeScore}
          fullWidth
          margin="normal"
          label="Full Time Score"
          helperText={errors.fullTimeScore || "Optional , e.g. 0-0 1-3"}
        />
      </div>
      <FormControl fullWidth margin="normal">
        <InputLabel>Match result</InputLabel>
        <Select
          onChange={(e) => handleChange("result", e.target.value)}
          label="Match result"
          value={formData.result}
        >
          <MenuItem value="P">Pending</MenuItem>
          <MenuItem value="W">Win</MenuItem>
          <MenuItem value="L">lose</MenuItem>
          <MenuItem value="D">Draw</MenuItem>
        </Select>
        <FormHelperText>Status of match result</FormHelperText>
      </FormControl>
      <div className="flex justify-end">
        <Button
          onClick={handleAddMatch}
          type="button"
          sx={{ color: "white" }}
          color="success"
          variant="contained"
        >
          Add Match
        </Button>
      </div>
    </>
  );
}
