import { useState, useEffect } from "react";
//ui
import Alert from "../components/custom/Alert";
import { Button } from "../components/ui/button";
import NewQuery from "../components/item/NewQuery";
import OptionItem from "../components/item/OptionItem";
import Modal from "../components/custom/Modal";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../components/ui/select";
//lib
import { useMutation, useQuery } from "@apollo/client";
//props
import { QueryProps } from "../interface/data";

//query
import { GET_QUERIES, GET_SELECTED_DRAFT_SURVEY } from "../GraphQL/Queries";

//mutation
import {
  REMOVE_QUERY,
  UPDATE_QUERY,
  UPDATE_QUERY_TYPE,
  UPDATE_QUERY_ACCESS,
  CREATE_CUSTOM_OPTION,
} from "../GraphQL/Mutation";
import { Input } from "../components/ui/input";
import { useParams } from "react-router-dom";

const Option = () => {
  const [onNew, setOnNew] = useState<boolean>(false);
  const [onOpen, setOnOpen] = useState(0);
  const [onRemove, setOnRemove] = useState<boolean>(false);
  const [onDelete, setOnDelete] = useState<string | null>(null);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [onTypeUpdate, setOnUpdateType] = useState<boolean>(false);
  const [newQuery, setNewQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("Single");
  const { queryID, surveyID } = useParams();

  const { data, loading, error, refetch } = useQuery<{ queries: QueryProps }>(
    GET_QUERIES,
    {
      variables: {
        id: queryID,
      },
    }
  );

  console.log(error);
  

  const [removeQuery, { loading: removeLoading }] = useMutation(REMOVE_QUERY, {
    refetchQueries: [GET_SELECTED_DRAFT_SURVEY],
    variables: { id: surveyID },
  });
  const [createCustomOption, { loading: creating, error: errroring }] =
    useMutation(CREATE_CUSTOM_OPTION);

  const [updateQuery] = useMutation(UPDATE_QUERY);
  const [updateQueryType, { loading: typeIsLoading }] =
    useMutation(UPDATE_QUERY_TYPE);
  const [updateQueryAccess, { loading: queryAccessLoading }] =
    useMutation(UPDATE_QUERY_ACCESS);

  const handleUpdateQueryType = async () => {
    try {
      const response = await updateQueryType({
        variables: {
          id: data?.queries.id,
          type: selectedType,
        },
      });
      if (response.data) {
        refetch();
        toast("Update successfully!");
        setOnUpdateType(false);
        return;
      }
    } catch (error) {
      toast("An errror occured!");
    }
  };

  const handleUpdateQueryAccess = async () => {
    if (!queryID) {
      toast("Required query id is missing!");
      return;
    }
    const response = await updateQueryAccess({
      variables: {
        id: queryID,
      },
    });

    if (response.data) {
      refetch();
      toast("Query access updated.");
    }
  };

  const handleRemoveQuery = async () => {
    if (!data) {
      toast("Required data unfound.");
      return;
    }
    try {
      const response = await removeQuery({
        variables: { id: data.queries.id },
      });

      if (response.data) {
        history.back();
        toast("Successfully removed.");
      }
    } catch (error) {
      toast("An errror occured.");
    }
  };

  const handleEditQuery = async () => {
    if (!data) {
      toast("Requried data not found!");
      return;
    }
    try {
      const response = await updateQuery({
        variables: {
          id: data?.queries.id,
          value: newQuery,
        },
      });
      if (response.data) {
        setOnEdit(false);
        refetch();
        toast("Successfully updated!");
      }
    } catch (error) {
      toast("An error occured.");
    }
  };

  useEffect(() => {
    setOnUpdateType(true);
  }, [selectedType]);

  const handleCreateOptions = async () => {
    if (!data) {
      toast("Invalid ID!");
      return;
    }
    const response = await createCustomOption({
      variables: {
        id: data.queries.id,
      },
    });
    if (errroring) {
      toast("Faild to craete new !");
      return;
    }
    if (response.data) {
      refetch();
      toast("Option created successfully!");
    }
  };

  if (!data || error) {
    return (
      <div className="w-full px-8">
        <Alert
          variant="destructive"
          title="An error occured"
          desc="Something went wrong, NO data found for this query."
        />
      </div>
    );
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full px-2">
        <div className="w-full flex justify-between gap-2 py-2">
          <div className="w-full flex items-center gap-2">
            <h1 className="font-semibold text-sm">Query:</h1>
            {onEdit ? (
              <div className="w-full flex gap-2 items-center">
                <Input
                  className="w-1/2"
                  defaultValue={data.queries.queries}
                  onChange={(e) => setNewQuery(e.target.value)}
                />
                <Button onClick={handleEditQuery} size="sm">
                  Save
                </Button>

                <Select
                  defaultValue={data.queries.type as string}
                  onValueChange={(value) => setSelectedType(value)}
                >
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleUpdateQueryAccess}
                  disabled={queryAccessLoading}
                >
                  {queryAccessLoading ? "Updating..." : data.queries.access}
                </Button>
              </div>
            ) : (
              <h1 className="font-semibold">{data.queries.queries}</h1>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setOnEdit(!onEdit)}
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
            <Button
              disabled={removeLoading}
              variant="destructive"
              size="sm"
              onClick={() => setOnRemove(true)}
            >
              Remove query
            </Button>
          </div>
        </div>

        <div className="w-full h-auto flex flex-col gap-2">
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            data.queries.options.map((item, index) => (
              <OptionItem {...item} index={index + 1} />
            ))
          )}
        </div>
        <div className="w-full mt-2 mb-2">
          {onNew ? (
            <NewQuery setOnNew={setOnNew} />
          ) : (
            <div className="w-full">
              <Button
                onClick={() => setOnNew(true)}
                size="sm"
                variant="default"
                className="w-full rounded"
              >
                New
              </Button>

              <Button
                onClick={() => setOnOpen(1)}
                size="sm"
                variant="default"
                className="w-full rounded mt-2"
              >
                New Option Input
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal
        open={onDelete ? true : false}
        onOpenChange={() => setOnDelete(null)}
      />

      <Modal
        onFunction={handleRemoveQuery}
        loading={removeLoading}
        open={onRemove}
        onOpenChange={() => {
          setOnRemove(false);
        }}
        title="Remove this query"
        className=" max-lg"
        footer={true}
        children={
          <div className="w-full h-auto">
            <h1 className="text-red-600">
              This action will remove this query permanently afterwards.
            </h1>
          </div>
        }
      />
      <Modal
        footer={true}
        title="Update query type?"
        open={onTypeUpdate}
        onOpenChange={() => {
          setOnUpdateType(false);
        }}
        loading={typeIsLoading}
        onFunction={handleUpdateQueryType}
      />

      <Modal
        title="Add new custom option."
        loading={creating}
        onFunction={handleCreateOptions}
        footer={true}
        open={onOpen === 1}
        onOpenChange={() => {
          if (creating) {
            return;
          }
          setOnOpen(0);
        }}
      />
    </div>
  );
};

export default Option;
