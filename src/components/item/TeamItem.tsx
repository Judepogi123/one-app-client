//prosp
import { TeamProps } from "../../interface/data";
import { toast } from "sonner";
//
interface Props {
  team: TeamProps;
  handleCheckId: (id: string) => boolean;
  handleSelectIds: (id: string) => void;
  index: number;
  page: number;
  userID: string | undefined;
}
const TeamItem = ({
  team,
  handleCheckId,
  handleSelectIds,
  index,
  page,
  userID,
}: Props) => {
  return (
    <div
      onClick={() => {
        if (team?.AccountHandleTeam?.account?.uid && team.AccountHandleTeam.account.uid === userID) {
          toast.warning("Already assinged to user!",{
            closeButton: false,
          });
          return;
        }
        if(team.AccountHandleTeam){
          toast.warning("Cannot assign team to this voter!",{
            closeButton: false,
          });
          return
        }
        handleSelectIds(team.id);
      }}
      className={`w-full p-2 border rounded-sm cursor-pointer hover:bg-gray-200  ${
        handleCheckId(team.id) ? "bg-slate-200" : "bg-white"
      }`}
    >
      {team.AccountHandleTeam?.account && (
        <h1 className="text-orange-500 italic text-sm">
          Already assigned to:{" "}
          {team.AccountHandleTeam.account.uid === userID
            ? "This user"
            : team.AccountHandleTeam.account?.username}
        </h1>
      )}
      <h1 className=" font-medium">
        {(page - 1) * 50 + index + 1}. {team.teamLeader?.voter?.lastname},{" "}
        {team.teamLeader?.voter?.firstname}
      </h1>
      <h1 className="text-xs font-thin">Members: {team._count.voters}</h1>
      <h1 className="font-thin text-sm">
        {team.barangay.name}, {team.municipal.name}
      </h1>
    </div>
  );
};

export default TeamItem;
