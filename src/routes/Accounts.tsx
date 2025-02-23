// import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useUserData } from "../provider/UserDataProvider";
//graphql
import { GET_USER_LIST } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";
//ui
import { Button } from "../components/ui/button";
import Modal from "../components/custom/Modal";
import {
  Table,
  TableBody,
  TableHead,
  // TableRow,
  // TableCell,
  TableHeader,
} from "../components/ui/table";
import UserItem from "../components/item/UserItem";
//interfaces
//import { NewAccountSchema } from "../zod/data";
import { useState } from "react";
import { UserProps } from "../interface/data";
import Loading from "../components/custom/Loading";
//layout
import NewAccountForm from "../layout/NewAccountForm";
//utils
// import { handleGetPurposeList, handleGetRole } from "../utils/helper";

// type NewAccountType = z.infer<typeof NewAccountSchema>;
const Accounts = () => {
  const user = useUserData();
  const [onOpen, setOnOpen] = useState(0);

  const { data, loading } = useQuery<{ userList: UserProps[] }>(GET_USER_LIST, {
    variables: {
      zipCode: user?.forMunicipal ?? null,
    },
  });

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2 flex justify-end border border-gray-400">
        <Button onClick={() => setOnOpen(1)} size="sm">
          Create
        </Button>
      </div>
      {loading ? (
        <div className="w-full h-full grid">
          <Loading />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Username</TableHead>
            <TableHead>For</TableHead>
            <TableHead>Role</TableHead>
          </TableHeader>
          <TableBody>
            {data?.userList?.map((user, index) => (
              <UserItem item={user} index={index} />
            ))}
          </TableBody>
        </Table>
      )}
      <Modal
        className="min-w-96"
        open={onOpen === 1}
        onOpenChange={() => {
          setOnOpen(0);
        }}
        children={<NewAccountForm />}
      />
    </div>
  );
};

export default Accounts;
