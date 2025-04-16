import { useEffect } from "react";
import { EDIT_BARANGAY_VARAIANCE } from "../GraphQL/Mutation";
//lib
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//ui
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormLabel,
  FormItem,
  FormDescription,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
//props and schema
import { EditBarangayCommelec } from "../zod/data";
import { GET_BARANGAY_STAB } from "../GraphQL/Queries";
import { toast } from "sonner";

type EditBarangayType = z.infer<typeof EditBarangayCommelec>;

interface Props {
  stabTwo: number;
  barangayId: string;
  zipCode: number;
  setOnOpen: React.Dispatch<React.SetStateAction<number>>;
}

const EditBarangayStabColl = ({
  stabTwo,
  barangayId,
  zipCode,
  setOnOpen,
}: Props) => {
  const form = useForm<EditBarangayType>({
    resolver: zodResolver(EditBarangayCommelec),
  });
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setValue,
  } = form;
  const resultVariance = watch("result", "0");
  const variance = watch("variance", "-");
  console.log({ resultVariance, stabTwo });

  useEffect(() => {
    const intVariance = parseInt(resultVariance, 10);
    if (intVariance > stabTwo) {
      setValue("variance", "-");
    } else if (intVariance < stabTwo) {
      setValue("variance", "+");
    } else {
      setValue("variance", "=");
    }
  }, [resultVariance]);

  const [editBaragangay, { loading }] = useMutation(EDIT_BARANGAY_VARAIANCE, {
    onCompleted: () => {
      setOnOpen(0);
      toast.success("Update successfully!");
    },
    onError: (err) => {
      console.log(err);
    },
    refetchQueries: [
      {
        query: GET_BARANGAY_STAB,
        variables: {
          zipCode,
        },
      },
    ],
  });

  const onSubmit = async (data: EditBarangayType) => {
    await editBaragangay({
      variables: {
        value: parseInt(data.result, 10),
        variance: data.variance,
        barangayId: barangayId,
      },
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <FormField
          name="result"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormItem>
              <FormLabel>Commelec Result</FormLabel>
              <FormDescription>Collected Stab Two: {stabTwo}</FormDescription>
              <FormControl>
                <Input
                  placeholder="Type the commelec result here"
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  type="number"
                  min={0}
                />
              </FormControl>
              {errors.result && (
                <FormMessage>{errors.result.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          name="variance"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>Variance</FormLabel>
              <FormControl>
                <RadioGroup
                  value={variance}
                  defaultValue="-"
                  onChange={onChange}
                >
                  <FormItem className=" flex gap-2">
                    <span>-</span>
                    <RadioGroupItem value="-" />
                  </FormItem>
                  <FormItem className=" flex gap-2">
                    <span>=</span>
                    <RadioGroupItem value="=" />
                  </FormItem>
                  <FormItem className=" flex gap-2">
                    <span>+</span>
                    <RadioGroupItem value="+" />
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
      <div className="w-full p-2 py-4 flex justify-end ">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={loading || isSubmitting}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EditBarangayStabColl;
