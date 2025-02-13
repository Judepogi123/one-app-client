/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ExcelData {
  [key: string]: any;
}

export interface AdminUser {
  uid: string;
  password: string;
  phoneNumber: string;
  lastname: string;
  firstname: string;
}

export interface UserProps {
  uid: string;
  username: string;
  password: string;
  role: number;
  purpose: number;
  status: number;
  timestamp: Date;
  privilege: number[];
  userQRCodeId?: string | null; 
  qrCode?: UserQRCodeProps | null; // Single optional relation
  accountHandleTeam: AccountHandleTeam[]
  accessToken: string
}
export interface AccountHandleTeam {
  id: string; 
  account?: UserProps;
  usersUid?: string;
  team?: TeamProps; 
  teamId: string; 
  municipal?: MunicipalProps; 
  municipalsId?: number;
  barangay?: BarangayProps; 
  barangaysId?: string;  
  accountValidateTeamId?: string; 
}

export interface AccountValidateTeam {
  id: string;
  account?: UserProps;
  usersUid?: string;
  team?: TeamProps; // Optional because of `Team?`
  teamId?: string;
  municipal?: MunicipalProps; // Optional because of `Municipals?`
  municipalsId?: number;
  barangay?: BarangayProps; // Optional because of `Barangays?`
  barangaysId?: string;
  timstamp?: string; // `DateTime?` in Prisma corresponds to `Date` in TypeScript
  AccountHandleTeam?: AccountHandleTeam; // Optional reference
}
export interface ValdilatedMember {
  id: string;
  voter?: VotersProps | null;
  votersId?: string | null;
  team?: TeamProps | null;
  teamId?: string | null;
  timestamp: string;
}

export interface UserQRCodeProps {
  id: string;
  qrCode: string;
  Users: UserProps;
}

export interface ExcelResponse {
  [sheetName: string]: UploadProps[];
}

export interface PostionProps {
  id: string;
  title: string;
}

export interface CandidatesProps {
  id: string;
  lastname: string;
  firstname: string;
  position?: PostionProps;
  colorCode: string;
  code?: string | null;
  desc?: string | null;
  image?: MediaUrl | null;
  candidateBatchId: string;
  mediaUrlId?: string | null;
  positionId?: string | null;
  supporters: number;
  inTeam: AllSupporters;
}

interface AllSupporters {
  figureHeads: number;
  bc: number;
  pc: number;
  tl: number;
  withTeams: number;
  voterWithoutTeam: number;
}

export interface TeamStatProps {
  aboveMax: number;
  belowMax: number;
  equalToMax: number;
  aboveMin: number;
  equalToMin: number;
  belowMin: number;
  threeAndBelow: number;
}

export interface ValidationProps {
  id: string;
  timestamp: string;
  municipal: MunicipalProps;
  percent: number;
  totalVoters: number;
  municipalsId: number;
  barangay: BarangayProps;
  barangaysId: string;
}

export interface VotersProps {
  id: string;
  lastname: string;
  firstname: string;
  idNumber: string;
  gender?: string;
  barangay: BarangayProps;
  municipal: MunicipalProps;
  status: number;
  calcAge: number;
  birthYear: string;
  level: number;
  barangaysId: string;
  municipalsId: number;
  precintsId?: string | null;
  saveStatus: string;
  mobileNumber?: string | null;
  houseHoldId?: string | null;
  newBatchDraftId?: string | null;
  purok?: PurokProps | null;
  pwd?: string | null;
  oor?: string | null;
  inc?: string | null;
  illi?: string | null;
  inPurok?: boolean | null;
  senior?: boolean | null;
  youth?: boolean | null;
  hubId?: string | null;
  qrCode?: string | null;
  candidatesId?: string | null;
  qrCodes: QRCodeProps[];
  qrCodeNumber: number;
  teamId?: string;
  leader?: TeamLeaderProps;
  record: VoterRecord[];
  ValdilatedMember: ValdilatedMember
  untracked: UntrackedVoter
}
export interface UntrackedVoter {
  id: string;
  note?: string;
  voter?: VotersProps | null;
  votersId?: string | null;
  team?: TeamProps | null;
  teamId?: string | null;
  timestamp: string;
  user?: UserProps | null;
  usersUid?: string | null;
  barangay?: BarangayProps | null;
  barangaysId?: string | null;
  municipal?: MunicipalProps | null;
  municipalsId?: number | null;
}

