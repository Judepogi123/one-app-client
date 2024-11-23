import React from "react";
//ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

//lib
import { useQuery } from "@apollo/client";

//queires
import { GET_SURVEYOR } from "../GraphQL/Queries";

//props
import { UserProps } from "../interface/data";

const Surveyor = () => {
  const { data, loading, error } = useQuery<{ users: UserProps[] }>(
    GET_SURVEYOR
  );

  if (!data) {
    return;
  }
  return (
    <div className="w-full h-auto">
      <Table>
        <TableHeader>
          <TableHead>Lastname</TableHead>
          <TableHead>First</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phonenumber</TableHead>
        </TableHeader>
        <TableBody>
          {data.users.length === 0 ? (
             <TableRow>
             <TableCell colSpan={9} className="text-center">
               No surveyor found!
             </TableCell>
           </TableRow>
          ) : (
            data.users.map((user) => (
              <TableRow>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Surveyor;
