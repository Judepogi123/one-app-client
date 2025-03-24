import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// hooks
import { useForm } from "react-hook-form";
import { useState } from "react";
// ui
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormDescription,
} from "../components/ui/form";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";
// interfaces
import { GenerateTeamSchema } from "../zod/data";
import { Button } from "../components/ui/button";
// icons
import { FaRegFileExcel, FaRegIdBadge } from "react-icons/fa";
import axios from "../api/axios";
import { MembersCapacities } from "../utils/helper";

interface Props {
  barangay: string;
  zipCode: string;
  selectedId: string[];
  level: string;
}

type TeamProps = z.infer<typeof GenerateTeamSchema>;

const GenerateTeam = ({ barangay, zipCode, selectedId, level }: Props) => {
  const [, setType] = useState(0);

  const form = useForm<TeamProps>({
    resolver: zodResolver(GenerateTeamSchema),
    defaultValues: {
      delisted: false,
      dead: false,
      ud: false,
      nd: false,
      op: false,
      inc: false,
      selected: false,
      membersCount: "all",
    },
  });
  const {
    watch,
    formState: { isSubmitting },
  } = form;
  const headerOnly = watch("headOnly", false);

  const onSubmit = async (data: TeamProps) => {
    if (zipCode === "all" || barangay === "all") {
      toast.warning("Select specific are", {
        description: "Too large data set to generate",
      });
      return;
    }

    try {
      if (data.headOnly) {
        const response = await axios.post(
          "upload/generate-id",
          {
            id: selectedId,
            level: level,
            barangay: barangay,
            selectedOnly: data.selected,
          },
          {
            responseType: "blob",
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to generate ID");
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "VoterIDs.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      const response = await axios.post(
        "upload/generate-team",
        {
          barangay: barangay,
          zipCode: zipCode,
          selectedId: selectedId,
          level: level,
          ...data,
        },
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Team_Members_BreakDown.xlsx`; // Suggested filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      if (response.status === 200) {
        toast.success("Team generated successfully!");
        setType(0);
      }
    } catch (error) {
      toast.error("Failed to generate", {
        closeButton: false,
        description: `${error}`,
      });
    }
    console.log("Form Data:", data);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full">
            <h1 className="text-lg font-mono font-semibold">Subject</h1>
            <FormField
              name="headOnly"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mt-2 gap-2">
                    <FormLabel>Header only</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormDescription>
              If not check, all the teams, both Header and members will be
              included.
            </FormDescription>
            <h1 className="font-mono font-semibold mt-4">Members with</h1>
            <div className="w-full grid grid-cols-2">
              {" "}
              {["delisted", "dead", "ud", "nd", "op", "inc", "or"].map(
                (fieldName) => (
                  <FormField
                    key={fieldName}
                    name={fieldName as keyof TeamProps}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-full col-span-1">
                        <div className="flex items-center mt-2 gap-2">
                          <FormLabel>{fieldName.toUpperCase()}</FormLabel>
                          <FormControl>
                            <Checkbox
                              disabled
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>
            <FormDescription>
              If none of option were check, it will be automically all members.
            </FormDescription>
          </div>

          <div className="w-full mt-2 col-span-2">
            <FormField
              name="membersCount"
              control={form.control}
              render={({ field: { value, onChange, onBlur } }) => (
                <FormItem>
                  <div className="mt-2">
                    <FormLabel>
                      Members count
                      <span className="text-sm text-gray-500">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue="all"
                        className="grid grid-cols-3 gap-2"
                        onValueChange={onChange}
                        value={value}
                        onBlur={onBlur}
                      >
                        {[
                          "all",
                          "noMembers",
                          "threeAndBelow",
                          "four",
                          "five",
                          "sixToNine",
                          "equalToMax",
                          "aboveMax",
                        ].map((item, i) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={item} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {MembersCapacities[i]}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <h1 className="text-lg font-mono font-semibold mt-4">Actions</h1>
          <div className="col-span-2 p-2 grid grid-cols-2 gap-2">
            <FormField
              name="selected"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 mb-2">
                  <div className="flex items-center mt-2 gap-2">
                    <FormLabel>Only the selected</FormLabel>
                    <FormControl>
                      <Checkbox
                        disabled={selectedId.length === 0}
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <Button
              disabled={!headerOnly || isSubmitting}
              type="submit"
              size="sm"
              variant="outline"
              className="flex gap-2"
              onClick={() => setType(1)}
            >
              <FaRegIdBadge />
              ID
            </Button>

            <Button
              disabled={isSubmitting || headerOnly}
              type="submit"
              size="sm"
              variant="secondary"
              className="flex gap-2"
              onClick={() => setType(2)}
            >
              <FaRegFileExcel />
              Export as Excel
            </Button>
          </div>
        </form>
        <FormDescription>
          In generating ID, the filter doesn't work and take effect.
        </FormDescription>
      </Form>
    </div>
  );
};

export default GenerateTeam;