export interface VoterRecord {
  id: string;
  desc: string;
  questionable: boolean;
  timestamp: string; // Use string for DateTime fields to align with GraphQL responses
  voter?: VotersProps; // Optional relation to Voter
  votersId?: string; // Optional votersId field
  user?: UserProps; // Optional relation to User
  usersUid?: string; // Optional usersUid field
}
export interface PurokProps {
  purokNumber: string;
  barangaysId: string;
  municipalsId?: number;
  id?: string;
}
export interface BarangayProps {
  name: string;
  id: string;
  number: number;
  barangayVotersCount: number;
  puroks: PurokProps[];
  purokCount: number;
  sampleSize: number;
  population: number;
  quota: QuotaProps[] | null;
  surveyor: number;
  activeSurveyor: number;
  femaleSize: number;
  maleSize: number;
  validationList: ValidationProps[];
  supporters: AllSupporters;
  teamStat: TeamStatProps
  leaders: TeamLeaderProps[]
  barangayDelistedVoter: number
  teamValidationStat: TeamValidationStat
  teams: TeamProps[]
}
export interface TeamValidationStat {
  teamLeadersCount: number;
  members: number;
  validatedTL: number;
  validatedMembers: number;
  untrackedMembers: number;
}
export interface MunicipalProps {
  id: number;
  name: string;
  barangaysCount: number;
}

export interface QRCodeProps {
  id: string;
  number: number;
  qrCode: string;
  timestamp: string;
  voter: VotersProps;
  votersId: string;
  stamp: number;
  scannedDateTime: string | null;
}

export interface UploadProps {
  id: string;
  No?: string;
  "Voter's Name"?: string;
  lastname: string;
  firstname: string;
  Gender: string;
  gender: string;
  __EMPTY?: string | null;
  Address: string;
  Birthday?: string | number | null;
  DL: string;
  PWD: string;
  IL: string;
  INC: string;
  OR: string;
  calcAge: number;
  purok: PurokProps;
  birthYear: string;
  "18-30": string;
  candidateId?: string;
}

export interface DraftedProps {
  id: string;
  No?: string;
  "Voter's Name"?: string;
  lastname: string;
  firstname: string;
  __EMPTY?: string | null;
  gender: string;
  Address: string;
  inPurok: boolean;
  "B-day"?: string;
  pwd: string;
  illi: string;
  inc: string;
  oor: string;
  calcAge: number;
  purok: PurokProps;
  birthYear: string;
  senior: boolean;
  youth: boolean;
}

export interface DraftedPurok {
  id: string;
  name: string;
  barangaysId: string;
  municipalsId: string;
  purokNumber: string;
  purokDraftedVotersCount: number;
  draftID: string;
}
export interface DraftedSurvey {
  timestamp: string;
  adminUserId: string;
  tagID: string;
  drafted: boolean;
  status: string;
  id: string;
  admin: AdminUser;
  queries: QueryProps[];
}

export interface OptionProps {
  id: string;
  order: number;
  title: string;
  desc: string;
  mediaUrlId: string;
  queryId: string;
  index: number;
  onExit: boolean;
  onTop: boolean;
  forAll: boolean;
  fileUrl: {
    filename: string;
    size: string;
    url: string;
    id: string;
  };
  customizable: boolean;
}

export interface QueryProps {
  queries: string;
  order: number;
  id: string;
  access: string;
  surveyId: string;
  index: number;
  options: OptionProps[];
  type: string;
  onTop: boolean;
  customOption: CustomOptionProps[];
  withCustomOption: boolean;
}

export interface CustomOptionProps {
  id: string; // Unique identifier
  value: string; // Value field
  Queries?: QueryProps; // Optional relationship to Queries
  queriesId?: string; // Foreign key to Queries
}

export interface DraftedSurveyInfo {
  id: string;
  tagID: string;
  type: string;
  status: string;
  admin: AdminUser;
  drafted: boolean;
  queries: QueryProps[];
  timestamp: string;
}
export interface MediaUrl {
  url: string;
}

export interface GenderProps {
  id: string;
  name: string;
}

export interface GenderSizeProps {
  id: string;
  genderId: string;
  gender: GenderProps;
  size: number;
  quotaId: string;
}

export interface AgeBracket {
  id: string;
  segment: string;
  quota: QuotaProps[];
}
export interface RespondentResponses {
  id: string;
  age: AgeBracket;
  gender: GenderProps;
}

export interface SurveyResponseProps {
  id: string;
  barangaysId: string;
  municipalsId: number;
  barangay: BarangayProps;
  respondentResponses: RespondentResponses[];
  timestamp: string;
  users: UserProps;
}

export interface SurveyResultProps {
  name: string;
  population: number;
  maleSize: number;
  femaleSize: number;
  RespondentResponse: number;
}

export interface QuotaProps {
  id: string;
  survey: string;
  surveyId: string;
  barangay: string;
  barangaysId: string;
  ageBracketId: string;
  genderId: string;
  gender: GenderProps;
  gendersSize: GenderSizeProps[];
  age: AgeBracket;
}

export interface ResponseOptionProps {
  id: string;
  queryId: string;
  title: string;
  desc: string;
}
export interface RespondentResponseProps {
  id: string;
  order: number;
  queries: string;
  surveyId: string;
  queryId: string;
  respondentResponseId: string;
  option: ResponseOptionProps[];
}

