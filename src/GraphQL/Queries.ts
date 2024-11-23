import { gql } from "@apollo/client";

export const GET_VOTERS = gql`
  #graphql
  query {
    voters {
      uid
      firstname
      lastname
      purok
      municipalsId
      status
      level
    }
  }
`;
export const GET_MUNICIPAL_VOTERS = gql`
  #graphql
  query MuniQuery($id: Int!) {
    municipalVoterList(id: $id) {
      firstname
      lastname
      uid
      municipalsId
      barangaysId
      precentsId
      status
      level
      barangay {
        name
      }
    }
  }
`;

export const GET_MUNICIPAL = gql`
  #graphql
  query municipal($id: Int!) {
    municipals(id: $id) {
      id
      name
      barangaysCount
    }
  }
`;

export const GET_MUNICIPALS = gql`
  #graphql
  query {
    municipals {
      id
      name
      barangaysCount
    }
  }
`;

export const GET_BARANGAY = gql`
  query BarangayQuery($id: ID!) {
    barangay(id: $id) {
      name
      municipalId
      id
    }
  }
`;

export const GET_BARANGAYS = gql`
  #graphql
  query BarangayQuery($zipCode: Int!) {
    barangayList(zipCode: $zipCode) {
      municipalId
      name
      id
      population
      population
      sampleSize
      sampleRate
      femaleSize
      maleSize
      surveyor
      activeSurveyor
    }
  }
`;

export const GET_PUROKLIST = gql`
  #graphql
  query BarangayQuery($id: String!) {
    getPurokList(id: $id) {
      purokNumber
      id
    }
  }
`;

export const GET_PUROKS = gql`
  #graphql
  query BarangayQuery($barangay: NewPurokInput!) {
    puroks(barangay: $barangay) {
      purokNumber
      id
    }
  }
`;

export const GET_PRECINTS = gql`
  #graphql
  query {
    barangays {
      id
      name
    }
  }
`;

export const GET_NEWVOTERBATCH = gql`
  #graphql
  query BarangayQuery($barangay: NewBatchDraftInput!) {
    barangayNewVotersDraft(barangay: $barangay) {
      timestamp
      id
    }
  }
`;

export const GET_DRAFTEDVOTER = gql`
  #graphql
  query BarangayQuery($barangay: NewBatchDraftInput!) {
    barangayNewVotersDraft(barangay: $barangay) {
      timestamp
      id
    }
  }
`;

export const GET_DRAFT = gql`
  #graphql
  query DraftQuery {
    drafts {
      id
      drafted
      barangay {
        name
        id
      }
      timestamp
      municipal {
        id
        name
      }
    }
  }
`;

export const SELECTED_DRAFT = gql`
  query SelectedDraft($id: String!) {
    draft(id: $id) {
      id
      barangay {
        name
        id
      }
      municipal {
        name
        id
      }
      barangayId
      municipalId
    }
  }
`;

export const GET_SLUGVOTERS = gql`
  #graphql
  query DraftedVoter($voter: DraftedVoters!) {
    draftedVoters(voter: $voter) {
      id
      lastname
      firstname
      calcAge
      municipalsId
      barangaysId
      saveStatus
      purokId
      pwd
      inc
      illi
      oor
      inPurok
      purok {
        purokNumber
        id
      }
      birthYear
      senior
      youth
      gender
    }
  }
`;

export const SEARCH_DRAFTED_VOTERS = gql`
  #graphql
  query VotersQuery($query: SearchDraftQueryInput!) {
    searchDraftVoter(query: $query) {
      id
      lastname
      firstname
      calcAge
      municipalsId
      barangaysId
      saveStatus
      purokId
      pwd
      inc
      illi
      oor
      inPurok
      purok {
        purokNumber
        id
      }
      birthYear
      newBatchDraftId
    }
  }
`;

export const GET_DRAFTPUROK = gql`
  #graphql
  query BarangayQuery {
    puroks {
      id
      barangaysId
      municipalsId
      purokNumber
      purokDraftedVotersCount
    }
  }
`;

