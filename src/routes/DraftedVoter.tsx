/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
//ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import Modal from "../components/custom/Modal";
import { Button } from "../components/ui/button";
import EditPurok from "../layout/EditPurok";
import Alert from "../components/custom/Alert";
//lib
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useDebouncedCallback } from "use-debounce";
import z from "zod";
//queries
import {
  GET_DRAFT,
  GET_SLUGVOTERS,
  SEARCH_DRAFTED_VOTERS,
} from "../GraphQL/Queries";
//props
import { DraftSchema } from "../zod/data";
import { DraftedProps } from "../interface/data";
import {
  DISCARD_DRAFTED_VOTERE,
  SAVE_DRAFTED_VOTER,
} from "../GraphQL/Mutation";
import { toast } from "sonner";
type DraftType = z.infer<typeof DraftSchema>;

interface DraftReq {
  draftData: DraftType;
}

const DraftedVoter = ({ draftData }: DraftReq) => {
  const [onSearch, setOnSearch] = useState(false);
  const [onDiscard, setOnDiscard] = useState(false);
  const [onSave, setOnSave] = useState(false);
  const [onEditPurok, setOnEditPurok] = useState<boolean>(false);
  const [onError, setOnError] = useState<string | null>("");
  const [searchQuery, setSearchQuery] = useSearchParams({ query: "" });
  const { draftID } = useParams();

  const navigate = useNavigate();

  const currentQuery = searchQuery.get("query");

  if (!draftData) {
    return <h1>PLease wait</h1>;
  }

  const { data, error, loading, refetch } = useQuery<{
    draftedVoters: DraftedProps[];
  }>(GET_SLUGVOTERS, {
    variables: {
      voter: {
        barangaysId: draftData.barangay.id,
        municipalsId: draftData.municipal.id,
        draftID: draftID,
      },
    },
  });

  const [
    discardDraftedVoter,
    { loading: discarding, data: discarded, error: discardIsError },
  ] = useMutation(DISCARD_DRAFTED_VOTERE);

  const [saveDraftedVoter, { loading: saving, data: savedData }] = useMutation(
    SAVE_DRAFTED_VOTER,
    { refetchQueries: [{ query: GET_DRAFT }] }
  );

  const [searchVoters, { data: searchResult }] = useLazyQuery<{
    searchDraftVoter: DraftedProps[];
  }>(SEARCH_DRAFTED_VOTERS);

  const debounce = useDebouncedCallback((value) => {
    try {
      setSearchQuery(
        (prev) => {
          prev.set("query", value);
          return prev;
        },
        {
          replace: true,
        }
      );
      searchVoters({
        variables: {
          query: {
            barangaysId: draftData.barangay.id,
            draftID: draftID,
            params: value,
            municipalsId: draftData.municipal.id,
            saveStatus: "drafted",
          },
        },
      });
    } catch (error) {
      setOnError(`${error}`);
    }
  }, 500);

  if (error) {
    return (
      <Alert title="Sorry something went wrong" desc={`${error.message}`} />
    );
  }

  const handleViewVoterProfile = (id: string) => {
    if (!id) return;
    try {
      navigate(`/voter/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDiscardAllData = async () => {
    await discardDraftedVoter({
      variables: {
        id: draftID,
      },
    });
    if (discardIsError) {
      toast("Discard failed!", {
        description: "Something went wrong while executing action.",
      });
      return;
    }
    if (discarded) {
      refetch();
      toast("Discard success!");
      setOnDiscard(false);
    }
  };

  const handleSaveDraftedVoter = async () => {
    if(!draftID){
      toast("Draft ID not found.",{
        closeButton: false,
        description: "Try to refresh the page"
      })
      return
    }
    const response = await saveDraftedVoter({
      variables: {
        batchId: draftID
      },
    });
    if (response.errors) {
      toast("Save failed", {
        description: "Something went wrong",
      });
      return;
    }
    if (response.data) {
      toast("Save success!");
      navigate("/manage/draft")
    }
  };

  return (
    <div className=" w-full h-full">
      {onError && (
        <Alert title="Sorry something went wrong" desc={`${onError}`} />
      )}
      <div className="w-full flex justify-between border p-2 ">
        <div className=" w-1/4 h-10">
          <Input
            onChange={(e) => debounce(e.target.value)}
            placeholder="Search"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Button
            disabled={data && data.draftedVoters.length === 0}
            size="sm"
            variant="destructive"
            onClick={() => setOnDiscard(true)}
          >
            {discarding ? "Please wait..." : "Discard"}
          </Button>
          <Button
            onClick={() => setOnEditPurok(true)}
            variant="outline"
            size={"sm"}
          >
            Edit Purok
          </Button>
          <Button variant="outline" size={"sm"}>
            Properties
          </Button>
          <Button variant="default" size={"sm"} onClick={()=> setOnSave(true)}>
            Save
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="w-full py-4 text-center">
          <h1 className="text-lg">Please wait...</h1>
        </div>
      ) : (
        <Table>
          <TableHeader>
            {[
              "Lastname",
              "Firstname",
              "Gender",
              "Purok",
              "Age",
              "PWD",
              "IL",
              "INC",
              "OR",
              "SC",
              "18-30",
            ].map((item, index) => (
              <TableHead key={index}>{item}</TableHead>
            ))}
          </TableHeader>

          <TableBody>
            {currentQuery && searchResult ? (
              searchResult.searchDraftVoter.length > 0 ? (
                searchResult.searchDraftVoter.map((item, index) => (
                  <TableRow
                    onClick={() => handleViewVoterProfile(item.id)}
                    className=" cursor-pointer"
                    key={index}
                  >
                    <TableCell>{item.lastname}</TableCell>
                    <TableCell>{item.firstname}</TableCell>
                    <TableCell>{item.gender}</TableCell>
                    <TableCell
                      className={`${!item.inPurok ? "text-orange-600" : ""}`}
                    >
                      {item.purok.purokNumber}
                    </TableCell>
                    <TableCell>{item.calcAge || "Unknown"}</TableCell>
                    <TableCell>{item.pwd}</TableCell>
                    <TableCell>{item.illi}</TableCell>
                    <TableCell>{item.inc}</TableCell>
                    <TableCell>{item.oor}</TableCell>
                    <TableCell>{item.senior ? "YES" : "NO"}</TableCell>
                    <TableCell>{item.youth ? "YES" : "NO"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No search results found!
                  </TableCell>
                </TableRow>
              )
            ) : (
              data &&
              data.draftedVoters.map((item, index) => (
                <TableRow className=" cursor-pointer" key={index}>
                  <TableCell>{item.lastname}</TableCell>
                  <TableCell>{item.firstname}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell
                    className={`${!item.inPurok ? "text-orange-600" : ""}`}
                  >
                    {item.purok.purokNumber}
                  </TableCell>
                  <TableCell>{item.birthYear === "null"? "Unknown": item.birthYear}</TableCell>
                  <TableCell>{item.pwd}</TableCell>
                  <TableCell>{item.illi}</TableCell>
                  <TableCell>{item.inc}</TableCell>
                  <TableCell>{item.oor}</TableCell>
                  <TableCell>{item.senior ? "YES" : "NO"}</TableCell>
                  <TableCell>{item.youth ? "YES" : "NO"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      <Modal
        open={onSearch}
        onOpenChange={() => setOnSearch(false)}
        children={<div className="w-[1000px] "></div>}
      />
      <Modal
        open={onEditPurok}
        onOpenChange={() => setOnEditPurok(false)}
        className="w-[90%] max-w-2xl max-h-[600px] overflow-y-auto"
        children={
          <div className="">
            <EditPurok />
          </div>
        }
      />
      <Modal
        title="Discard drafted voters"
        open={onDiscard}
        loading={discarding}
        onFunction={handleDiscardAllData}
        footer={true}
        children={
          discarding && (
            <h1 className="text-red-500 text-lg font-medium">
              {"Please do not interupt, performing this action."}
            </h1>
          )
        }
        onOpenChange={() => {
          if (discarding) {
            return;
          }
          setOnDiscard(false);
        }}
      />

      <Modal
        title="Save drafted voters"
        children={
          saving ? (
            <h1>Saving, please wait...</h1>
          ) : (
            <h1>Are you sure you want to save this drafted voters.</h1>
          )
        }
        onFunction={handleSaveDraftedVoter}
        loading={saving}
        open={onSave}
        footer={true}
        onOpenChange={() => {
          if (saving) {
            return;
          }
          setOnSave(false);
        }}
      />
    </div>
  );
};

export default DraftedVoter;
