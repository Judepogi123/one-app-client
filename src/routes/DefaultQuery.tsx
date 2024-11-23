import { useState } from "react";

//lib
import { useQuery, useMutation } from "@apollo/client";

// UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

//quieries
import { GET_AGE, GET_GENDER } from "../GraphQL/Queries";
import {
  CREATE_AGE,
  CREATE_GENDER,
  DELETE_AGE,
  DELETE_GENDER,
  UPDATE_AGE,
  UPDATE_GENDER,
} from "../GraphQL/Mutation";
import { toast } from "sonner";
import Modal from "../components/custom/Modal";
const DefaultQuery = () => {
  const [onAdd, setOnAdd] = useState<{ type: string } | null>(null);
  const [value, setValue] = useState<string>("");
  const [onUpdate, setOnUpdate] = useState<{
    id: string | null;
    name: string | null;
    value: string;
    type: string;
  } | null>(null);

  const {
    data: ageList,
    loading: ageIsLoading,
    refetch: refetchAge,
  } = useQuery<{
    ageList: { id: string; segment: string }[];
  }>(GET_AGE);

  const {
    data: genderList,
    refetch: refetchGender,
  } = useQuery<{
    genderList: { id: string; name: string }[];
  }>(GET_GENDER);

  const [createAge, { loading: newAgeLoading }] = useMutation(CREATE_AGE);
  const [createGender, { loading: newGenderLoading }] =
    useMutation(CREATE_GENDER);

  const handleCreateAge = async () => {
    if (!value) {
      return;
    }
    try {
      const response = await createAge({
        variables: {
          age: value,
        },
      });

      if (response.data) {
        refetchAge();
        setOnAdd(null);
        return;
      }
      toast("Failed to add new age segment!");
    } catch (error) {
      toast(
        "An error occured. Something went wrong, please contact the developer."
      );
    }
  };

  const handleCreateGender = async () => {
    if (!value) {
      return;
    }
    try {
      const response = await createGender({
        variables: {
          gender: value,
        },
      });

      if (response.data) {
        refetchGender();
        setOnAdd(null);
        return;
      }
      toast("Failed to add new age segment!");
    } catch (error) {
      toast(
        "An error occured. Something went wrong, please contact the developer."
      );
    }
  };

  if (ageIsLoading) {
    return;
  }
  return (
    <div className="w-full h-auto flex">
      <div className="w-1/2 h-full border border-black border-l-0 border-t-0 border-b-0 p-2">
        <div className="w-full p-2 flex justify-between">
          <h1 className="text-lg font-semibold">Age Bracket</h1>
          <Button onClick={() => setOnAdd({ type: "age" })}>Add</Button>
        </div>
        <Table>
          <TableHeader>
            <TableHead>Segmets</TableHead>
          </TableHeader>
          <TableBody>
            {ageList?.ageList.length === 0 ? (
              <TableRow>No age segment yet</TableRow>
            ) : (
              ageList?.ageList.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() =>
                    setOnUpdate({
                      id: item.id,
                      value: "",
                      type: "age",
                      name: item.segment,
                    })
                  }
                  className="cursor-pointer"
                >
                  <TableCell>{item.segment}</TableCell>
                </TableRow>
              ))
            )}
            {onAdd !== null && onAdd.type === "age" && (
              <TableRow className="p-2">
                <TableCell>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="New age segment"
                  />
                  <div className="w-auto flex gap-2 justify-end py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={newAgeLoading}
                      onClick={() => setOnAdd(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={newAgeLoading}
                      onClick={handleCreateAge}
                      size="sm"
                    >
                      {newAgeLoading ? "saving..." : "Save"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-1/2 h-auto p-2">
        <div className="w-full p-2 flex justify-between">
          <h1 className="text-lg font-semibold">Gender</h1>
          <Button onClick={() => setOnAdd({ type: "gender" })}>Add</Button>
        </div>
        <Table>
          <TableHeader>
            <TableHead>Segments</TableHead>
          </TableHeader>
          <TableBody>
            {genderList?.genderList.length === 0 ? (
              <TableRow>No gender yet</TableRow>
            ) : (
              genderList?.genderList.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() =>
                    setOnUpdate({
                      id: item.id,
                      value: "",
                      type: "gender",
                      name: item.name,
                    })
                  }
                  className="cursor-pointer"
                >
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))
            )}
            {onAdd !== null && onAdd.type === "gender" && (
              <TableRow className="p-2">
                <TableCell>
                  <Input
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    placeholder="New gender"
                  />
                  <div className="w-auto flex gap-2 justify-end py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOnAdd(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateGender}
                      disabled={newGenderLoading}
                      size="sm"
                    >
                      {newGenderLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal
        title={`Update or delete ${onUpdate?.type}`}
        open={onUpdate !== null}
        onOpenChange={() => setOnUpdate(null)}
        children={<UpdateField setOnUpdate={setOnUpdate} onUpdate={onUpdate} />}
      />
    </div>
  );
};

export default DefaultQuery;

const UpdateField = ({
  onUpdate,
  setOnUpdate,
}: {
  onUpdate: {
    id: string | null;
    name: string | null;
    value: string;
    type: string;
  } | null;
  setOnUpdate: React.Dispatch<
    React.SetStateAction<{
      id: string | null;
      name: string | null;
      value: string;
      type: string;
    } | null>
  >;
}) => {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [deleteAge] = useMutation(DELETE_AGE, { refetchQueries: [GET_AGE] });
  const [deleteGender] = useMutation(DELETE_GENDER, {
    refetchQueries: [GET_GENDER],
  });

  const [updateAge] = useMutation(UPDATE_AGE, { refetchQueries: [GET_AGE] });
  const [updateGender] = useMutation(UPDATE_GENDER, {
    refetchQueries: [GET_GENDER],
  });

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (onUpdate?.type === "age") {
        const response = await deleteAge({
          variables: {
            id: onUpdate.id,
          },
        });
        if (response.data) {
          toast("Successfully removed!");
          setOnUpdate(null);
          return;
        }
        toast("Failed to remove.");
      } else if (onUpdate?.type === "gender") {
        const response = await deleteGender({
          variables: {
            id: onUpdate.id,
          },
        });
        if (response.data) {
          toast("Successfully removed!");
          setOnUpdate(null);
          return;
        }
        toast("Failed to remove.");
      }
    } catch (error) {
      toast("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!value) return;
    try {
      if (onUpdate?.type === "age") {
        const response = await updateAge({
          variables: {
            age: {
              id: onUpdate.id,
              value: value,
            },
          },
        });
        if (response.data) {
          toast("Successfully removed!");
          setOnUpdate(null);
          return;
        }
        toast("Failed to remove.");
      } else if (onUpdate?.type === "gender") {
        const response = await updateGender({
          variables: {
            gender: {
              id: onUpdate.id,
              value: value,
            },
          },
        });
        if (response.data) {
          toast("Successfully update!");
          setOnUpdate(null);
          return;
        }
        toast("Failed to update.");
      }
    } catch (error) {}
  };

  // Always render the component structure, but conditionally render the content
  return onUpdate ? (
    <div className=" w-full flex flex-col gap-4">
      <div className="w-full p-2">
        <h1 className="">Data</h1>
        <Input
          onChange={(e) => setValue(e.target.value)}
          defaultValue={onUpdate.name as string}
          placeholder={onUpdate.name as string}
        />
      </div>

      <div className="w-full flex relative justify-end gap-2">
        <Button
          onClick={handleDelete}
          disabled={isLoading}
          className="absolute left-0"
          variant="destructive"
        >
          Delete
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => setOnUpdate(null)}
          variant="outline"
        >
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  ) : null;
};
