/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
//graphql
import { SEARCH_VOTER } from "../GraphQL/Queries";
import { SET_VOTER_LEVEL } from "../GraphQL/Mutation";
import { ApolloQueryResult, OperationVariables, useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
//ui
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "../components/ui/checkbox";
import Modal from "../components/custom/Modal";
import UpdateSelectedList from "../layout/UpdateSelectedList";
//icons
import { TbManualGearbox } from "react-icons/tb";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { RiFunctionAddLine } from "react-icons/ri";
//props
import { VotersProps } from "../interface/data";
import { BarangayCoorSchema } from "../zod/data";
//tools
import { handleElements } from "../utils/element";
import { handleLevel } from "../utils/helper";
import { useDebounce } from "use-debounce";
import { Button } from "../components/ui/button";

type BarangayCoorFormProps = z.infer<typeof BarangayCoorSchema>;

const UpdateOption = () => {
  const [params, setParams] = useSearchParams({ option: "manual" });
  const currentParams = params.get("option") || "manual";

  const handleSelectOption = (value: string) => {
    setParams(
      (prev) => {
        prev.set("option", value);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  return (
    <div className="w-full h-auto ">
      <div className="w-full">
        <Tabs
          defaultValue={currentParams}
          onValueChange={(value) => handleSelectOption(value)}
        >
          <TabsList>
            <TabsTrigger value="manual" className="flex gap-2">
              <TbManualGearbox /> Manually
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex gap-2">
              <MdOutlineDocumentScanner /> Scan
            </TabsTrigger>
            <TabsTrigger value="list" className="flex gap-2">
              <CiBoxList /> Selected List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="w-full h-full">
            <Manually />
          </TabsContent>
          <TabsContent value="scan">
            <h1>Can</h1>
          </TabsContent>
          <TabsContent className="w-full max-h-max" value="list">
            <UpdateSelectedList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UpdateOption;

const Manually = () => {
  const [onOpenModal, setOnOpenModal] = useState<number>(0);
  const [select, setSelect] = useState<
    { fullname: string; id: string } | undefined
  >(undefined);
  const [selectList, setSelectedList] = useState<string[]>([]);
  const [onMultiSelect, setOnMultiSelect] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<string>("");

  const [searchVoter, { data, loading, refetch }] = useLazyQuery<{
    searchVoter: VotersProps[];
  }>(SEARCH_VOTER, {
    fetchPolicy: "cache-and-network",
  });
  const [value] = useDebounce(searchParams, 1000);
  const LIMIT = 10;

  //const [setVoterLevel] = useMutation(SET_VOTER_LEVEL);

  // const handleSetVoterLevel = async (level: number) => {
  //   const response = await setVoterLevel({
  //     variables: {
  //       id: select,
  //       level,
  //     },
  //   });
  //   if (response.errors) {
  //     toast("Voter already selected", {
  //       description: "Go to the 'Selected List'",
  //       closeButton: false,
  //       className: " bg-white font-semibold text-red-500",
  //     });
  //     return;
  //   }
  //   toast("Update success", {
  //     description: "You can now assign team ",
  //     closeButton: false,
  //     className: " bg-white",
  //   });
  //   setOnOpenModal(0);
  //   await refetch({
  //     query: value.trim(),
  //     skip: (page - 1) * LIMIT,
  //     take: LIMIT,
  //   });
  // };

  useEffect(() => {
    const fetchVoters = async () => {
      const response = await searchVoter({
        variables: {
          query: value.trim(),
          skip: (page - 1) * LIMIT,
          take: LIMIT,
        },
      });

      if (response.error) {
        toast("Something went wrong.");
      }
    };
    if (value.trim() !== "") {
      fetchVoters();
    }
  }, [page, value]);
  

  const handleSelect = () => {
    if (!select) {
      toast("Select a voter");
      return;
    }
    const selectedList: { fullname: string; id: string }[] = JSON.parse(
      localStorage.getItem("selectedList") || "[]"
    );
    const matchedIndex = selectedList.findIndex((item) => item === select);
    if (matchedIndex !== -1) {
      toast("Voter already selected", {
        description: "Go to the 'Selected List'",
        closeButton: false,
        className: " bg-white text-red-500",
      });
      return;
    }
    selectedList.push(select);
    setOnOpenModal(0);
    setSelect(undefined);
    toast("Voter selected", {
      description: "Go to the 'Selected List'",
      className: " bg-white",
      closeButton: false,
    });
    localStorage.setItem("selectedList", JSON.stringify(selectedList));
  };

  const handleSelectVoter = (fullname: string, id: string) => {
    setOnOpenModal(1);
    setSelect({ fullname, id });
  };

  const handleCheckVoter = (id: string, checked: boolean) => {
    let listCopy = [...selectList];
    const matchedIndex = listCopy.findIndex((item) => item === id);

    if (checked && matchedIndex === -1) {
      listCopy.push(id);
    } else if (!checked && matchedIndex !== -1) {
      listCopy = listCopy.filter((item) => item !== id);
    }

    setSelectedList(listCopy);
  };

  const handleCheckValue = (id: string): boolean => {
    return selectList.includes(id);
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full flex gap-2 p-2">
        <Input
          onChange={(e) => setSearchParams(e.target.value)}
          className="bg-white focus:border-gray-700"
          placeholder="Search voter"
        />
        <Button
          onClick={() => {
            if (!data) {
              return;
            }
            if (!onMultiSelect) {
              setSelectedList([]);
            }
            setOnMultiSelect(!onMultiSelect);
          }}
          className="w-auto flex gap-2"
        >
          <RiCheckboxMultipleLine /> {onMultiSelect ? "Cancel" : "Multi-select"}
        </Button>
        {selectList.length > 0 && (
          <Button variant="outline">
            <RiFunctionAddLine />
          </Button>
        )}
      </div>
      {loading ? (
        <div>
          <h1>Loading</h1>
        </div>
      ) : (
        data && (
          <>
            <div className="w-full p-2">
              <h1 className="font-semibold text-gray-800">Page: {page}</h1>
            </div>
            <Table>
              <TableHeader>
                {onMultiSelect && <TableHead>Select</TableHead>}

                <TableHead>Lastname</TableHead>
                <TableHead>Firstname</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Municipal</TableHead>
                <TableHead>Barangay</TableHead>
                <TableHead>Purok</TableHead>
              </TableHeader>
              <TableBody>
                {data.searchVoter.map((item) => (
                  <TableRow
                    onClick={() => {
                      if (onMultiSelect) {
                        handleCheckVoter(item.id, handleCheckValue(item.id));
                        return;
                      }
                      handleSelectVoter(
                        `${item.lastname}, ${item.firstname}`,
                        item.id
                      );
                    }}
                    key={item.id}
                  >
                    {onMultiSelect && (
                      <TableCell>
                        {onMultiSelect && (
                          <TableCell>
                            <Checkbox
                              checked={handleCheckValue(item.id)}
                              onCheckedChange={(checked) =>
                                handleCheckVoter(item.id, checked as boolean)
                              }
                              onClick={(e) => {
                                if (onMultiSelect) {
                                  e.stopPropagation();
                                }
                              }}
                            />
                          </TableCell>
                        )}
                      </TableCell>
                    )}

                    <TableCell>
                      {handleElements(value, item.lastname)}{" "}
                    </TableCell>
                    <TableCell>
                      {handleElements(value, item.firstname)}
                    </TableCell>
                    <TableCell>{handleLevel(item.level)}</TableCell>
                    <TableCell>{item.gender}</TableCell>
                    <TableCell>{item.municipal.name}</TableCell>
                    <TableCell>{item.barangay.name}</TableCell>
                    <TableCell>{item.purok?.purokNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="w-full flex justify-center p-2 gap-2">
              <Button
                disabled={page === 1}
                className="mr-4"
                variant="secondary"
                onClick={() => {
                  if (page === 1) {
                    return;
                  }
                  setPage((prev) => Math.max(prev - 1, 0));
                }}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const count = page - 1;
                  setPage((prev) => {
                    prev - count;
                    return prev;
                  });
                }}
              >
                {page - 1}
              </Button>
              <Button
                className="border border-gray-500"
                variant="outline"
                onClick={() => {
                  setPage(page);
                }}
              >
                {page}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const count = page + 1;
                  setPage((prev) => {
                    prev + count;
                    return prev;
                  });
                }}
              >
                {page + 1}
              </Button>
              <Button
                className="ml-4"
                variant="secondary"
                disabled={data.searchVoter.length < 10}
                onClick={() => {
                  if (data.searchVoter.length < 10) {
                    return;
                  }
                  setPage((prev) => Math.max(prev + 1, 0));
                }}
              >
                Next
              </Button>
            </div>
          </>
        )
      )}

      <Modal
        className="max-w-xs"
        title="Action for this voter"
        open={onOpenModal === 1}
        onOpenChange={() => {
          setOnOpenModal(0);
          setSelect(undefined);
        }}
        children={
          <div className="flex flex-col gap-1">
            <Button variant="default" onClick={handleSelect}>
              Select
            </Button>
            <Button
              onClick={() => setOnOpenModal(2)}
              variant="outline"
              className="border border-gray-600"
            >
              Set as Barangay Coor
            </Button>
          </div>
        }
      />

      <Modal
        title={`Set ${select?.fullname} as Barangay Coor.`}
        open={onOpenModal === 2}
        children={
          <BarangayCoorForm refetch={refetch} select={select} setOnOpenModal={setOnOpenModal} />
        }
        className="max-w-xl"
        onOpenChange={() => {
          setSelect(undefined)
          setOnOpenModal(0);
        }}
      />
    </div>
  );
};

const BarangayCoorForm = ({
  setOnOpenModal,
  select,
  refetch
}: {
  setOnOpenModal: (value: React.SetStateAction<number>) => void;
  select:
    | {
        fullname: string;
        id: string;
      }
    | undefined;
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<{
      searchVoter: VotersProps[];
  }>>
}) => {
  const [setVoterLevel, { error }] = useMutation(SET_VOTER_LEVEL);
  const form = useForm<BarangayCoorFormProps>({
    resolver: zodResolver(BarangayCoorSchema),
  });
  const {
    handleSubmit,
    setError,
    register,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (value: BarangayCoorFormProps) => {
    if (select! == undefined) {
      return;
    }
    const response = await setVoterLevel({
      variables: {
        id: select.id,
        level: 3,
        code: value.code,
      },
    });
    
    if (response.data) {
      setOnOpenModal(0);
      refetch()
    }
  };

  useEffect(() => {
    console.log(error?.message);
    
    if (error) {
      setError("code", { message: error.message });
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form {...form}>
          <FormField
            name="purokNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Please type the code of candidate."
                    {...register("code", { required: true })}
                  />
                </FormControl>

                {errors.code && (
                  <FormMessage>{errors.code.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </Form>
        <div className="w-full flex justify-end p-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};
