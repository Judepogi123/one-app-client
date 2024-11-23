/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import { Slider } from "../components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";

// GraphQL
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { GET_MUNICIPALS, GET_BARANGAYS } from "../GraphQL/Queries";
import {
  SAMPLE_SIZE_UPDATE,
  RESET_SURVEYOR,
  RESET_BARANGAY_ACTIVE_SURVEYOR,
} from "../GraphQL/Mutation";
// Types
import { MunicipalProps, PurokProps } from "../interface/data";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

//icons
import { SlOptionsVertical } from "react-icons/sl";

interface BarangayProps {
  name: string;
  id: string;
  barangayVotersCount: number;
  puroks: PurokProps[];
  purokCount: number;
  population: number;
  sampleSize: number;
  sampleRate: number;
  activeSurveyor: number;
  femaleSize: number;
  maleSize: number;
  surveyor: number;
}

interface FomrType {
  sampleSize: number;
  sampleRate: number;
  population: number;
  female: number;
  male: number;
  surveyor: number;
  activeSurveyor: number;
  femaleSize: number;
  maleSize: number;
}

const SampleSize = () => {
  const [onEdit, setOnEdit] = useState<BarangayProps | null>(null);
  const [onReset, setOnReset] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const form = useForm<FomrType>();
  const { handleSubmit, control, watch, setValue, resetField } = form;

  const { data, loading } = useQuery<{ municipals: MunicipalProps[] }>(
    GET_MUNICIPALS
  );

  const [updateSampleSize, { loading: updateSampleSizeLoading }] =
    useMutation(SAMPLE_SIZE_UPDATE);

  const [resetSurveyor, { loading: resetIsloading }] =
    useMutation(RESET_SURVEYOR);

  const [resetActiveSurvey, { loading: resetLoading }] = useMutation(
    RESET_BARANGAY_ACTIVE_SURVEYOR
  );

  const [currentMun, setCurrentMun] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (data && data.municipals.length > 0) {
      setCurrentMun(data.municipals[0].id.toString());
    }
  }, [data]);

  const population = watch("population", onEdit?.population);
  const sampleRate = watch("sampleRate", onEdit?.sampleRate);

  useEffect(() => {
    const calculatedSampleSize = Math.round((population * sampleRate) / 100);
    setValue("sampleSize", calculatedSampleSize);
  }, [population, sampleRate, setValue]);

  const {
    data: bardata,
    loading: barLoading,
    refetch: refetchBarangays,
  } = useQuery<{ barangayList: BarangayProps[] }>(GET_BARANGAYS, {
    variables: {
      zipCode: parseInt(currentMun as string, 10),
    },
    skip: !currentMun,
  });

  const handleSelected = (value: BarangayProps) => {
    setOnEdit(value);
  };

  const handleResetSurveyor = async () => {
    try {
      const response = await resetActiveSurvey({
        variables: {
          id: onEdit?.id,
        },
      });
      if(response.data){
        refetchBarangays()
        toast("Successfully updated.")
      }
    } catch (error) {
      toast("An error occured.")
    }
  };

  const handleReset = async () => {
    try {
      const response = await resetSurveyor({
        variables: {
          id: parseInt(currentMun as string, 10),
        },
      });
      if (response.data) {
        refetchBarangays();
        setOnReset(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (value: FomrType) => {
    if (!onEdit) return;
    const parsedPopulation = parseInt(value.population as any, 10);
    const parsedSampleRate = parseInt(value.sampleRate as any, 10);
    const parsedSampleSize = parseInt(value.sampleSize as any, 10);
    const parsedFemaleSize = parseInt(value.femaleSize as any, 10);
    const parsedMaleSize = parseInt(value.maleSize as any, 10);
    const parsedActiveSurveyor = parseInt(value.activeSurveyor as any, 10);
    const parsedsurveyor = parseInt(value.surveyor as any, 10);

    try {
      const data = await updateSampleSize({
        variables: {
          sample: {
            id: onEdit.id,
            sampleRate: parsedSampleRate || 0,
            sampleSize: parsedSampleSize || 0,
            population: parsedPopulation || onEdit.population,
            activeSurveyor: parsedActiveSurveyor || onEdit.activeSurveyor,
            femaleSize: parsedFemaleSize || onEdit.femaleSize,
            maleSize: parsedMaleSize || onEdit.maleSize,
            surveyor: parsedsurveyor || 0,
          },
        },
      });

      if (data.data) {
        refetchBarangays();
        toast("Update successfully");
        resetField("surveyor");
        resetField("activeSurveyor");
        setOnEdit(null);
        return;
      }
    } catch (error) {
      toast("Failed to update!");
    }
  };

  if (!bardata) {
    return;
  }
  const { barangayList } = bardata;
  return (
    <div className="w-full h-auto">
      <div className="w-full p-1 flex gap-2 px-2">
        <div className="w-auto flex items-center gap-2">
          <h1 className=" text-xs font-semibold text-slate-600">Municipals</h1>
          <Select
            onValueChange={(value) => setCurrentMun(value)}
            disabled={loading}
            defaultValue={currentMun}
          >
            <SelectTrigger className="w-auto">
              <SelectValue
                placeholder={
                  data?.municipals[0]?.name.toString() || "Select Municipal"
                }
              />
            </SelectTrigger>

            <SelectContent className="w-auto">
              {data?.municipals.map((item, i) => (
                <SelectItem key={i} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <h1 className=" text-xs font-semibold text-slate-600">Reset</h1>
          <Select onValueChange={(value) => setOnReset(value)}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select" />
            </SelectTrigger>

            <SelectContent className="w-auto">
              {[
                "All",
                "Population",
                "Sample Rate",
                "Male Size",
                " Female Size",
                "Sample Size",
                "Surveyor",
              ].map((item) => (
                <SelectItem value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-zinc-300 text-gray-800">
          <TableHead>Barangay</TableHead>
          <TableHead>Population</TableHead>
          <TableHead>Sample rate</TableHead>
          <TableHead>Male size</TableHead>
          <TableHead>Female size</TableHead>
          <TableHead>Sample size</TableHead>
          <TableHead>Surveyor</TableHead>
          <TableHead></TableHead>
        </TableHeader>
        <TableBody>
          {barLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : bardata?.barangayList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No Barangay found!
              </TableCell>
            </TableRow>
          ) : (
            barangayList.map((item, i) => (
              <TableRow key={i} className="cursor-pointer border-t-gray-400 border-b-gray-400">
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.population}</TableCell>
                <TableCell>{item.sampleRate}%</TableCell>
                <TableCell>{item.maleSize || 0}</TableCell>
                <TableCell>{item.femaleSize || 0}</TableCell>
                <TableCell>{item.sampleSize}</TableCell>
                <TableCell>
                  {item.activeSurveyor || 0}/{item.surveyor || 0}
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger>
                      <Button variant="ghost">
                        <SlOptionsVertical />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleSelected(item)}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => navigate(`/requirement/${item.id}`)}
                      >
                        Age/gender quota
                      </Button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        title={onEdit?.name || "Unknown"}
        onOpenChange={() => setOnEdit(null)}
        open={onEdit !== null}
        children={
          <div className="w-full h-auto">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  control={control}
                  name="population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Population</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          min={0}
                          type="number"
                          defaultValue={onEdit?.population}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="sampleRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sample Rate</FormLabel>
                      <FormControl>
                        <Slider
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={[field.value]}
                          defaultValue={[onEdit?.sampleRate as number]}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </FormControl>
                      <FormMessage>
                        {field.value
                          ? field.value
                          : onEdit && onEdit.sampleRate}
                        %
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="sampleSize"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Sample Size</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder={`${onEdit?.sampleSize}`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="maleSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Male</FormLabel>
                      <FormControl defaultValue={onEdit?.maleSize}>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter the male size"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="femaleSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Female</FormLabel>
                      <FormControl defaultValue={onEdit?.femaleSize}>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter the female size"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="surveyor"
                  render={({ field }) => (
                    <FormItem className=" mt-8">
                      <FormLabel>Surveyor</FormLabel>
                      <FormControl defaultValue={onEdit?.surveyor}>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter the surveyor size"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full py-2">
                  <Button
                    onClick={handleResetSurveyor}
                    variant="secondary"
                    size="sm"
                    disabled={resetLoading}
                  >
                   {resetLoading? "Updating..." : `Reset Active surveyor ${(onEdit?.activeSurveyor)}`}
                  </Button>
                </div>
                <div className="w-full p-2 flex justify-end gap-2">
                  <Button
                    onClick={() => setOnEdit(null)}
                    variant="outline"
                    disabled={updateSampleSizeLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateSampleSizeLoading}>
                    {updateSampleSizeLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        }
      />

      <Modal
        title={`Reset ${onReset} for all barangay`}
        open={onReset !== undefined}
        onOpenChange={() => setOnReset(undefined)}
        footer={true}
        onFunction={handleReset}
        loading={resetIsloading}
      />
    </div>
  );
};

export default SampleSize;
