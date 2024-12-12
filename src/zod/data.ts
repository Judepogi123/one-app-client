import z from "zod";

export const UserSchema = z.object({
  phoneNumber: z.string(),
  password: z.string().min(8, "Must have at least characters"),
});

export const AuthUser = z.object({
  phoneNumber: z.string(),
  lastname: z.string(),
  firstname: z.string(),
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
  dynamicMembers: z.record(z.string()).optional()
});
