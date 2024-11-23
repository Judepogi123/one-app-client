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
  lastname: string;
  firstname: string;
  address: string;
  phoneNumber: string;
  password: string;
  uid: string;
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
  gender?: string; // Optional, default is "Unknown"
  barangay: BarangayProps; // Relation to Barangays
  municipal: MunicipalProps; // Relation to Municipals
  status: number; // Default is 1
  calcAge: number;
  birthYear: string;
  level: number; // Default is 0
  barangaysId: string;
  municipalsId: number;
  precintsId?: string | null; // Optional
  saveStatus: string; // Default is "drafted"
  mobileNumber?: string | null; // Optional, default is "Unknown"
  houseHoldId?: string | null; // Optional
  newBatchDraftId?: string | null; // Optional
  purok?: PurokProps | null;
  pwd?: string | null; // Optional
  oor?: string | null; // Optional
  inc?: string | null; // Optional
  illi?: string | null; // Optional
  inPurok?: boolean | null; // Optional
  senior?: boolean | null; // Optional
  youth?: boolean | null; // Optional
  hubId?: string | null; // Optional
  qrCode?: string | null; // Optional, default is "None"
  candidatesId?: string | null; // Optional
  qrCodes: QRCodeProps[];
  qrCodeNumber: number
  teamId?: string;
  leader?: TeamLeaderProps
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
  Birthday?: string| number | null;  DL: string;
  PWD: string;
  IL: string;
  INC: string;
  OR: string;
  calcAge: number;
  purok: PurokProps;
  birthYear: string;
  "18-30": string;
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
}
