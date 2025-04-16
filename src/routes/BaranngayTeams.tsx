//
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserData } from "../provider/UserDataProvider";
//queryie
import { GET_BARANGAY_TEAMLIST } from "../GraphQL/Queries";
import { BarangayProps, TeamProps } from "../interface/data";
//layout
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "../components/ui/table";
import Loading from "../components/custom/Loading";
import Modal from "../components/custom/Modal";
import PrintBarangayValidation from "../layout/PrintBarangayValidation";
import { Button } from "../components/ui/button";

//icons
import { MARK_TEAM_VERIFIED } from "../GraphQL/Mutation";
import { toast } from "sonner";
import { formatTimestamp } from "../utils/date";
import { IoPrintOutline } from "react-icons/io5";
const BaranngayTeams = () => {
  const { barangayID, userID } = useParams();
  const navigate = useNavigate();
  const user = useUserData();

  const [onOpen, setOnOpen] = useState(0);
  const [selected, setSelected] = useState<TeamProps | null>(null);

  const { data, loading } = useQuery<{ barangay: BarangayProps }>(
    GET_BARANGAY_TEAMLIST,
    {
      variables: {
        id: barangayID,
        level: 1,
      },
      skip: !barangayID,
    }
  );

  const handleOpenModal = (team: TeamProps) => {
    setSelected(team);
    setOnOpen(1);
  };

  const [markTeam, { loading: teamLoading }] = useMutation(MARK_TEAM_VERIFIED, {
    onCompleted: () => {
      toast.success(`Mark as validated`, {
        closeButton: false,
      });
      setOnOpen(0);
    },
    onError: (err: { message: any }) => {
      toast.error("Failed to mark as validated", {
        closeButton: false,
        description: err.message,
      });
      console.log(err);
    },
    refetchQueries: [
      {
        query: GET_BARANGAY_TEAMLIST,
        variables: {
          id: barangayID,
          level: 1,
        },
      },
    ],
  });
  const handleMarkTeam = async () => {
    if (!data?.barangay) {
      toast.warning("Data not found!", {
        closeButton: false,
      });
      return;
    }

    if (!selected) {
      toast.warning("Invalid selected team", {
        closeButton: false,
      });
      return;
    }

    await markTeam({
      variables: {
        teamId: selected.id,
        accountID: userID ?? user.uid,
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-auto">
      <div className="w-full flex justify-between p-2 border border-l-0 border-r-0 ">
        <h1 className="text-gray-800">
          {data && data.barangay?.name} - Team List
        </h1>

        <Button size="sm" onClick={() => setOnOpen(3)}>
          <IoPrintOutline size={18} />
        </Button>
      </div>
      <div className="w-full p-2 relative">
        <Table>
          <TableHeader className="bg-white sticky top-0 z-30">
            <TableHead>ID Number</TableHead>
            <TableHead>Team Leader</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Untracked Members</TableHead>
            <TableHead>Purok</TableHead>
            <TableHead>Date Validated</TableHead>
          </TableHeader>

          <TableBody>
            {data &&
              data.barangay.teams.map((team) => (
                <TableRow
                  key={team.id}
                  onClick={() => handleOpenModal(team)}
                  className=" cursor-pointer hover:bg-slate-200"
                >
                  <TableCell>{team.teamLeader?.voter?.idNumber}</TableCell>
                  <TableCell>
                    {team.teamLeader?.voter?.lastname},{" "}
                    {team.teamLeader?.voter?.firstname}
                  </TableCell>
                  <TableCell>{team._count.voters}</TableCell>
                  <TableCell>{team.untrackedCount}</TableCell>
                  <TableCell>
                    {" "}
                    {team.teamLeader?.voter?.purok?.purokNumber}
                  </TableCell>
                  <TableCell>
                    {team.AccountValidateTeam
                      ? formatTimestamp(
                          team.AccountValidateTeam.timstamp as string
                        )
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        className="max-w-sm"
        title={`${selected?.teamLeader?.voter?.lastname}, ${selected?.teamLeader?.voter?.firstname}`}
        children={
          <div className="w-full flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate(
                  `/manage/validation/${
                    selected?.AccountValidateTeam?.account?.uid ?? user.uid
                  }/${selected?.id}`
                )
              }
            >
              View Team
            </Button>
            <Button size="sm" onClick={() => setOnOpen(2)}>
              Mark as Validated
            </Button>
          </div>
        }
        open={onOpen === 1}
        onOpenChange={() => {
          setOnOpen(0);
        }}
      />

      <Modal
        onFunction={handleMarkTeam}
        footer={true}
        className="max-w-sm"
        title={`${selected?.teamLeader?.voter?.lastname}, ${selected?.teamLeader?.voter?.firstname}`}
        children={
          <div className="w-full flex flex-col gap-2">
            <h1 className="text-sm">
              Are you sure you want to "Mark as validated" this team leader?
            </h1>
            <h1 className="text-sm italic">
              This indicates that all validation procedure were perform
              accordingly
            </h1>
          </div>
        }
        loading={teamLoading}
        open={onOpen === 2}
        onOpenChange={() => {
          if (teamLoading) return;
          setOnOpen(0);
        }}
      />

      <Modal
        title="Print Result"
        children={<PrintBarangayValidation id={barangayID as string} />}
        open={onOpen === 3}
        onOpenChange={() => {
          setOnOpen(0);
        }}
      />
    </div>
  );
};

export default BaranngayTeams;
