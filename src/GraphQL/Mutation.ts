import { gql } from "@apollo/client";

export const CREATE_MUNICIPAL = gql`
  #graphql
  mutation BarangayMutation($municipal: NewMunicipalInput!) {
    createMunicipal(municipal: $municipal) {
      name
      id
    }
  }
`;

export const CREATE_BARANGAY = gql`
  #graphql
  mutation BarangayMutation($barangay: NewBarangayInput!) {
    createBarangay(barangay: $barangay) {
      name
      municipalId
    }
  }
`;
export const UPLOAD_EXCEL_FILE = gql`
  mutation UploadExcelFile($file: Upload!) {
    uploadExcelFile(file: $file)
  }
`;

export const CREAT_NEWVOTERBATCH = gql`
  #graphql
  mutation BarangayMutation($barangay: NewBatchDraftInput!) {
    createNewBatchDraft(barangay: $barangay) {
      id
      timestamp
    }
  }
`;

export const DRAFT_MUTATION = gql`
  mutation Draft($id: String!) {
    removeDraft(id: $id) {
      id
    }
  }
`;

export const CHANGE_PUROK_NAME = gql`
  #graphql
  mutation PurokMutation($purok: ChangePurokNameInput!) {
    changePurokName(purok: $purok) {
      purokNumber
      id
    }
  }
`;

export const MERGE_PUROK = gql`
  #graphql
  mutation PurokMutation($purok: MergePurokInput!) {
    mergePurok(purok: $purok) {
      purokNumber
    }
  }
`;

export const LOGIN_ADMIN = gql`
  #graphql
  mutation AdminLogin($user: AdminLoginInput!) {
    adminLogin(user: $user) {
      lastname
      firstname
      phoneNumber
      accessToken
      uid
    }
  }
`;

export const CREATE_SURVEY = gql`
  #graphql
  mutation Survey($survey: NewSurveyInput!) {
    createSurvey(survey: $survey) {
      timestamp
      tagID
      type
      id
    }
  }
`;

export const CREATE_QUERY = gql`
  #graphql
  mutation QueryManage($query: NewQueryInput!) {
    createQuery(query: $query) {
      queries
      id
      type
    }
  }
`;

export const DELETE_QUERY = gql`
  #graphql
  mutation DeleteOption($id: String!) {
    deleteQuery(id: $id) {
      id
    }
  }
`;

export const CREATE_OPTION = gql`
  #graphql
  mutation OptionMutation($media: NewMediaInput, $option: NewOptionInput!) {
    createOptionWithMedia(media: $media, option: $option) {
      mediaUrlId
      title
      desc
      queryId
      id
      onExit
    }
  }
`;

export const DELETE_OPTION = gql`
  #graphql
  mutation OptionMutation($id: String!) {
    deleteOption(id: $id) {
      id
    }
  }
`;

export const UPDATE_OPTION_IMAGE = gql`
  #graphql
  mutation UpdateImage($image: NewOptionImageInput!) {
    updateOptionImage(image: $image) {
      id
    }
  }
`;

export const DELETE_OPTION_MEDIA = gql`
  #graphql
  mutation DeleteOptionMeda($option: OptionMedia!) {
    deleteOptionMedia(option: $option) {
      id
    }
  }
`;

export const LIVE_SURVEY = gql`
  #graphql
  mutation SurveyLive($id: String!) {
    goLiveSurvey(id: $id) {
      id
    }
  }
`;

export const UPDATE_OPTION = gql`
  #graphql
  mutation DeleteOptionMeda($option: UpdateOption!) {
    updateOption(option: $option) {
      id
    }
  }
`;

export const SAMPLE_SIZE_UPDATE = gql`
  #graphql
  mutation UpdateSample($sample: UpdateSampleInput!) {
    updateSampleSize(sample: $sample) {
      id
    }
  }
`;

export const CREATE_AGE = gql`
  #graphql

  mutation AddAge($age: String!) {
    createAge(age: $age) {
      id
      segment
    }
  }
`;

export const DELETE_AGE = gql`
  #graphql

  mutation RemoveAge($id: String!) {
    deleteAge(id: $id) {
      id
      segment
    }
  }
`;

export const UPDATE_AGE = gql`
  #grapgql

  mutation UpdateAge($age: UpdateAge!) {
    updateAge(age: $age) {
      id
    }
  }
`;

export const CREATE_GENDER = gql`
  #graphql
  mutation AddAge($gender: String!) {
    createGender(gender: $gender) {
      id
      name
    }
  }
`;

export const DELETE_GENDER = gql`
  #graphql

  mutation RemoveGender($id: String!) {
    deleteGender(id: $id) {
      id
      name
    }
  }
`;

export const UPDATE_GENDER = gql`
  #grapgql

  mutation UpdateAge($gender: UpdateGender!) {
    updateGender(gender: $gender) {
      id
    }
  }
`;

export const SURVEY_CONCLUDED = gql`
  #graphql
  mutation SurveyConclude($id: String!) {
    surveyConclude(id: $id) {
      id
    }
  }
`;

export const DELETE_SURVEY = gql`
  #graphql
  mutation DeleteSurvey($id: String!) {
    deleteSurvey(id: $id) {
      id
    }
  }
`;

export const CREATE_QUOTA = gql`
  #graphql
  mutation Quota($quota: NewQuotaInput!, $gender: NewGenderInput!) {
    createQuota(quota: $quota, gender: $gender) {
      id
    }
  }
`;

export const CREATE_GENDER_QUOTA = gql`
  #graphql
  mutation Quota($quota: GenderQuotaInput!) {
    createGenderQuota(quota: $quota) {
      id
    }
  }
`;

