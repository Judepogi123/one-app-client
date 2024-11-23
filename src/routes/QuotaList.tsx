import { useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
//ui
import Modal from "../components/custom/Modal";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
//type
import {
  BarangayProps,
  AgeBracket,
  GenderProps,
  GenderSizeProps,
} from "../interface/data";

//graphql
import { BARANGAY_QUOTA } from "../GraphQL/Queries";
import {
  CREATE_QUOTA,
  CREATE_GENDER_QUOTA,
  REMOVE_GENDER_QUOTRA,
  RESET_BARANGAY_QUOTA,
  REMOVE_QUOTA,
} from "../GraphQL/Mutation";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
//icons
import { MdOutlineDelete } from "react-icons/md";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
//props
interface SelectedProps {
  id: string;
  segment: string;
  genderSize: GenderSizeProps[];
}

interface FormProps {
  size: string;
  genderId: string;
  quotaId: string;
}

const QuotaList = () => {
  const [selected, setSelected] = useState<SelectedProps | null>(null);
  const [onNew, setOnNew] = useState<boolean>(false);
  const [onAdd, setOnAdd] = useState<boolean>(false);
  const [onView, setOnView] = useState(false)
  const [onQuotaReset, setOnQuotaReset] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [genderSize, setGenderSize] = useState<string>("0");
  const { barangayID } = useParams();

  const form = useForm<FormProps>();
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const { data, refetch } = useQuery<{
    ageList: AgeBracket[];
    barangay: BarangayProps;
    genderList: GenderProps[];
  }>(BARANGAY_QUOTA, {
    variables: {
      id: barangayID,
    },
    onCompleted: (data) => {
      if (data.genderList.length > 0) {
        setSelectedGender(data.genderList[0].id); // Initial set on data load
      }
    },
  });

  const [createQuota] = useMutation(CREATE_QUOTA);
  const [createGenderQuota] =
    useMutation(CREATE_GENDER_QUOTA);
  const [removeGenderQuota] =
    useMutation(REMOVE_GENDER_QUOTRA);
  const [resetBarangayQuota, { loading: quotaReseting }] =
    useMutation(RESET_BARANGAY_QUOTA);
  const [removeQuota, { loading: removeIsLoading }] = useMutation(REMOVE_QUOTA);

  const handleResetAllQUota = async () => {
    try {
      const response = await resetBarangayQuota({
        variables: {
          id: barangayID,
        },
      });
      if (response.data) {
        refetch();
        toast("Success!");
        setOnQuotaReset(false);
      }
    } catch (error) {
      toast("An error occured.");
    }
  };

  const onSubmit = async (value: FormProps) => {
    if (!selected) {
      return;
    }
    try {
      const response = await createGenderQuota({
        variables: {
          quota: {
            size: parseInt(value.size, 10),
            genderId: value.genderId,
            quotaId: selected.id,
          },
        },
      });
      if (response.data) {
        setOnNew(false);
        refetch();
      }
    } catch (error) {
      toast("An error occured.");
    }
  };

  const handleRemoveQuota = async()=>{
    try {
      const response = await removeQuota({
        variables: {
          id: selected?.id
        }
      })
      if(response.data){
        refetch();
        setSelected(null)
      }
    } catch (error) {
      toast("An error occured")
    }
  }

  const handleRemoveGenderQuota = async (value: string) => {

    try {
      const response = await removeGenderQuota({
        variables: {
          id: value,
        },
      });
      if (response.data) {
        setOnNew(false);
        refetch();
      }
    } catch (error) {
      toast("An error occured.");
    }
  };

  const handleSelected = (
    id: string,
    segment: string,
    genderSize: GenderSizeProps[]
  ) => {
    setSelected({ id, segment, genderSize: genderSize });
  };

  if (!data) {
    return;
  }
  const { ageList, barangay, genderList } = data;

  const handleNewQuota = async () => {
    if (!selectedGender || !selectedGender) {
      return;
    }

    try {
      const response = await createQuota({
        variables: {
          quota: {
            barangayId: barangayID,
            ageBracketId: selectedAge,
          },
          gender: {
            genderId: selectedGender,
            size: parseInt(genderSize, 10),
          },
        },
      });
      if (response.errors) {
        console.log(response.errors);
        return;
      }
      if (response.data) {
        refetch();
        setOnNew(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 flex justify-between items-center">
        <h1 className=" font-semibold text-lg">{barangay.name}-(Surveyor: {barangay.surveyor})</h1>
        <div className="w-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={()=> {
            if(barangay.surveyor === 0){
              return
            }
            setOnView(!onView)}}><HiOutlineSwitchHorizontal/></Button>
          <Button
            disabled={barangay.quota?.length === 0}
            size="sm"
            variant="outline"
            onClick={() => setOnQuotaReset(true)}
          >
            Reset
          </Button>
          <Button size="sm" onClick={() => setOnNew(true)}>
            New
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 p-2">
        <Table>
          <TableHeader className="w-full border border-r-0 border-l-0 bg-gray-100">
            <TableHead>Age segment</TableHead>
            {genderList.map((item) => (
              <TableHead>{item.name}</TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {barangay.quota?.map((item) => (
              <TableRow
                onClick={() =>
                  handleSelected(item.id, item.age.segment, item.gendersSize)
                }
              >
                <TableCell>{item.age.segment}</TableCell>
                {item.gendersSize.map((item) => (
                  <TableCell className=" cursor-pointer">{onView? Math.round(item.size / barangay.surveyor) : item.size}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        title={selected?.segment}
        open={selected !== null}
        onOpenChange={() => {
          setSelected(null);
        }}
        children={
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="w-full flex flex-col gap-2">
                  {selected?.genderSize.map((item) => (
                    <div className="w-full flex">
                      <FormField
                        name="genderSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.gender.name}</FormLabel>
                            <div className="w-full flex gap-2">
                              <FormControl>
                                <Input
                                  {...field}
                                  defaultValue={item.size || 0}
                                />
                              </FormControl>
                              <Button
                                onClick={() => handleRemoveGenderQuota(item.id)}
                                size="sm"
                              >
                                <MdOutlineDelete />
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                <div className="w-full mt-2 py-2">
                  <Button
                    onClick={() => setOnAdd(!onAdd)}
                    variant="outline"
                    size="sm"
                  >
                    <IoMdAdd />
                  </Button>
                </div>
                {onAdd && (
                  <div className="">
                    <FormField
                      control={control}
                      name="genderId"
                      render={({ field: { onChange } }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>

                              <SelectContent>
                                {genderList.map((item) => (
                                  <SelectItem value={item.id}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="mt-2"
                              placeholder="Set value"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div className="w-full py-2 flex justify-between">
                  <Button disabled={removeIsLoading} onClick={handleRemoveQuota} variant="destructive">Delete</Button>
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Updating" : "Update"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        }
      />
      <Modal
        onFunction={handleNewQuota}
        open={onNew}
        onOpenChange={() => {
          setOnNew(false);
        }}
        footer={true}
        children={
          <div className="w-full">
            <div className="w-full py-3">
              <div className="">
                <h1 className="font-semibold">Select age segment</h1>
              </div>
              <Select onValueChange={(value) => setSelectedAge(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age segment" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {ageList
                    .filter(
                      (age) =>
                        !barangay.quota?.some(
                          (item) => item.ageBracketId === age.id
                        )
                    )
                    .map((filteredAge) => (
                      <SelectItem key={filteredAge.id} value={filteredAge.id}>
                        {filteredAge.segment}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full py-3">
              <div className="mb-2">
                <h1 className="font-semibold">Select gender</h1>
              </div>
              <RadioGroup defaultValue={selectedGender as string}>
                {genderList.map((item) => (
                  <div key={item.id} className="flex w-auto items-center gap-2">
                    <RadioGroupItem value={item.id} id={item.id} />
                    <Label htmlFor={item.id}>{item.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="w-full py-2">
              <h1 className="font-semibold">Set value</h1>
              <Input
                placeholder="Gender size"
                onChange={(e) => setGenderSize(e.target.value)}
              />
            </div>
          </div>
        }
      />

      <Modal
        title="Reset all quota?"
        footer={true}
        onFunction={handleResetAllQUota}
        open={onQuotaReset}
        onOpenChange={() => setOnQuotaReset(false)}
        loading={quotaReseting}
      />
    </div>
  );
};

export default QuotaList;
