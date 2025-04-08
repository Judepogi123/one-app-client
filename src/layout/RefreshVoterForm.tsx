import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

//lib
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//ui
import {
  FormControl,
  FormDescription,
  FormItem,
  FormField,
  // FormLabel,
  // FormMessage,
  Form,
} from "../components/ui/form";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";

//
import { REFRESH_VOTER } from "../GraphQL/Mutation";

//props
import { RefreshVoter } from "../zod/data";
import { toast } from "sonner";

interface Props {
  selected: string[];
}

type RefreshVoterType = z.infer<typeof RefreshVoter>;
const RefreshVoterForm = ({ selected }: Props) => {
  const form = useForm<RefreshVoterType>({
    resolver: zodResolver(RefreshVoter),
  });
  const { handleSubmit } = form;

  const [refreshVoter] = useMutation(REFRESH_VOTER, {
    onCompleted: () => {},
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: RefreshVoterType) => {
    if (selected.length === 0) {
      return toast.warning("Please select at least one!", {
        closeButton: false,
      });
    }
    await refreshVoter({
      variables: {
        team: data.team,
        connection: data.connection,
        header: data.header,
        ids: selected,
      },
    });
  };
  return (
    <Form {...form}>
      <FormField
        name="connection"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox onCheckedChange={onChange} value={value} />
              </FormControl>
              <span>Connection</span>
            </div>
            <FormDescription>
              Connection: candidate; Team ID; Level:
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        name="team"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox onCheckedChange={onChange} value={value} />
              </FormControl>
              <span>Team Relation</span>
            </div>
            <FormDescription>Voter as Member TL/PC</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        name="header"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox onCheckedChange={onChange} value={value} />
              </FormControl>
              <span>Header Relation</span>
            </div>
            <FormDescription>Voter Level as BC/PC/TL</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        name="blocklisted"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox onCheckedChange={onChange} value={value} />
              </FormControl>
              <span>BlackListed</span>
            </div>
            <FormDescription>Voter Level as BC/PC/TL</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        name="records"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox onCheckedChange={onChange} value={value} />
              </FormControl>
              <span>Records</span>
            </div>
            <FormDescription>Voter Level as BC/PC/TL</FormDescription>
          </FormItem>
        )}
      />
      <Button type="submit" size="sm" onClick={handleSubmit(onSubmit)}>
        Start
      </Button>
    </Form>
  );
};

export default RefreshVoterForm;