export const REMOVE_GENDER_QUOTRA = gql`
  #graphql
  mutation Quota($id: String!) {
    removeGenderQuota(id: $id) {
      id
    }
  }
`;

export const RESET_SURVEYOR = gql`
  #graphql
  mutation Quota($id: Int!) {
    resetSurveyor(id: $id) {
      id
    }
  }
`;

export const RESET_BARANGAY_QUOTA = gql`
  #graphql
  mutation Quota($id: String!) {
    resetBarangayQuota(id: $id) {
      id
    }
  }
`;

export const RESET_BARANGAY_ACTIVE_SURVEYOR = gql`
  #graphql
  mutation ActiveSurveyor($id: String!) {
    resetActiveSurvey(id: $id) {
      id
    }
  }
`;
export const REMOVE_QUOTA = gql`
  #graphql
  mutation RemoveQuota($id: String!) {
    removeQuota(id: $id) {
      id
    }
  }
`;

export const REMOVE_QUERY = gql`
  #graphql
  mutation Queries($id: String!) {
    removeQuery(id: $id) {
      id
    }
  }
`;

export const UPDATE_QUERY = gql`
  #graphql
  mutation Queries($id: String!, $value: String!) {
    updateQuery(id: $id, value: $value) {
      id
    }
  }
`;

export const UPDATE_QUERY_TYPE = gql`
  #graphql
  mutation Queries($id: String!, $type: String!) {
    updateQueryType(id: $id, type: $type) {
      id
    }
  }
`;

export const RESET_SURVEY_RESPONSE = gql`
  #graphql
  mutation Quota($id: String!, $zipCode: Int!) {
    resetSurveyResponse(id: $id, zipCode: $zipCode) {
      count
    }
  }
`;
export const UPDATE_OPTION_TOP = gql`
  #graphql
  mutation Quota($id: String!, $value: Boolean!) {
    updateOptionTop(id: $id, value: $value) {
      id
    }
  }
`;

export const REMOVE_RESPONSE = gql`
  #graphql
  mutation Response($id: String!) {
    removeResponse(id: $id) {
      id
    }
  }
`;

export const UPDATE_QUERY_ACCESS = gql`
  #graphql

  mutation Query($id: String!) {
    updateQueryAccess(id: $id) {
      id
    }
  }
`;

export const UPDATE_OPTION_FORALL = gql`
  #graphql
  mutation Option($id: String!, $value: Boolean!) {
    optionForAll(id: $id, value: $value) {
      id
    }
  }
`;

export const DISCARD_DRAFTED_VOTERE = gql`
  #graphql
  mutation Voters($id: String!) {
    discardDraftedVoter(id: $id)
  }
`;

export const SAVE_DRAFTED_VOTER = gql`
  #graphql
  mutation Voter($batchId: String!) {
    saveDraftedVoter(batchId: $batchId) {
      id
    }
  }
`;

export const REMOVE_VOTER = gql`
  #graphql
  mutation Voter($id: String!) {
    removeVoter(id: $id)
  }
`;

export const REMOVE_MULTI_VOTER = gql`
  #graphql
  mutation Voter($list: [String!]) {
    removeMultiVoter(list: $list)
  }
`;

export const SET_VOTER_LEVEL = gql`
  #graphql
  mutation setVoterLevel($level: Int!, $id: String!, $code: String!) {
    setVoterLevel(level: $level, id: $id, code: $code)
  }
`;

export const ADD_TEAM = gql`
  #graphql
  mutation Team($headId: String!, $level: Int!, $teamIdList: [VoterInput!]) {
    addTeam(headId: $headId, level: $level, teamIdList: $teamIdList)
  }
`;

export const ADD_MEMBERS = gql`
  #graphql
  mutation Team(
    $headId: String!
    $level: Int!
    $teamIdList: [VoterInput!]
    $teamId: String!
  ) {
    addMember(
      headId: $headId
      level: $level
      teamIdList: $teamIdList
      teamId: $teamId
    )
  }
`;

export const REMOVE_AREA_VOTERS = gql`
  #grahpql
  mutation Voters($zipCode: String!, $barangayId: String!, $purokId: String!) {
    removeVotersArea(
      zipCode: $zipCode
      barangayId: $barangayId
      purokId: $purokId
    )
  }
`;

export const GENERATE_BUNLE_QRCODE = gql`
  #graphql
  mutation QRcode($idList: [String!]) {
    genderBundleQrCode(idList: $idList)
  }
`;

export const ADD_NEW_CANDIDATE = gql`
  #graphql
  mutation Candidate(
    $firstname: String!
    $lastname: String!
    $code: String!
    $colorCode: String
  ) {
    addNewCandidate(
      firstname: $firstname
      lastname: $lastname
      code: $code
      colorCode: $colorCode
    )
  }
`;

export const CREATE_POSITION = gql`
  #graphql
  mutation Positon($title: String!) {
    createPostion(title: $title)
  }
`;

export const UPDATE_LEADER = gql`
  #graphql
  mutation Leadr($id: String!, $teamId: String!, $method: Int!, $level: Int!) {
    updateLeader(id: $id, teamId: $teamId, method: $method, level: $level)
  }
`;

export const CHANGE_LEADER = gql`
  #graphql
  mutation Team($id: String!, $teamId: String!, $level: Int!) {
    changeLeader(id: $id, teamId: $teamId, level: $level)
  }
`;

export const GENERATE_TEAM_QRCODE = gql`
  #graphql
  mutation Team($teamId: String!) {
    generatedTeamQRCode(teamId: $teamId)
  }
`;

export const REMOVE_MULTI_QROCODE = gql`
  #graphql
  mutation ($id: [String!]) {
    removeQRcode(id: $id)
  }
`;