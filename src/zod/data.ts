import z from "zod";

export const UserSchema = z.object({
  phoneNumber: z.string(),
  password: z.string().min(8, "Must have at least characters"),
  showPassword: z.boolean().optional()
});

export const AuthUser = z.object({
  username: z.string(),
  role: z.number(),
  forMunicipal: z.number(),
  accessToken: z.string(),
  uid: z.string(),
});

export const VoterSchema = z.object({
  id: z.string(),
  lastname: z.string(),
  firstname: z.string(),
  uid: z.string().optional(),
  municipalsId: z.number(),
  barangaysId: z.string(),
  precentsId: z.string().optional(),
  purok: z.string().optional(),
  status: z.number(),
  level: z.number(),
  saveStatus: z.string().optional(),
  teamLeaderId: z.string().optional(),
  pwd: z.string(),
  oor: z.string(),
  inc: z.string(),
  illi: z.string(),
  inPurok: z.boolean().optional(),
  hubId: z.string().optional(),
  newBatchDraftId: z.string().optional(),
  birthYear: z.string().optional(),
  calcAge: z.number(),
  houseHoldId: z.string().optional(),
});

export const VotersSchema = z.object({
  voters: z.array(VoterSchema),
});

export const MunicipalSchema = z.object({
  id: z.number(),
  name: z.string(),
  barangaysCount: z.number(),
});

export const MunicipalsSchema = z.object({
  municipals: z.array(MunicipalSchema),
});

export const MunicipalVoterSchema = z.object({
  lastname: z.string(),
  firstname: z.string(),
  uid: z.string(),
  municipalsId: z.number(),
  barangaysId: z.string(),
  precentsId: z.string(),
  purok: z.string(),
  status: z.number(),
  level: z.number(),
  barangay: z.object({
    name: z.string(),
  }),
});

export const MunicipalVoterListSchema = z.object({
  municipalVoterList: z.array(MunicipalVoterSchema),
});

export const PrecintsSchema = z.object({
  barangayID: z.string(),
  voters: z.array(VoterSchema).optional(),
});

export const PurokSchema = z.object({
  purokNumber: z.string(),
  barangaysId: z.string(),
  municipalsId: z.number(),
});
export const BarangaySchema = z.object({
  name: z.string().min(3, "Invalid name!"),
  id: z.string(),
  barangayVotersCount: z.number(),
  puroks: z.array(PurokSchema),
  purokCount: z.number(),
});

export const NewVoterBatchSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  municipalsId: z.number(),
  barangaysId: z.string(),
  municipal: z.object(MunicipalSchema.shape),
  barangay: z.object(BarangaySchema.shape),
});

export const DraftSchema = z.object({
  id: z.string(),
  municipal: z.object(MunicipalSchema.shape),
  barangay: z.object(BarangaySchema.shape),
  timestamp: z.string(),
  municpalId: z.number(),
  barangayId: z.string(),
  drafted: z.boolean(),
});

export const BarangayCoorSchema = z.object({
  code: z.string().min(2, "Must have at least 2 characters"),
});

export const TeamInputSchema = z.object({
  zipCode: z.string().min(1, "Municipal ID is required"),
  barangayCoorId: z.string().min(1, "Barangay Coor Tag ID is required"),
  purokCoorId: z.string().min(1, "Barangay Coor Tag ID is required"),
  barangayID: z.string().min(1, "Barangay ID is required"),
  teamLeaderID: z.string().min(1, "Team Leader ID is required"),
  dynamicMembers: z.record(z.string()).optional(),
});

export const NewAccountSchema = z
  .object({
    username: z.string(),
    password: z.string().min(8, "Must have at least 8 characters"),
    role: z.string(),
    forMunicipal: z.string().optional(),
    purpose: z
      .string()
      .min(1, "Minimum role of 1")
      .max(4, "Maximum role of 4")
      .optional(),
    adminPassword: z
      .string()
      .min(8, "Must have at least 8 characters")
      .optional(),
    encryptPassword: z.boolean().optional()
  })
  .refine(
    (data) =>
      data.role !== "100" ||
      (data.adminPassword && data.adminPassword.length >= 8),
    {
      message:
        "Admin password is required and must be at least 8 characters when role is for creating Super Account.",
      path: ["adminPassword"],
    }
  );

export const NewVoterSchema = z.object({
  idNumber: z.string().min(1, "ID Number is required"),
  firstname: z
    .string()
    .min(1, "First name is required")
    .min(2, "At least 2 characters"),
  lastname: z
    .string()
    .min(1, "Last name is required")
    .min(2, "At least 2 characters"),
  municipalsId: z.number(),
  barangaysId: z.string(),
  purokId: z.string().optional(),
  purokName: z.string(),
  gender: z.string(),
  or: z.string(),
  status: z.number(),
  level: z.string(),
  pwd: z.string(),
  illi: z.string(),
  inc: z.string(),
  youth: z.string(),
  senior: z.string(),
  supporting: z.string(),
});

export const ValidatedTeamsFormSchema = z.object({
  zipCOde: z.string().min(4, "Municipal code is required"),
  barangay: z.string().min(1, "Barangay number is required"),
  from: z.string().min(1, "From number is required"),
  take: z.string().min(1, "To number is required"),
  minMembers: z.string().min(1, "Minimum members is required"),
  maxMembers: z.string().min(1, "Maximum members is required"),
});

export const GenerateTeamSchema = z.object({
  delisted: z.boolean().default(false),
  ud: z.boolean().default(false),
  nd: z.boolean().default(false),
  op: z.boolean().default(false),
  or: z.boolean().default(false),
  inc: z.boolean().default(false),
  dead: z.boolean().default(false),
  selected: z.boolean().default(false),
  headOnly: z.boolean().default(false),
  membersCount: z.string().default("all")
})
