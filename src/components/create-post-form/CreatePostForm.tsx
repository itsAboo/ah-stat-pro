import z from "zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AHForm from "./AHForm";
import DetailsList from "./DetailsList";
import { handicapMovementSchema } from "./schemas";
import {
  useLeaveFormConfirm,
  useUnloadWarning,
} from "../../hooks/leave-confirm";
import { useState } from "react";
import { useCreatePost } from "../../hooks/post";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .max(120, "Description must have below 120 characters"),
  access: z.enum(["public", "private"]),
  handicapMovements: z.array(handicapMovementSchema).optional(),
});

export type PostFormData = z.infer<typeof formSchema>;

export default function CreatePostForm() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid, isDirty },
    setValue,
    getValues,
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      handicapMovements: [],
      access: "public",
    },
    mode: "onChange",
    criteriaMode: "all",
  });

  const [ahFormHasError, setAhFormHasError] = useState(false);
  const [submittedWithError, setSubmittedWithError] = useState(false);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { append, remove } = useFieldArray({
    control,
    name: "handicapMovements",
  });

  const handicapMovements = useWatch({
    control,
    name: "handicapMovements",
  });

  const access = useWatch({
    control,
    name: "access",
  });

  const navigate = useNavigate();
  const { snackbar } = useSnackbar();

  const { isPending, mutate } = useCreatePost({
    onSuccess: () => {
      reset();
      snackbar({
        autoHideDuration: 3000,
        message: "Post created successfully",
      });
      navigate("/");
    },
  });

  const onSubmit = (data: PostFormData) => {
    setIsSubmitted(true);
    setMutateError(null);
    setSubmittedWithError(false);
    mutate(data, {
      onError: (err) => {
        setMutateError(err.message || "Invalid values");
        setIsSubmitted(false);
      },
    });
  };

  const onError = () => {
    setSubmittedWithError(true);
  };

  const removeMatch = (groupIndex: number, matchIndexes: number[]) => {
    const currentMatches =
      getValues(`handicapMovements.${groupIndex}.matches`) || [];
    const updateMatches = currentMatches.filter(
      (_, i) => !matchIndexes.includes(i)
    );
    setValue(`handicapMovements.${groupIndex}.matches`, updateMatches);
  };

  useLeaveFormConfirm(
    isDirty && !isSubmitted,
    "Are you sure you want to leave this page? All unsaved changes will be lost."
  );

  useUnloadWarning(isDirty);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <TextField
        id="title"
        label="Title"
        margin="normal"
        fullWidth
        error={!!errors.title}
        helperText={errors.title?.message || "must be at least 6 characters"}
        {...register("title")}
      />
      <TextField
        id="description"
        label="Description"
        margin="normal"
        fullWidth
        error={!!errors.description}
        helperText={errors.description?.message || "Optional"}
        {...register("description")}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select
          {...register("access")}
          label="Type"
          error={!!errors.access}
          value={access}
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </Select>
        <FormHelperText>
          {errors.access?.message || "Public , Private"}
        </FormHelperText>
      </FormControl>
      <div>
        <h2 className="font-semibold text-xl my-2">Details</h2>
        <DetailsList
          removeAHList={remove}
          removeMatch={removeMatch}
          onAddMatch={(match, index) => {
            const current =
              getValues(`handicapMovements.${index}.matches`) || [];
            setValue(`handicapMovements.${index}.matches`, [...current, match]);
          }}
          detailsList={handicapMovements || []}
        />
        <AHForm
          onAdd={(item) => append(item)}
          existingItems={handicapMovements || []}
          onErrorChange={setAhFormHasError}
        />
        {!!mutateError && <p className="text-red-500">{mutateError}</p>}
        <Button
          type="submit"
          disabled={
            ((submittedWithError || !!mutateError) &&
              (!isValid || ahFormHasError)) ||
            isPending
          }
          sx={{ mt: 4, height: "40px" }}
          variant="contained"
          fullWidth
        >
          {isPending ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
}
