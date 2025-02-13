import { useState } from "react";
//
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
//ui
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../components/ui/form";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "../components/ui/table";
import Modal from "../components/custom/Modal";
//zod
import { TeamInputSchema } from "../zod/data";

//icons
import { RiFileHistoryFill } from "react-icons/ri";
import { RiPassValidLine } from "react-icons/ri";

//grhapql
import { CREATE_TEAM } from "../GraphQL/Mutation";
import { useMutation } from "@apollo/client";

//props
import { ValidatedTeamMembers } from "../interface/data";
import { toast } from "sonner";
type TeamInputProps = z.infer<typeof TeamInputSchema>;

interface JSONProps {
  id: string;
  purok_Id: string;
  barangay_id: string;
  municipal_id: string;
  purokCoorID: string;
  teamLeaderID: string;
  barangayCoorID: string;
  members: { id: string; idNumber: string }[];
}

const TeamInput = () => {
  const [onOpenModal, setOnOpenModal] = useState(0);
  const [counter, setCounter] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [listCount, setListCount] = useState(0);
  const navigate = useNavigate();
  const form = useForm<TeamInputProps>({
    resolver: zodResolver(TeamInputSchema),
    defaultValues: {
      zipCode: "4905",
      dynamicMembers: {},
      teamLeaderID: "",
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    resetField,
  } = form;

  const [composeTeam, { data: results, error: teamError, loading }] =
    useMutation<{
      composeTeam: string;
    }>(CREATE_TEAM, {
      onCompleted: () => {
        resetField("teamLeaderID");
        resetField("dynamicMembers.member1");
        resetField("dynamicMembers.member2");
        resetField("dynamicMembers.member3");
        resetField("dynamicMembers.member4");
        resetField("dynamicMembers.member5");
        resetField("dynamicMembers.member6");
        resetField("dynamicMembers.member7");
        resetField("dynamicMembers.member8");
        resetField("dynamicMembers.member9");
        resetField("dynamicMembers.member10");
        toast("Team created successfully", {
          closeButton: false,
        });
        setCounter((prev) => prev + 1);
      },
    });

  console.log("Counter updated to:", counter);

  const onSubmit = async (value: TeamInputProps) => {
    const { dynamicMembers } = value;

    const response = await composeTeam({
      variables: {
        team: {
          zipCode: parseInt(value.zipCode, 10),
          barangayId: value.barangayID,
          teamLeaderId: value.teamLeaderID,
          members: Object.values(dynamicMembers || []).filter(Boolean),
          purokCoorId: value.purokCoorId,
          barangayCoorId: value.barangayCoorId,
        },
      },
    });

    if (response.errors) {
      toast("Request failed");
      return;
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

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
          const jsonData: JSONProps[] = JSON.parse(fileContent);

          setListCount(jsonData.length);
          jsonData.forEach(async (item) => {
            console.log({ item });

            //const bNumber = item.barangay_id;

            // // Initialize the group if it doesn't exist
            // if (!groupedData[bNumber]) {
            //   groupedData[bNumber] = {
            //     tl: 0,
            //     members: 0,
            //     bc: 0,
            //     pc: 0,
            //   };
            // }

            // if (item.teamLeaderID) {
            //   groupedData[bNumber].tl += 1;
            // }

            // if (item.purokCoorID === jsonData[i + 1]?.purokCoorID) {
            //   groupedData[bNumber].pc += 1;
            // }

            // // Check if the current and next barangay coordinator IDs are the same
            // if (item.barangayCoorID === jsonData[i + 1]?.barangayCoorID) {
            //   groupedData[bNumber].bc += 1;
            // }

            // // Add the number of members to the total
            // groupedData[bNumber].members += item.members.length;

            await composeTeam({
              variables: {
                team: {
                  zipCode: parseInt(item.municipal_id, 10),
                  barangayId: item.barangay_id,
                  teamLeaderId: item.teamLeaderID,
                  members: item.members.map((member) => member.idNumber),
                  purokCoorId: item.purokCoorID,
                  barangayCoorId: item.barangayCoorID,
                },
              },
            });
          });

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
    <div className="w-full h-auto">
      <div className="w-full p-2 flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setOnOpenModal(2)}>
          Import JSON file
        </Button>
        <Button
          onClick={() => navigate(`/manage/update/voter/records`)}
          className="w-auto flex gap-2"
          size="sm"
        >
          <RiFileHistoryFill /> Records
        </Button>
      </div>
      <h1 className="font-medium text-xl p-2">New Team</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2 p-2"
      >
        <Form {...form}>
          <FormField
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipal Zip code</FormLabel>
                <FormControl>
                  <Input
                    defaultValue="4905"
                    {...register("zipCode", {
                      required: "Barangay ID is required",
                    })}
                    {...field}
                    placeholder="Barangay ID"
                  />
                </FormControl>
                {errors.teamLeaderID && (
                  <FormMessage>{errors.teamLeaderID.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="barangayID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay ID</FormLabel>
                <FormControl>
                  <Input
                    {...register("barangayID", {
                      required: "Barangay ID is required",
                    })}
                    {...field}
                    placeholder="Barangay ID"
                  />
                </FormControl>
                {errors.teamLeaderID && (
                  <FormMessage>{errors.teamLeaderID.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="barangayCoorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay Coor.</FormLabel>
                <FormControl>
                  <Input
                    {...register("barangayCoorId", {
                      required: "Barangay Coor. ID is required",
                    })}
                    {...field}
                    placeholder="Barangay Coor. ID"
                  />
                </FormControl>
                {errors.barangayCoorId && (
                  <FormMessage>{errors.barangayCoorId.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="purokCoorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purok Coor.</FormLabel>
                <FormControl>
                  <Input
                    {...register("purokCoorId", {
                      required: true,
                    })}
                    {...field}
                    placeholder="Purok Coor. ID"
                  />
                </FormControl>
                {errors.purokCoorId && (
                  <FormMessage>{errors.purokCoorId.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="teamLeaderID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Leader</FormLabel>
                <FormControl>
                  <Input
                    {...register("teamLeaderID", {
                      required: "Team Leader. ID is required",
                    })}
                    {...field}
                    placeholder="Team Leader ID"
                  />
                </FormControl>
                {errors.teamLeaderID && (
                  <FormMessage>{errors.teamLeaderID.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormDescription>
            Use this form to create a new team in the election system. Fields
            marked with * are required. Please note that the team leader ID must
            be unique and must be a valid ID.
          </FormDescription>
          <FormLabel>Team Members</FormLabel>
          {Array.from({ length: 10 }).map((_, i) => (
            <FormField
              key={i}
              name={`dynamicMembers.member${i + 1}`} // Register as dynamicMembers.member1, member2, etc.
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>{i + 1}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...register(`dynamicMembers.member${i + 1}`, {
                        required: `Member ID ${i + 1} is required`, // Add validation
                      })}
                      placeholder={`Member ID ${i + 1}`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </Form>
        <div className="w-full p-2 flex justify-end">
          <Button
            disabled={loading}
            className="w-auto flex gap-2"
            type="submit"
            size="sm"
          >
            <RiPassValidLine />
            {loading ? "Please wait..." : "Validate"}
          </Button>
        </div>
      </form>

      <div className="w-full p-2">
        <h1 className="font-mono text-lg">Results</h1>
      </div>
      <h1 className="p-1 px-2 font-mono font-medium">Members</h1>
      {teamError && (
        <div className="w-full h-auto p-4 grid">
          <h1 className="m-auto text-lg text-red-500">{teamError.message}</h1>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableHead>Firstname</TableHead>
          <TableHead>Lastname</TableHead>
          <TableHead>Remarks</TableHead>
        </TableHeader>
        <TableBody>
          {results?.composeTeam &&
            Object.values(
              JSON.parse(results?.composeTeam) as ValidatedTeamMembers[]
            ).map((item) => (
              <TableRow key={item.idNumber}>
                <TableCell>{item.idNumber}</TableCell>
                <TableCell>{item.remark}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Modal
        title="Validate the team members"
        open={onOpenModal === 1}
        onOpenChange={() => {
          setOnOpenModal(0);
        }}
      />
      <Modal
        title="Import JSON file"
        open={onOpenModal === 2}
        onOpenChange={() => {
          if (loading) return;
          setOnOpenModal(0);
        }}
        children={
          <div className="w-full h-auto">
            {loading ? (
              <div>
                <h1 className="text-lg font-medium">
                  Uploaded: {counter}/{listCount}
                </h1>
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
                  if (loading) return;
                  setOnOpenModal(0);
                }}
              >
                Close
              </Button>
              <Button
                disabled={loading}
                size="sm"
                onClick={handleImportJsonFile}
              >
                {loading ? "Please wait..." : "Confirm"}
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default TeamInput;
