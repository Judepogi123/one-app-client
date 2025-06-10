import { formatTimestamp } from "../../utils/date";

//
import { TableRow, TableCell } from "../ui/table";
//interface props
import { IdRecords } from "../../interface/data";

interface Props {
  item: IdRecords;
  number: number;
}

const RecordedID = ({ item, number }: Props) => {
  return (
    <TableRow className="  cursor-pointer">
      <TableCell>{number}</TableCell>
      <TableCell>
        <p>
          {item.voter.lastname}, {item.voter.firstname}
        </p>
      </TableCell>
      <TableCell>
        <p>{item.template.name}</p>
      </TableCell>
      <TableCell>dsadas</TableCell>
      <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
    </TableRow>
  );
};

export default RecordedID;
