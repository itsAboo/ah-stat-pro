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
import { matchSchema } from "../create-post-form/schemas";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackdropProgress from "../UI/BackdropProgress";
import { z } from "zod";
import AutoCompleteTextField from "../UI/AutoCompleteTextField";
import teams from "../../util/teams";
import { league as leagueList } from "../../util/league";
import { convertDateToStringDDMMYYYY } from "../../util/transform";
import { useAddMatch } from "../../hooks/handicap-movement";

type MatchFormData = z.infer<typeof matchSchema>;

interface AddHandicapModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  handicapMovementId: string;
}

const defaultValues: MatchFormData = {
  matchDay: convertDateToStringDDMMYYYY(new Date()),
  home: "",
  away: "",
  league: "",
  fullTimeScore: "",
  result: "P",
};

export default function AddMatchModal(props: AddHandicapModalProps) {
  const {
    control,
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<MatchFormData>({
    resolver: zodResolver(matchSchema),
    defaultValues,
  });

  const { mutate, isPending } = useAddMatch({
    onSuccess: () => {
      reset();
      props.onClose();
    },
  });

  const home = useWatch({
    control,
    name: "home",
  });

  const away = useWatch({
    control,
    name: "away",
  });

  const onSubmit = async (data: MatchFormData) => {
    mutate({
      ...data,
      postId: props.postId,
      handicapMovementId: props.handicapMovementId,
    });
  };

  return (
    <>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Add Match</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="home"
              render={({ field }) => (
                <AutoCompleteTextField
                  margin="normal"
                  value={field.value!}
                  onChange={(val) => field.onChange(val)}
                  options={teams.filter((t) => t.name !== away)}
                  label="Home"
                  getOptionLabel={(opt) => opt.name!}
                  error={!!errors.home}
                  helperText={errors.home?.message || "Home team name"}
                />
              )}
            />
            <Controller
              control={control}
              name="away"
              render={({ field }) => (
                <AutoCompleteTextField
                  margin="normal"
                  value={field.value!}
                  options={teams.filter((t) => t.name !== home)}
                  label="Away"
                  getOptionLabel={(opt) => opt.name!}
                  onChange={(val) => field.onChange(val)}
                  error={!!errors.away}
                  helperText={errors.away?.message || "Away team name"}
                />
              )}
            />
            <Controller
              control={control}
              name="league"
              render={({ field }) => (
                <AutoCompleteTextField
                  margin="normal"
                  value={field.value!}
                  options={leagueList}
                  label="League"
                  getOptionLabel={(opt) => opt.name}
                  onChange={(val) => field.onChange(val)}
                  error={!!errors.league}
                  helperText={errors.league?.message || "League match"}
                />
              )}
            />
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <TextField
                autoComplete="off"
                fullWidth
                margin="normal"
                label="Match day"
                {...register("matchDay")}
                helperText={errors.matchDay?.message || "DD/MM/YYYY"}
                error={!!errors.matchDay}
              />
              <TextField
                autoComplete="off"
                fullWidth
                margin="normal"
                label="Full-time score"
                {...register("fullTimeScore")}
                helperText={
                  errors.fullTimeScore?.message || "Optional , e.g. 0-0 1-3"
                }
                error={!!errors.fullTimeScore}
              />
            </div>

            <FormControl fullWidth margin="normal" error={!!errors.result}>
              <InputLabel>AH Side</InputLabel>
              <Select
                label="AH Side"
                defaultValue={defaultValues.result}
                {...register("result")}
              >
                <MenuItem value="P">Pending</MenuItem>
                <MenuItem value="W">Win</MenuItem>
                <MenuItem value="L">Lose</MenuItem>
                <MenuItem value="D">Draw</MenuItem>
              </Select>
              <FormHelperText>
                {errors.result?.message || "Status of match result"}
              </FormHelperText>
            </FormControl>

            <div className="w-full flex justify-end">
              <Button
                disabled={isPending}
                type="submit"
                sx={{ color: "white" }}
                color="success"
                variant="contained"
              >
                Add Match
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {props.open && <BackdropProgress open={isPending} />}
    </>
  );
}
