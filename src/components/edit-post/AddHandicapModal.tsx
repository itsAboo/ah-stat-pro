import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  HandicapMovement,
  handicapMovementSchema,
} from "../create-post-form/schemas";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackdropProgress from "../UI/BackdropProgress";
import { useAddHandicap } from "../../hooks/handicap-movement";
import { useEffect } from "react";

const ahSchema = handicapMovementSchema;

type AHFormData = HandicapMovement;

interface AddHandicapModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  activeTableIndex: number;
  onSetActiveTableIndex: (index: number) => void;
}

export default function AddHandicapModal(props: AddHandicapModalProps) {
  const defaultValues: AHFormData = {
    type:
      props.activeTableIndex === 0 || props.activeTableIndex === 1
        ? "HDP"
        : "OU",
    ahSide: "HOME",
    start: "",
    end: "",
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
    clearErrors,
    watch,
    control
  } = useForm<AHFormData>({
    resolver: zodResolver(ahSchema),
    defaultValues,
  });

  const { mutate, isPending, error } = useAddHandicap({
    onSuccess: () => {
      props.onSetActiveTableIndex(
        type === "HDP" && ahSide === "HOME"
          ? 0
          : type === "HDP" && ahSide === "AWAY"
          ? 1
          : 2
      );
      props.onClose();
      reset();
    },
  });

  const onSubmit = (data: AHFormData) => {
    mutate({ ...data, postId: props.postId });
  };

  const handleClose = () => {
    props.onClose();
    reset();
  };

  useEffect(() => {
    if (error?.message) {
      setError("start", {
        type: "validate",
        message: error.message,
      });
      setError("end", {
        type: "validate",
        message: error.message,
      });
    }
  }, [error?.message, setError]);

  const type = watch("type");
  const ahSide = watch("ahSide");
  const start = watch("start");
  const end = watch("end");

  useEffect(() => {
    clearErrors(["start", "end"]);
  }, [start, end, clearErrors]);

useEffect(() => {
  if (props.open) {
    reset({
      type:
        props.activeTableIndex === 0 || props.activeTableIndex === 1
          ? "HDP"
          : "OU",
      ahSide: props.activeTableIndex === 1 ? "AWAY" : "HOME",
      start: "",
      end: "",
    });
  }
}, [props.open, props.activeTableIndex, reset]);


  return (
    <>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>Add Handicap</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal" error={!!errors.type}>
              <InputLabel>Type</InputLabel>
              <Controller
                name="type"
                control={control}
                defaultValue={defaultValues.type}
                render={({ field }) => (
                  <Select label="Type" {...field}>
                    <MenuItem value="HDP">HDP</MenuItem>
                    <MenuItem value="OU">OU</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.type?.message || "Handicap , O/U"}
              </FormHelperText>
            </FormControl>
            {type === "HDP" && (
              <FormControl fullWidth margin="normal" error={!!errors.ahSide}>
                <InputLabel>AH Side</InputLabel>
                <Controller
                  name="ahSide"
                  control={control}
                  defaultValue={defaultValues.ahSide}
                  render={({ field }) => (
                    <Select label="AH Side" {...field}>
                      <MenuItem value="HOME">Home</MenuItem>
                      <MenuItem value="AWAY">Away</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>
                  {errors.ahSide?.message ||
                    "Which side to start AH (HOME/AWAY)"}
                </FormHelperText>
              </FormControl>
            )}

            <div className="flex flex-col sm:flex-row sm:gap-4">
              <TextField
                autoComplete="off"
                fullWidth
                margin="normal"
                label="Start"
                {...register("start")}
                helperText={
                  errors.start?.message ||
                  `${type === "HDP" ? "e.g. 0.25 0.5 -0.75" : "e.g. 2.5 2.75"}`
                }
                error={!!errors.start}
              />
              <TextField
                autoComplete="off"
                fullWidth
                margin="normal"
                label="End"
                {...register("end")}
                helperText={
                  errors.end?.message ||
                  `${type === "HDP" ? "e.g. 0.25 0.5 -0.75" : "e.g. 2.5 2.75"}`
                }
                error={!!errors.end}
              />
            </div>
            <div className="w-full flex justify-end">
              <Button
                disabled={isPending || !!errors.start || !!errors.end}
                type="submit"
                sx={{ color: "white" }}
                color="success"
                variant="contained"
              >
                Add HDP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {props.open && <BackdropProgress open={isPending} />}
    </>
  );
}
