import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { HandicapMovement, handicapMovementSchema } from "./schemas";

const ahSchema = handicapMovementSchema;

type AHFormData = HandicapMovement;

interface AHFormProps {
  onAdd: (value: AHFormData) => void;
  existingItems: AHFormData[];
  onErrorChange?: (hasError: boolean) => void;
}

export default function AHForm({
  onAdd,
  existingItems,
  onErrorChange,
}: AHFormProps) {
  const [formData, setFormData] = useState<AHFormData>({
    type: "HDP",
    start: "",
    end: "",
    ahSide: "HOME",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AHFormData, string>>
  >({});

  const handleChange = (key: keyof AHFormData, value: string) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    if (Object.keys(errors).length > 0) {
      return;
    }

    const trimmedFormData = {
      ...formData,
      start: formData.start.trim(),
      end: formData.end.trim(),
    };

    const isDuplicate = existingItems.some(
      (item) =>
        item.type === trimmedFormData.type &&
        item.start.trim() === trimmedFormData.start &&
        item.end.trim() === trimmedFormData.end &&
        item.ahSide === trimmedFormData.ahSide
    );

    if (isDuplicate) {
      setErrors({
        start: "This combination already exists",
        end: "This combination already exists",
      });
      return;
    }

    const result = ahSchema.safeParse(trimmedFormData);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof AHFormData;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onAdd(result.data);
    setFormData((prev) => ({ ...prev, start: "", end: "" }));
    setErrors({});
  };

  useEffect(() => {
    onErrorChange?.(Object.keys(errors).length > 0);
  }, [errors, onErrorChange]);

  return (
    <>
      <FormControl fullWidth margin="normal" error={!!errors.type}>
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <MenuItem value="HDP">HDP</MenuItem>
          <MenuItem value="OU">OU</MenuItem>
        </Select>
        <FormHelperText>{errors.type || "Handicap , O/U"}</FormHelperText>
      </FormControl>
      {formData.type === "HDP" && (
        <FormControl fullWidth margin="normal" error={!!errors.ahSide}>
          <InputLabel>AH Side</InputLabel>
          <Select
            label="AH Side"
            value={formData.ahSide}
            onChange={(e) => handleChange("ahSide", e.target.value)}
          >
            <MenuItem value="HOME">Home</MenuItem>
            <MenuItem value="AWAY">Away</MenuItem>
          </Select>
          <FormHelperText>
            {errors.ahSide || "Which side to start AH (HOME/AWAY)"}
          </FormHelperText>
        </FormControl>
      )}
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <TextField
          autoComplete="off"
          fullWidth
          margin="normal"
          label="Start"
          value={formData.start}
          helperText={
            errors.start ||
            `${
              formData.type === "HDP" ? "e.g. 0.25 0.5 -0.75" : "e.g. 2.5 2.75"
            }`
          }
          onChange={(e) => handleChange("start", e.target.value)}
          error={!!errors.start}
        />
        <TextField
          autoComplete="off"
          fullWidth
          margin="normal"
          label="End"
          value={formData.end}
          helperText={
            errors.end ||
            `${
              formData.type === "HDP" ? "e.g. 0.25 0.5 -0.75" : "e.g. 2.5 2.75"
            }`
          }
          onChange={(e) => handleChange("end", e.target.value)}
          error={!!errors.end}
        />
      </div>
      <div className="w-full flex justify-end">
        <Button
          type="button"
          sx={{ color: "white" }}
          color="success"
          variant="contained"
          onClick={handleAdd}
        >
          Add HDP
        </Button>
      </div>
    </>
  );
}