export interface RespondentResponseByIdProps {
  id: string;
  age: AgeBracket;
  genderId: string;
  gender: GenderProps;
  barnagay: BarangayProps;
  response: {
    queryId: string;
    id: string;
    queries: {
      id: string;
      queries: string;
    };
    option: {
      queryId: string;
      desc: string;
      id: string;
      title: string;
    }[];
  }[];
}

export interface SurveyOptionProps {
  id: string;
  title: string;
  desc: string;
  onTop: boolean;
  overAllResponse: number;
  forAll: boolean;
  order: number;
}

export interface SurveyAgeCountProps {
  id: string;
  segment: string;
  surveyAgeCount: number;
}
export interface SurveyInfoProps {
  id: string;
  tagID: string;
  timestamp: string;
  status: string;
  responseCount: number;
  name?: string;
  ageCount: SurveyAgeCountProps[];
  queries: {
    id: string;
    queries: string;
    onTop: boolean;
    options: SurveyOptionProps[];
  }[];
}

export interface RejectListProps {
  status: number;
  id: string;
  firstname: string;
  lastname: string;
  municipal: number;
  barangay: string;
  reason: string;
  teamId: string | null;
  code: number;
}

export interface DraftedBatchProps {
  id: string;
  municipal: MunicipalProps;
  barangay: BarangayProps;
  timestamp: string;
  municipalId: number;
  barangayId: string;
  drafted: boolean;
}

export interface TeamProps {
  id: string;
  voters: VotersProps[];
  purok: PurokProps;
  purokId: string;
  barangay: BarangayProps;
  barangaysId: string;
  municipal: MunicipalProps;
  municipalsId: number;
  hubId?: string | null;
  level: number;
  teamLeaderId: string;
  candidate?: CandidatesProps | null;
  candidatesId?: string | null;
  teamLeader: TeamLeaderProps | null;
  barangayCoor: TeamLeaderProps | null;
  purokCoors: TeamLeaderProps | null;
  _count: {
    voters: number;
  };
  votersCount: number;
  AccountHandleTeam: AccountHandleTeam
  AccountValidateTeam: AccountValidateTeam
  ValdilatedMember: ValdilatedMember | null
  untrackedCount: number
}

export interface TeamLeaderProps {
  id: string;
  voter?: VotersProps | null;
  hubId: string;
  municipal: MunicipalProps;
  barangay: BarangayProps;
  purokCoorId?: string;
  purok: PurokProps | null;
  voterId?: string;
  municipalsId: number;
  barangaysId: string;
  team: TeamProps[];
  teamId?: string;
  votersId?: string;
  purokId: string;
  handle?: number;
  level: number;
  candidate?: CandidatesProps;
  candidatesId?: string;
  barangayCoor: {
    id: string;
    voter?: VotersProps | null;
  };
  purokCoors: {
    id: string;
    voter?: VotersProps | null;
  };
  teamList: TeamProps[]
}

// export interface TeamMember {
//   barangayCoorID: string,
//   purokCoorID: string,
//   teamLeaderID: string,
//   [key: string[]]: string[]
// }

export interface ValidatedTeams {
  id: string;
  teamLeader?: TeamLeaderProps | null;
  teamLeaderId?: string | null;
  barangay: BarangayProps;
  barangaysId: string;
  municipal: MunicipalProps;
  municipalsId: number;
  purokId: string;
  validatedTeamMembers: ValidatedTeamMembers[];
  timestamp: string;
  purok: PurokProps;
  issues: number;
}

export interface ValidatedTeamMembers {
  idNumber: string;
  voter: VotersProps | null;
  votersId?: string | null;
  purok: PurokProps;
  barangay: BarangayProps;
  municipal: MunicipalProps;
  barangayId: string;
  municipalsId?: number | null;
  purokId: string;
  teamLeaderId: string | null;
  validatedTeamsId: string | null;
  remark: string | null;
}

export interface SurveyResponse {
  id: string;
  timestamp: string;
  responsePath: string;
  survey_id: string;
  barangay_id: string;
  municipal_id: string;
  account_id: string;
}

export interface RespondentResponse {
  id: string;
  gender_id: string;
  ageBracket_id: string;
  survey_id: string;
  surveyResponse_id: string;
  barangay_id: string;
  municipal_id: number;
  account_id: string;
  valid: number;
}

export interface QueryResponseProps {
  id: string;
  option_id: string;
  queries_id: string;
  gender_id: string;
  ageBracket_id: string;
  survey_id: string;
  barangay_id: string;
  municipal_id: number;
  respondentResponse_id: string;
  surveyResponse_id: string;
}

export interface CustomOption {
  id: string;
  value: string;
  queriesId: string;
  queryResponse_id: string;
  survey_id: string;
  respondentResponse_id: string;
}
