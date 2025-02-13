import { useState } from "react";
//layout
import { Button } from "../components/ui/button";
import ValidationBarangay from "../layout/ValidationBarangay";
import MunicipalSel from "../components/custom/MunicipalSel";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "../components/ui/table";
import Modal from "../components/custom/Modal";
import {
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsList,
} from "../components/ui/tabs";
//hooks
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
//query
import { GET_USER_LIST } from "../GraphQL/Queries";
import { UserProps } from "../interface/data";

//icons
import { CiImport } from "react-icons/ci";
import { toast } from "sonner";
import { SUBMIT_VALIDATION } from "../GraphQL/Mutation";
import { Input } from "../components/ui/input";
import { IoPrintOutline } from "react-icons/io5";
const Validation = () => {
  const navigate = useNavigate();
  const user = useUserData();
  const [onOpen, setOnOpen] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data, loading, error } = useQuery<{ userList: UserProps[] }>(
    GET_USER_LIST
  );
  const [params, setParams] = useSearchParams({
    zipCode: user.forMunicipal ? user.forMunicipal?.toString() : "4905",
    tab: "validator",
  });

  const currentZipCode = params.get("zipCode") || "4905";
  const currentTab = params.get("tab") || "validator";

  const handleChangeArea = (type: string, value?: string | undefined) => {
    if (!value) return;
    setParams(
      (prev) => {
        prev.set(type, value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const [submitResponse, { loading: submitting }] = useMutation(
    SUBMIT_VALIDATION,
    {
      onCompleted: () => {
        setOnOpen(0);
      },
      onError: (err) => {
        console.log("Jude error na tangina", err);
      },
    }
  );

  const handleImportJsonFile = async () => {
    if (!selectedFile) {
      toast("Please select a JSON file to IMPORT");
      return;
    }

    // Use an object to group data by bNumber (barangay_id)
    const groupedData: {
      [bNumber: string]: {
        tl: number;
        members: number;
        bc: number;
        pc: number;
      };
    } = {};

    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const fileContent = event.target?.result;
        if (typeof fileContent === "string") {
          const jsonData: any = JSON.parse(fileContent);
          console.log({ jsonData });

          const response = await submitResponse({
            variables: {
              validatedDelisted: jsonData.delistedVoterValidated.map(
                (item: any) => {
                  return {
                    id: item.id,
                    votersId: item.votersId,
                  };
                }
              ),
              votersToUpdate: jsonData.votersToUpdate.map((item: any) => {
                return {
                  id: item.id,
                  votersId: item.votersId,
                  value: item.value,
                  props: item.props,
                  type: item.type,
                  action: item.action,
                };
              }),
              votersToTransfer: jsonData.toBeTransfer.map((item: any) => {
                return {
                  id: item.id,
                  votersId: item.votersId,
                  teamId: item.teamId,
                  fromteamId: item.fromteamId,
                  toTeamId: item.toTeamId,
                  level: item.level,
                };
              }),
              untrackedList: jsonData.untrackedList.map((item: any) => {
                return {
                  id: item.id,
                  votersId: item.votersId,
                  team_Id: item.team_id,
                  municipalsId: item.municipalsId,
                  barangaysId: item.barangaysId,
                  purokId: item.purokId,
                  timestamp: item.timestamp,
                  account_id: item.account_id,
                };
              }),
              validateDuplicate: jsonData.duplicateteamMembersToRemove.map(
                (item: any) => {
                  return {
                    id: item.id,
                    duplicateteamMemberId: item.duplicateteamMemberId,
                    votersId: item.votersId,
                    account_id: item.account_id,
                  };
                }
              ),
              recordToDelete: jsonData.recordToDelete.map((item: any) => {
                return {
                  id: item.id,
                  recordId: item.recordId,
                  voter_id: item.voter_id,
                  team_id: item.team_id,
                };
              }),
              appoinments: jsonData.appointments.map((item: any) => {
                return {
                  id: item.id,
                  teamId: item.teamId,
                  votersId: item.votersId,
                  account_id: item.usersUid,
                  timestamp: item.timestamp,
                };
              }),
              newVoterRecord: jsonData.newVoterRecords.map((record: any) => {
                return {
                  id: record.id,
                  voter_id: record.voter_id,
                  desc: record.desc,
                  questionable: record.questionable,
                  account_id: record.account_id,
                  type: record.type,
                };
              }),
              toSplit: jsonData.toSplit.map((item: any) => {
                return {
                  id: item.id,
                  votersId: item.votersId,
                  teamId: item.teamId,
                  level: item.level,
                  pos: item.pos,
                };
              }),
              teamToMerge: jsonData.teamToMerge.map((item: any) => {
                return {
                  id: item.id,
                  teamIdToJoin: item.teamIdToJoin,
                  teamIdToMerge: item.teamIdToMerge,
                  accountId: item.accountId,
                  municipalsId: item.municipalsId,
                  barangaysId: item.barangaysId,
                };
              }),
              accountTeamHoldings: jsonData.accountTeamHoldings.map(
                (item: any) => {
                  return {
                    id: item.id,
                    accountId: item.accountId,
                    teamId: item.teamId,
                    municipalsId: item.municipalsId,
                    barangaysId: item.barangaysId,
                  };
                }
              ),
              validatedTeams: jsonData.validatedTeams.map((item: any) => {
                return {
                  id: item.id,
                  teamId: item.team_id,
                  municipalsId: item.municipalsId,
                  barangaysId: item.barangaysId,
                  accountId: item.account_id,
                  timestamp: item.timestamp,
                  teamImage: item.teamImage,
                };
              }),
              validatedPerson: jsonData.validatedPerson.map((item: any) => {
                return {
                  id: item.id,
                  votersId: item.votersId,
                  timestamp: item.timestamp,
                  personImage: item.personImage,
                };
              }),
              teamExcluded: jsonData.teamExcluded.map((item: any) => {
                return {
                  id: item.id,
                  teamId: item.teamId,
                  votersId: item.votersId,
                  municipalsId: item.municipalId,
                  barangaysId: item.barangaysId,
                  purokId: item.purok,
                  accountId: item.accountId,
                  timestamp: item.timestamp,
                };
              }),
            },
          });
          console.log(response.data);

          // setListCount(jsonData.length)
          // jsonData.forEach(async (item) => {
          //   console.log({ item });

          //   await composeTeam({
          //     variables: {
          //       team: {
          //         zipCode: parseInt(item.municipal_id, 10),
          //         barangayId: item.barangay_id,
          //         teamLeaderId: item.teamLeaderID,
          //         members: item.members.map((member) => member.idNumber),
          //         purokCoorId: item.purokCoorID,
          //         barangayCoorId: item.barangayCoorID,
          //       },
          //     },
          //   });
          // });

          // Log the grouped data to the console
          console.log("Grouped Data:", groupedData);

          // Optional: Uncomment if you want to transform the object into an array
          /*
          const groupedArray = Object.keys(groupedData).map((bNumber) => ({
            bNumber,
            data: groupedData[bNumber],
          }));
          console.log(groupedArray);
          */
        }
      };

      // Handle file reading error
      fileReader.onerror = () => {
        toast("Error reading file.");
      };

      // Read the file as text
      fileReader.readAsText(selectedFile);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-full relative">
      <Tabs
        defaultValue="validator"
        onValueChange={(e) => handleChangeArea("tab", e)}
        value={currentTab}
      >
        <div className="w-full flex justify-between p-2 border border-gray-400 border-l-0 border-r-0 sticky bg-white top-0 z-30">
          <TabsList>
            <TabsTrigger value={"validator"}>Validator</TabsTrigger>
            <TabsTrigger value={"barangay"}>Barangay</TabsTrigger>
            <TabsTrigger value={"report"}>Report</TabsTrigger>
          </TabsList>
          <div className="w-auto flex items-center gap-2">
            <MunicipalSel
              disabled={user.forMunicipal ? true : false}
              className="max-w-96"
              defaultValue={currentZipCode}
              value={currentZipCode}
              handleChangeArea={handleChangeArea}
            />
            <Button variant="outline" size="sm" onClick={() => setOnOpen(2)}>
              <IoPrintOutline size={20} />
            </Button>
            <Button size="sm" onClick={() => setOnOpen(2)}>
              <CiImport size={20} />
            </Button>
          </div>
        </div>
        <TabsContent value={"barangay"} className="w-full h-auto">
          <ValidationBarangay zipCode={currentZipCode} />
        </TabsContent>
        <TabsContent value={"report"}>
          <div>Validator content</div>
        </TabsContent>
        <TabsContent value={"validator"} className="w-full h-full">
          <div>
            <Table>
              <TableHeader>
                <TableHead>No.</TableHead>
                <TableHead>Username</TableHead>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>Loading...</TableRow>
                ) : error ? (
                  <TableRow>Error :</TableRow>
                ) : (
                  data?.userList.map((user, index) => (
                    <TableRow
                      key={index}
                      className=" cursor-pointer hover:bg-slate-200"
                      onClick={() =>
                        navigate(`/manage/validation/${user.uid}/team`)
                      }
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Modal open={onOpen === 1} onOpenChange={() => setOnOpen(0)}>
        <div>sda</div>
      </Modal>

      <Modal
        title="Import JSON file"
        open={onOpen === 2}
        onOpenChange={() => {
          if (submitting) return;
          setOnOpen(0);
        }}
        children={
          <div className="w-full h-auto">
            {submitting ? (
              <div>
                <h1 className="text-lg font-medium">Uploadeding</h1>
              </div>
            ) : (
              <div className="">
                <Input type="file" accept=".json" onChange={handleFileChange} />
              </div>
            )}

            <div className="w-full flex justify-end gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (submitting) return;
                  setOnOpen(0);
                }}
              >
                Close
              </Button>
              <Button
                disabled={submitting}
                size="sm"
                onClick={handleImportJsonFile}
              >
                {submitting ? "Please wait..." : "Confirm"}
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Validation;
