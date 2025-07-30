import { z } from "zod";

export const matchSchema = z.object({
  home: z.string().optional(),
  away: z.string().optional(),
  league: z.string().optional(),
  matchDay: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: "Date must be in DD/MM/YYYY format",
  }),
  fullTimeScore: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional()
    .refine(
      (val) => val === undefined || /^\d{1,2}-\d{1,2}$/.test(val),
      "Invalid format. It must be in the format of x-x (e.g., 0-0, 1-2)"
    ),
  result: z.enum(["W", "L", "D", "P"]),
});

export const handicapMovementSchema = z
  .object({
    type: z.enum(["HDP", "OU"]),
    ahSide: z.enum(["HOME", "AWAY"]),
    start: z
      .string()
      .regex(/^[+-]?\d+(?:\.(?:25|5|75))?$/, "Invalid odds format"),
    end: z
      .string()
      .regex(/^[+-]?\d+(?:\.(?:25|5|75))?$/, "Invalid odds format"),
    matches: z.array(matchSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const startVal = parseFloat(data.start);
    const endVal = parseFloat(data.end);

    const minAllowed = data.type === "OU" ? 1.5 : 0;
    const maxAllowed = 10;

    if (startVal < minAllowed || startVal > maxAllowed) {
      ctx.addIssue({
        path: ["start"],
        code: z.ZodIssueCode.custom,
        message: `Start must be between ${minAllowed} and ${maxAllowed}`,
      });
    }

    if (endVal < minAllowed || endVal > maxAllowed) {
      ctx.addIssue({
        path: ["end"],
        code: z.ZodIssueCode.custom,
        message: `End must be between ${minAllowed} and ${maxAllowed}`,
      });
    }

    if (data.start === data.end) {
      ctx.addIssue({
        path: ["start"],
        code: z.ZodIssueCode.custom,
        message: "Start and end must not be the same",
      });
      ctx.addIssue({
        path: ["end"],
        code: z.ZodIssueCode.custom,
        message: "Start and end must not be the same",
      });
    }
  });

export interface IMatch {
  home?: string;
  away?: string;
  league?: string;
  matchDay: string;
  fullTimeScore?: string;
  result: "W" | "L" | "D" | "P";
}

export type HandicapMovement = z.infer<typeof handicapMovementSchema>;

export type MatchSchema = z.infer<typeof matchSchema>;
