import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "react-auth-kit";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import createStore from "react-auth-kit/createStore";
import { DndContext } from "@dnd-kit/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

//customHoook
import UserDataProvider from "./provider/UserDataProvider";
//Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes
import Home from "./routes/Home";
import Data from "./routes/Data";
import Survey from "./routes/Survey";
import Analytics from "./routes/Analytics";
import Area from "./routes/Area";
import AddNewVoter from "./routes/AddNewVoter";
import Barangay from "./routes/Barangay";
import Camera from "./components/custom/Camera";
import NewVoterDraft from "./routes/NewVoterDraft";
import NewBatchVoter from "./routes/NewBatchVoter";
import GenerateList from "./routes/GenerateList";
import Create from "./routes/Create";
import VoterProfile from "./routes/VoterProfile";
import AuthPage from "./routes/AuthPage";
import EditSurvey from "./routes/EditSurvey";
import Option from "./routes/Option";
import Surveyor from "./routes/Surveyor";
import LiveSurvey from "./routes/LiveSurvey";
import SurveyInfo from "./routes/SurveyInfo";
import SurveyResult from "./routes/SurveyResult";
import Compliance from "./routes/Compliance";
import RespondentResponse from "./routes/RespondentResponse";
import ResponseRespondent from "./routes/ResponseRespondent";
import BarangaySize from "./routes/BarangaySize";
import QuotaList from "./routes/QuotaList";
import Results from "./routes/Results";
import Voters from "./routes/Voters";
import UpdateVoters from "./routes/UpdateVoters";
import UpdateOption from "./routes/UpdateOption";
import Teams from "./routes/Teams";
import Candidates from "./routes/Candidates";
import Groups from "./routes/Groups";
import UpdateVoterList from "./routes/UpdateVoterList";
import BarangayValidationList from "./routes/BarangayValidationList";
import GroupQR from "./routes/GroupQR";
import TeamValidatedRecords from "./routes/TeamValidatedRecords";
import ValidatedTeamReport from "./routes/ValidatedTeamReport";
import BarangaySupporters from "./routes/BarangaySupporters";
import TeamInput from "./layout/TeamInput";
import Accounts from "./routes/Accounts";
import AddVoter from "./routes/AddVoter";
import Validation from "./routes/Validation";
import BaranngayTeams from "./routes/BaranngayTeams";
import AccountTeamMembers from "./routes/AccountTeamMembers";
// Styles
import "./index.css";
import UserValidation from "./routes/UserValidation";

// Apollo Client Setup
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      console.log("Error: ", message);
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:3000/graphql" }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const queryClient = new QueryClient();

if (import.meta.env.NODE_ENV === "production") {
  disableReactDevTools();
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <UserDataProvider>
            <DndContext>
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/team-input-page" element={<TeamInput />} />
                  <Route element={<AuthOutlet fallbackPath="/auth" />}>
                    <Route path="result" element={<Results />}>
                      <Route index={true} element={<Results />} />
                      <Route path="voters" element={<Voters />} />
                    </Route>
                    <Route path="/" element={<Home />}>
                      <Route index={true} element={<Data />} />
                      <Route path="survey" element={<Survey />}>
                        <Route path="surveyor" element={<Surveyor />} />
                      </Route>
                      <Route path="/teams" element={<Teams />} />
                      <Route path="/teams/:teamId" element={<Groups />} />
                      <Route
                        path="/teams/:teamId/qrCodes"
                        element={<GroupQR />}
                      />
                      <Route
                        path="requirement/:barangayID"
                        element={<QuotaList />}
                      />
                      <Route
                        path="survey/draft/:surveyID"
                        element={<EditSurvey />}
                      />
                      <Route
                        path="survey/live/:surveyID"
                        element={<LiveSurvey />}
                      >
                        <Route index={true} element={<SurveyInfo />} />
                        <Route path="info" element={<SurveyInfo />} />
                        <Route path="size" element={<BarangaySize />} />
                        <Route path="result" element={<SurveyResult />} />
                        <Route path="compliance" element={<Compliance />} />
                        <Route
                          path="compliance/:surveyResponseID"
                          element={<RespondentResponse />}
                        />
                        <Route
                          path="compliance/:surveyResponseID/:responseID"
                          element={<ResponseRespondent />}
                        />
                      </Route>

                      <Route
                        path="survey/:surveyID/:queryID"
                        element={<Option />}
                      />
                      <Route path="manage" element={<Create />} />
                      <Route path="list" element={<GenerateList />} />
                      <Route path="manage/new" element={<NewBatchVoter />} />
                      <Route path="manage/draft" element={<NewVoterDraft />} />
                      <Route path="manage/update" element={<UpdateVoters />} />
                      <Route
                        path="manage/validation"
                        element={<Validation />}
                      />
                      <Route
                        path="manage/validation/:barangayID"
                        element={<BaranngayTeams />}
                      />
                      <Route
                        path="manage/validation/:userID/team"
                        element={<UserValidation />}
                      />
                      <Route
                        path="manage/validation/:userID/:accountTeamID"
                        element={<AccountTeamMembers />}
                      />
                      <Route path="manage/addvoter" element={<AddVoter />} />
                      <Route
                        path="manage/candidates"
                        element={<Candidates />}
                      />
                      <Route
                        path="manage/candidates/:candidateID"
                        element={<BarangaySupporters />}
                      />
                      <Route path="manage/accounts" element={<Accounts />} />
                      <Route
                        path="manage/update/voter"
                        element={<UpdateOption />}
                      />
                      <Route
                        path="manage/update/voter/records"
                        element={<TeamValidatedRecords />}
                      />
                      <Route
                        path="manage/update/voter/records/:recordID"
                        element={<ValidatedTeamReport />}
                      />
                      <Route
                        path="manage/update/voter-list"
                        element={<UpdateVoterList />}
                      />
                      <Route
                        path="manage/update/voter-list/validation-list"
                        element={<BarangayValidationList />}
                      />
                      <Route
                        path="manage/draft/:draftID"
                        element={<AddNewVoter />}
                      />
                      <Route path="area" element={<Analytics />} />
                      <Route path="area/:municipalID" element={<Area />} />
                      <Route
                        path="area/:municipalID/:barangayID"
                        element={<Barangay />}
                      />
                      <Route
                        path="area/:municipalID/:barangayID/draft/:draftedVoterID"
                        element={<AddNewVoter />}
                      />
                      <Route path="scan" element={<Camera />} />
                      <Route path="voter/:voterID" element={<VoterProfile />} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </DndContext>
          </UserDataProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
