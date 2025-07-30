import {
  Autocomplete,
  TextField,
  AutocompleteRenderInputParams,
} from "@mui/material";

interface AutoCompleteTextFieldProps<T> {
  value: string;
  options: T[];
  label: string;
  getOptionLabel: (option: T) => string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  margin?: "dense" | "none" | "normal";
}

export default function AutoCompleteTextField<T>({
  value,
  options,
  label,
  getOptionLabel,
  onChange,
  error,
  helperText,
  margin,
}: AutoCompleteTextFieldProps<T>) {

  const stringOptions = options.map(getOptionLabel);

  return (
    <Autocomplete
      freeSolo
      options={stringOptions}
      value={value || ""}
      onChange={(_, newValue) => {
        onChange(newValue || "");
      }}
      onInputChange={(_, inputValue, reason) => {
        if (reason === "input") {
          onChange(inputValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = options.filter((option) =>
          option?.toLowerCase().includes(params.inputValue.toLowerCase())
        );

        const exists = options.some(
          (opt) => opt?.toLowerCase() === params.inputValue.toLowerCase()
        );

        if (params.inputValue !== "" && !exists) {
          filtered.push(params.inputValue); 
        }

        return filtered;
      }}
      renderOption={(props, option) => {
        const {key,...otherProps} = props
        return <li key={key} {...otherProps}>
          {stringOptions.includes(option) ? option : `Add "${option}"`}
        </li>
      }}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          margin={margin}
          label={label}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}
