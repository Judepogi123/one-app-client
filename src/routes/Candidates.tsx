/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserData } from "../provider/UserDataProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChromePicker, ColorResult } from "react-color";
//ui
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
//import { Label } from "../components/ui/label";
import Modal from "../components/custom/Modal";
//import Maintenance from "../components/custom/Maintenance";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
  FormLabel,
} from "../components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
///import CandidateBatch from "../components/custom/CandidateBatch";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { ADD_NEW_CANDIDATE, CREATE_POSITION } from "../GraphQL/Mutation";
import { GET_CANDIDATES } from "../GraphQL/Queries";
import { toast } from "sonner";

//icons
import { IoIosAddCircleOutline } from "react-icons/io";

//props
import { CandidatesProps } from "../interface/data";
import MunicipalSel from "../components/custom/MunicipalSel";

const FormSchema = z.object({
  firstname: z.string().min(3, "Must have at least 3 characters"),
  lastname: z.string().min(3, "Must have at least 3 characters"),
  code: z.string().min(2, "Must have at least 2 characters"),
  colorCode: z.string().optional().default("#ffffff"),
});

const PositionSchema = z.object({
  title: z.string().min(3, "Must have at least 3 characters."),
});

type FormProps = z.infer<typeof FormSchema>;
type PositionProps = z.infer<typeof PositionSchema>;

const Candidates = () => {
  const [onModal, setOnModal] = useState(0);
  const user = useUserData();
  const [params, setParams] = useSearchParams({
    zipCode: user?.forMunicipal ? user?.forMunicipal.toString() : "4905",
  });
  const navigate = useNavigate();

  const currentMunicipal = params.get("zipCode") || "4905";

  const { data, refetch } = useQuery<{
    candidates: CandidatesProps[];
  }>(GET_CANDIDATES, {
    variables: {
      zipCode: currentMunicipal,
    },
  });
  console.log(data);

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

  // return <Maintenance />;

  return (
    <div className="w-full">
      <div className="w-full p-2 flex justify-end gap-2 border border-gray-400">
        <MunicipalSel
          disabled={user.forMunicipal ? true : false}
          className="max-w-96"
          defaultValue={currentMunicipal}
          value={currentMunicipal}
          handleChangeArea={handleChangeArea}
        />
        {/* <CandidateBatch className=" w-auto" /> */}
        <Popover>
          <PopoverTrigger disabled>
            <Button size="sm" className="flex gap-2" disabled>
              <IoIosAddCircleOutline />
              New
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full min-w-60 flex flex-col gap-1">
            <h1>Create new</h1>

            <Button variant="outline" size="sm" onClick={() => setOnModal(2)}>
              Position
            </Button>
            <Button variant="outline" size="sm" onClick={() => setOnModal(3)}>
              Batch
            </Button>
            <Button size="sm" onClick={() => setOnModal(1)}>
              Candidate
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableHead>Lastname</TableHead>
          <TableHead>Firstname</TableHead>
          <TableHead>Code</TableHead>
          {/* <TableHead>Overall</TableHead> */}
          <TableHead>Figure Heads</TableHead>
          <TableHead>BC</TableHead>
          <TableHead>PC</TableHead>
          <TableHead>TL</TableHead>
          <TableHead>W/Team</TableHead>
          <TableHead>W/oTeam</TableHead>
        </TableHeader>

        <TableBody>
          {data &&
            data?.candidates.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => navigate(`/manage/candidates/${item.id}`)}
                className=" cursor-pointer hover:bg-gray-300"
              >
                <TableCell>{item.lastname}</TableCell>
                <TableCell>{item.firstname}</TableCell>
                <TableCell>{item.code}</TableCell>
                {/* <TableCell>{item.supporters}</TableCell> */}
                <TableCell>{item.inTeam.figureHeads}</TableCell>
                <TableCell>{item.inTeam.bc}</TableCell>
                <TableCell>{item.inTeam.pc}</TableCell>
                <TableCell>{item.inTeam.tl}</TableCell>
                <TableCell>{item.inTeam.withTeams}</TableCell>
                <TableCell>{item.inTeam.voterWithoutTeam}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Modal
        title="Add new candidates"
        children={<NewCandidates refetch={refetch} />}
        open={onModal === 1}
        onOpenChange={() => {
          setOnModal(0);
        }}
      />
      <Modal
        title="Add new positions"
        children={<NewPositions setOnModal={setOnModal} />}
        open={onModal === 2}
        onOpenChange={() => {
          setOnModal(0);
        }}
      />
    </div>
  );
};

export default Candidates;

const NewCandidates = ({
  refetch,
}: {
  refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<
    ApolloQueryResult<{
      candidates: CandidatesProps[];
    }>
  >;
}) => {
  const form = useForm<FormProps>({
    resolver: zodResolver(FormSchema),
    defaultValues: { colorCode: "#ffffff" },
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = form;

  const [addNewCandidate, { error }] = useMutation(ADD_NEW_CANDIDATE);

  useEffect(() => {
    if (error) {
      setError("code", { message: error.message });
      return;
    }
  }, [error]);

  const submit = async (value: FormProps) => {
    console.log("click");

    const response = await addNewCandidate({
      variables: {
        firstname: value.firstname,
        lastname: value.lastname,
        code: value.code,
        colorCode: value.colorCode,
      },
    });

    if (response.data) {
      refetch();
      toast("Success!");
    }
  };

  const handleColorChange = (color: ColorResult) => {
    setValue("colorCode", color.hex);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(submit)}>
        <Form {...form}>
          <FormField
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="firstname">Firstname</FormLabel>
                <FormControl id="firstname">
                  <Input
                    {...field}
                    placeholder="Enter first name"
                    {...register("firstname")}
                  />
                </FormControl>
                {errors.firstname && (
                  <FormMessage>{errors.firstname.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lastname">Lastname</FormLabel>
                <FormControl id="lastname">
                  <Input
                    {...field}
                    placeholder="Enter last name"
                    {...register("lastname")}
                  />
                </FormControl>
                {errors.lastname && (
                  <FormMessage>{errors.lastname.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="code">Code</FormLabel>
                <FormControl id="code">
                  <Input
                    {...field}
                    placeholder="Enter code"
                    {...register("code")}
                  />
                </FormControl>
                {errors.code && (
                  <FormMessage>{errors.code.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            name="colorCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="colorCode">Color code</FormLabel>
                <FormControl id="colorCode">
                  <ChromePicker
                    color={field.value || "#ffffff"}
                    onChange={(color) => {
                      handleColorChange(color);
                      field.onChange(color.hex);
                    }}
                  />
                </FormControl>
                {errors.colorCode && (
                  <FormMessage>{errors.colorCode.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </Form>
        <div className="w-full py-2">
          <Button type="submit" className="w-full rounded-full">
            {isSubmitting ? "Adding, please wait..." : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const NewPositions = ({
  setOnModal,
}: {
  setOnModal: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const form = useForm<PositionProps>({
    resolver: zodResolver(PositionSchema),
  });
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const [createPosition, { error }] = useMutation(CREATE_POSITION);

  useEffect(() => {
    if (error) {
      setError("title", { message: error.message });
    }
  }, [error]);

  const onSubmit = async (value: PositionProps) => {
    const response = await createPosition({
      variables: {
        title: value.title,
      },
    });
    if (response.data) {
      toast("Success!", {
        closeButton: false,
      });
      setOnModal(0);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form {...form}>
          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...register("title", { required: true })}
                  />
                </FormControl>
                {errors.title && (
                  <FormMessage>{errors.title.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </Form>
        <div className="flex p-2 w-full justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating, please wait..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};