export const GET_VOTERS_PROFILE = gql`
  #graphql
  query VoterProfile($id: String!) {
    voter(id: $id) {
      id
      lastname
      firstname
      purok {
        purokNumber
        id
      }
      municipal {
        id
        name
      }
      barangay {
        name
        id
      }
      saveStatus
      birthYear
      calcAge
      level
      houseHoldId
      pwd
      illi
      oor
      inc
      inPurok
      qrCodes {
        qrCode
        timestamp
        id
        number
      }
    }
  }
`;

export const GET_DRAFTSURVEY = gql`
  #graphql
  query Survey {
    surveyList {
      id
      tagID
      timestamp
      drafted
      adminUserUid
      status
      admin {
        firstname
      }
    }
  }
`;

export const GET_SELECTED_DRAFT_SURVEY = gql`
  #graphql
  query Survey($id: String!) {
    survey(id: $id) {
      id
      tagID
      tagID
      type
      status
      timestamp
      drafted
      admin {
        firstname
      }
      queries {
        queries
        id
        type
        order
        options {
          id
          order
        }
      }
    }
  }
`;

export const GET_QUERIES = gql`
  #graphql
  query Queries($id: String!) {
    queries(id: $id) {
      id
      queries
      type
      access
      options {
        id
        title
        mediaUrlId
        desc
        onExit
        forAll
        fileUrl {
          url
          filename
          size
          id
        }
      }
    }
  }
`;

export const OPTION_INFO = gql`
  #graphql
  query OptionQuery($id: String!) {
    option(id: $id) {
      id
      queryId
      title
      mediaUrlId
    }
  }
`;

export const GET_SURVEYOR = gql`
  #graphql
  query GetSurveyor {
    users {
      firstname
      lastname
      uid
      address
      phoneNumber
      uid
    }
  }
`;

export const GET_AGE = gql`
  #graphql
  query Ages {
    ageList {
      id
      segment
    }
  }
`;

export const GET_GENDER = gql`
  #graphql
  query Genders {
    genderList {
      id
      name
    }
  }
`;

export const SURVEY_RESPONSE_LIST = gql`
  #graphql

  query ExampleQuery($survey: AllSurveyResponseInput!) {
    allSurveyResponse(survey: $survey) {
      timestamp
      id
      barangaysId
      municipalsId
      barangay {
        name
        sampleSize
        population
      }
      respondentResponses {
        id
      }
    }
  }
`;

export const SURVEY_RESPONSE_INFO = gql`
  query ExampleQuery($id: String!) {
    surveyResponseInfo(id: $id) {
      id
      surveyId
      barangay {
        name
        id
        sampleSize
        population
      }
      respondentResponses {
        id
        ageBracketId
        age {
          segment
          id
        }
        gender {
          name
          id
        }
      }
    }
  }
`;

export const SURVEY_RESPONSE = gql`
  #graphql
  query Respondent($zipCode: Int!, $id: String!) {
    barangayList(zipCode: $zipCode) {
      name
      id
      maleSize
      femaleSize
      RespondentResponse(id: $id, zipCode: $zipCode)
    }
  }
`;

export const SURVEY_BARANGAY_QUOTA = gql`
  #graphql
  query SampleSize($quota: QuotaInput!) {
    barangays {
      name
      sampleRate
      population
      quotas(quota: $quota) {
        population
        sampleSize
        id
        femaleSize
        maleSize
        surveyor
      }
    }
  }
`;

export const BARANGAY_QUOTA = gql`
  #graphql
  query SampleSize($id: ID!) {
    barangay(id: $id) {
      id
      name
      surveyor
      quota {
        id
        ageBracketId
        barangaysId
        age {
          segment
        }
        gendersSize {
          id
          size
          gender {
            name
            id
          }
        }
      }
    }
    ageList {
      id
      segment
      order
    }
    genderList {
      id
      name
    }
  }
`;
export const RESPONSE_INFO = gql`
  #graphql
  query Reponse($id: String!) {
    getRespondentResponseById(id: $id) {
      id
      genderId
      barangay {
        name
        id
      }
      age {
        id
        segment
      }
      gender {
        name
        id
      }
      responses {
        queryId
        id
        queries {
          queries
          id
        }
        option {
          queryId
          desc
          id
          title
        }
      }
    }
  }
`;

