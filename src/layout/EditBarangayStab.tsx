import React from "react";
import { useMutation } from "@apollo/client";
import { EDIT_MEMBERS_ATTENDANCE } from "../GraphQL/Mutation";
import { GET_BARANGAY_TEAM_STAB } from "../GraphQL/Queries";
//
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { Button } from "../components/ui/button";
//libs
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//schema
import { EditBarangayStabSchema } from "../zod/data";
import { TeamProps } from "../interface/data";
import { toast } from "sonner";
type EditTeamStab = z.infer<typeof EditBarangayStabSchema>;
interface Props {
  item: TeamProps[];
  barangayId: string;
  setOnOpen: React.Dispatch<React.SetStateAction<number>>;
}
const EditBarangayStab = ({ item, barangayId, setOnOpen }: Props) => {
  const form = useForm<EditTeamStab>({
    resolver: zodResolver(EditBarangayStabSchema),
    defaultValues: Object.fromEntries(
      item.map((item) => [item.id, item.membersAttendance?.actual?.toString()])
    ),
  });
  //   const defaultValues = form.getValues();
  //   const defaultValue = Array.from(defaultValues.entries());
  const {
    handleSubmit,
    formState: { errors },
  } = form;
  console.log("Form errors: ", errors);

  const [editMembersAttendance, { error, loading }] = useMutation(
    EDIT_MEMBERS_ATTENDANCE,
    {
      onError: () => {
        toast.error("Please input attendance", {
          description: "Failed to edit members attendance",
          closeButton: false,
        });
      },
      refetchQueries: [
        {
          query: GET_BARANGAY_TEAM_STAB,
          variables: { id: barangayId, level: 1 },
        },
      ],
      onCompleted: () => {
        toast.success("Successfully updated attendance", {
          closeButton: false,
        });
        setOnOpen(0);
      },
    }
  );

  console.log({ error });

  const onSubmit = async (data: EditTeamStab) => {
    try {
      const dataArray = Object.entries(data).map(([teamId, value]) => ({
        teamId,
        value: value || "0", // Fallback to "0" if undefined
      }));

      const filteredData = dataArray.filter((item) => item.value !== "0");
      if (filteredData.length > 0) {
        console.log({ filteredData });

        await editMembersAttendance({
          variables: {
            teams: filteredData,
          },
        });
      } else {
        toast.error("Please input attendance", {
          description: "Failed to edit members attendance",
          closeButton: false,
        });
      }
    } catch (error) {
      toast.error("An error occured.", {
        description: "Failed to edit members attendance",
        closeButton: false,
      });
    }
  };
  return (
    <div>
      <Form {...form}>
        <Table>
          <TableHeader>
            <TableHead>No.</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Members</TableHead>
          </TableHeader>
          <TableBody>
            {item &&
              item.map((team, i) => (
                <FormField
                  name={team.id}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <TableRow key={i} className=" cursor-pointer py-2">
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{`${team.teamLeader?.voter?.lastname}, ${team.teamLeader?.voter?.firstname}`}</TableCell>
                      <TableCell>{team._count.voters ?? 0}</TableCell>
                      <FormItem className=" flex gap-1">
                        <FormControl
                          className="w-[100px]"
                          defaultValue={team.membersAttendance?.actual ?? "0"}
                        >
                          <Input
                            max={team._count.voters}
                            min={0}
                            type="number"
                            defaultValue={"0"}
                            placeholder="0"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                          />
                        </FormControl>
                      </FormItem>
                    </TableRow>
                  )}
                />
              ))}
          </TableBody>
        </Table>
        <div className=" flex w-full justify-end">
          <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditBarangayStab;
