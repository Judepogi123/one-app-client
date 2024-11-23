import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
//graphql
import { useQuery } from "@apollo/client";
import { GET_MUNICIPALS, SURVEY_BARANGAY_QUOTA } from "../GraphQL/Queries";
//ui
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../components/ui/select";
import Alert from "../components/custom/Alert";
import Modal from "../components/custom/Modal";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
} from "../components/ui/form";
//props
import { MunicipalProps, BarangayProps } from "../interface/data";

const BarangaySize = () => {
  const [selectedMun, setSelectedMun] = useState<number | undefined>(undefined);
  const [selected, setSelected] = useState<BarangayProps | null>(null);
  const [onEdit, setOnEdit] = useState<boolean>(false);

  const form = useForm<BarangayProps>();
  const { handleSubmit, register } = form;

  const { surveyID } = useParams();
  const {
    data: munData,
    loading: munLoading,
    error: munError,
  } = useQuery<{ municipals: MunicipalProps[] }>(GET_MUNICIPALS);

  const { data, loading, error, refetch } = useQuery<{
    barangays: BarangayProps[];
  }>(SURVEY_BARANGAY_QUOTA, {
    variables: {
      quota: {
        id: surveyID,
      },
    },
    skip: !selectedMun,
  });

  useEffect(() => {
    if (munData && munData.municipals.length > 0) {
      setSelectedMun(munData.municipals[0].id);
    }
  }, [munData]);

  if (munError) {
    return (
      <div className="w-full p-2">
        <Alert
          title="An error occured"
          desc={munError.message}
          variant="destructive"
        />
      </div>
    );
  }

  if (!munData) {
    return;
  }
  if (!data) {
    return;
  }
  const { municipals } = munData;
  const { barangays } = data;

  const handleChangeSelected = (value: string) => {
    setSelectedMun(parseInt(value, 10));
  };

  const handleSelected = (item: BarangayProps) => {
    setSelected(item);
    setOnEdit(true);
  };
  return (
    <div className=" w-full h-auto">
      <div className="w-full p-2">
        <Select
          disabled={munLoading}
          value={selectedMun?.toString()} // Set the value of Select
          onValueChange={(value) => handleChangeSelected(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select municipal" />
          </SelectTrigger>
          <SelectContent className="w-auto">
            {municipals.map((item) => (
              <SelectItem value={item.id.toString()}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Table>
          <TableHeader>
            {[
              "Barangay",
              "Population",
              "Sample size",
              "Female size",
              "Male size",
              "Surveyor",
            ].map((item) => (
              <TableHead>{item}</TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {barangays.map((item) => (
              <TableRow
                className=" cursor-pointer"
                onClick={() => handleSelected(item)}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.population}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        title={selected?.name}
        open={onEdit}
        onOpenChange={() => {
          setSelected(null);
          setOnEdit(false);
        }}
        children={
          <div className="w-full">
            <Form {...form}>
              <form action="">
                <FormField
                  name="population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poppulation</FormLabel>
                      <FormControl>
                        <Input defaultValue={selected?.population} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="sampleSize"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Sample size</FormLabel>
                      <FormControl>
                        <Input defaultValue={selected?.sampleSize || 0} {...field} type="number" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="femaleSize"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Female size</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="maleSize"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Male size</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="surveyor"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Surveyor</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        }
      />
    </div>
  );
};

export default BarangaySize;