export const SURVEY_RESULT_INFO = gql`
  #graphql
  query Response(
    $id: String!
    $zipCode: Int!
    $barangayId: String!
    $genderId: String!
  ) {
    barangayList(zipCode: $zipCode) {
      id
      name
      municipalId
    }
    municipals {
      id
      name
    }
    ageList {
      id
      segment
      order
    }
    genderList {
      id
      name
    }
    surveyQueriesList(id: $id) {
      id
      queries
      onTop
      access
      options {
        id
        title
      }
    }
    survey(id: $id) {
      id
      tagID
      timestamp
      status
      responseCount(zipCode: $zipCode)
      ageCount {
        id
        segment
        surveyAgeCount(
          id: $id
          zipCode: $zipCode
          barangayId: $barangayId
          genderId: $genderId
        )
      }
      queries {
        id
        queries
        onTop
        access
        type
        options {
          id
          title
          desc
          onTop
          forAll
          overAllResponse(
            id: $id
            zipCode: $zipCode
            barangayId: $barangayId
            genderId: $genderId
          )
        }
      }
    }
  }
`;

export const GET_OPTION_AGE_COUNT = gql`
  #graphql
  query Response($optionId: String!, $ageBracketId: String!) {
    optionCountAge(optionId: $optionId, ageBracketId: $ageBracketId)
  }
`;

export const OPTION_AGE_RANK = gql`
  #graphql
  query Survey(
    $id: String!
    $ageBracketId: String
    $queryId: String!
    $barangayId: String!
    $genderId: String!
  ) {
    queries(id: $queryId) {
      id
      queries
      options {
        id
        title
        fileUrl {
          id
          url
        }
        ageCountRank(
          id: $id
          ageBracketId: $ageBracketId
          barangayId: $barangayId
          genderId: $genderId
        )
      }
    }
  }
`;
export const SURVEY_OPTION_RANK = gql`
  #graphql
  query Option(
    $queryId: String!
    $surveyId: String!
    $zipCode: Int!
    $barangayId: String!
    $genderId: String!
    $optionId: String!
    $ageBracketId: String!
  ) {
    optionRank(
      queryId: $queryId
      surveyId: $surveyId
      zipCode: $zipCode
      barangayId: $barangayId
      genderId: $genderId
      optionId: $optionId
      ageBracketId: $ageBracketId
    )
    optionGenderRank(
      queryId: $queryId
      surveyId: $surveyId
      zipCode: $zipCode
      barangayId: $barangayId
      genderId: $genderId
      optionId: $optionId
      ageBracketId: $ageBracketId
    )
  }
`;

export const GET_SELECTED_OPTION = gql`
  #graphql
  query ($optionId: String!, $zipCode: Int!, $surveyId: String!) {
    option(id: $optionId) {
      id
      overAllResponse(zipCode: $zipCode, barangayId: "all", genderId: "all")
      title
      barangays {
        id
        name
        femaleSize
        maleSize
        optionResponse(id: $optionId, surveyId: $surveyId)
      }
    }
  }
`;

export const GET_SELECTED_QUERY = gql`
  #graphql
  query GetBarangayOptionResponse(
    $zipCode: Int!
    $queryId: String!
    $surveyId: String!
  ) {
    barangayOptionResponse(
      zipCode: $zipCode
      queryId: $queryId
      surveyId: $surveyId
    ) {
      id
      name
      options(queryId: $queryId) {
        id
        queryId
        title
        desc
        overAllCount
      }
    }
  }
`;

export const ALL_SURVEY_LIST = gql`
  #graphql
  query Survey {
    surveyList {
      id
      tagID
      timestamp
      name
    }
  }
`;

export const GET_ALL_VOTERS = gql`
  #graphql
  query Voters(
    $offset: Int!
    $limit: Int!
    $barangayId: String!
    $zipCode: String!
  ) {
    getAllVoters(
      offset: $offset
      limit: $limit
      barangayId: $barangayId
      zipCode: $zipCode
    ) {
      id
      firstname
      lastname
      gender
      level
      barangay {
        name
        id
      }
      municipal {
        id
        name
      }
      purok {
        id
        purokNumber
      }
    }
    municipals {
      id
      name
    }
  }
`;

export const SEARCH_VOTER = gql`
  #graphql
  query ($query: String!, $skip: Int!, $take: Int!) {
    searchVoter(query: $query, skip: $skip, take: $take) {
      id
      firstname
      lastname
      gender
      barangay {
        name
        id
      }
      municipal {
        id
        name
      }
      purok {
        id
        purokNumber
      }
      level
      status
      pwd
      inc
      illi
      oor
    }
  }
`;

export const GET_SELECT_VOTER = gql`
  #graphql
  query Voters($list: [String!]) {
    getSelectedVoters(list: $list) {
      id
      firstname
      lastname
      gender
      barangay {
        name
        id
      }
      municipal {
        id
        name
      }
      purok {
        id
        purokNumber
      }
      level
      illi
      pwd
      inc
      oor
      senior
      status
    }
  }
`;

export const GET_VOTER_LIST = gql`
  #graphql
  query (
    $level: String!
    $take: Int
    $skip: Int
    $zipCode: String
    $barangayId: String
    $purokId: String
    $query: String
    $pwd: String
    $illi: String
    $inc: String
    $oor: String
    $dead: String
    $youth: String
    $senior: String
    $gender: String
  ) {
    getVotersList(
      level: $level
      take: $take
      skip: $skip
      zipCode: $zipCode
      barangayId: $barangayId
      purokId: $purokId
      query: $query
      pwd: $pwd
      illi: $illi
      inc: $inc
      oor: $oor
      dead: $dead
      youth: $youth
      senior: $senior
      gender: $gender
    ) {
      voters {
        id
        firstname
        lastname
        gender
        barangay {
          name
          id
        }
        municipal {
          id
          name
        }
        purok {
          id
          purokNumber
        }
        level
        status
        pwd
        inc
        oor
        senior
      }
      results
    }
  }
`;

export const GET_TEAM_LIST = gql`
  #graphql
  query Voter(
    $zipCode: String!
    $barangayId: String!
    $purokId: String!
    $level: String!
    $query: String!
    $skip: Int!
  ) {
    teamList(
      zipCode: $zipCode
      barangayId: $barangayId
      purokId: $purokId
      level: $level
      query: $query
      skip: $skip
    ) {
      id
      level
      purok {
        purokNumber
        id
      }
      barangay {
        name
        id
      }
      municipal {
        name
      }
      teamLeader {
        id
        voter {
          id
          firstname
          lastname
        }
      }
      candidate {
        id
        code
      }
      voters {
        id
        firstname
        lastname
      }
    }
  }
`;

export const GET_CANDIDATES = gql`
  #graphql
  query Candidates {
    candidates {
      id
      firstname
      lastname
      code
      colorCode
    }
  }
`;

export const GET_TEAM_INFO = gql`
  #graphql
  query Team($id: String!) {
    team(id: $id) {
      id
      level
      purok {
        purokNumber
        id
      }
      barangay {
        name
        id
      }
      municipal {
        name
      }
      teamLeader {
        id
        votersId
        voter {
          id
          firstname
          lastname
          level
        }
      }
      candidate {
        id
        code
      }
      voters {
        id
        firstname
        lastname
        level
        teamId
        qrCodeNumber
        qrCodes {
          id
          number
          qrCode
          scannedDateTime
          stamp
        }
        leader {
          id
          teamId
        }
      }
    }
  }
`;

export const GET_ALL_VALIDATION = gql`
  #graphql
  query Barangay($zipCode: Int!) {
    barangayList(zipCode: $zipCode) {
      id
      name
      barangayVotersCount
      validationList {
        id
        timestamp
        totalVoters
        percent
      }
    }
  }
`;

export const BARANGAY_VALIDATION_LIST = gql`
  #graphql
  query Voter($id: ID!) {
    validationList(id: $id) {
      id
      percent
      timestamp
      totalVoters
    }
    barangay(id: $id) {
      id
      name
      barangayVotersCount
    }
  }
`;