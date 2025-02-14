import { useState } from "react";
import { useForm } from "react-hook-form";

//layout
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  //FormMessage,
  FormLabel,
} from "../ui/form";
//props
import { UserProps } from "../../interface/data";
import { handleGetPurposeList, handleGetRole } from "../../utils/helper";
import { TableCell, TableRow } from "../ui/table";
import Modal from "../custom/Modal";
import { Input } from "../ui/input";
interface Props {
  item: UserProps;
  index: number;
}

interface UserFormProps
  extends Pick<UserProps, "username" | "password" | "uid"> {}

const UserItem = ({ item, index }: Props) => {
  const [onOpen, setOnOpen] = useState(0);

  const form = useForm<UserFormProps>({
    defaultValues: {
      username: item.username,
    },
  });
  const {
    //handleSubmit,
    register,
    //formState,
  } = form;
  return (
    <>
      <TableRow onClick={() => setOnOpen(2)} key={item.uid}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          {item.username}
          {item.forMunicipal}
        </TableCell>
        <TableCell>{handleGetPurposeList(item.purpose)}</TableCell>
        <TableCell>{handleGetRole(item.role)}</TableCell>
      </TableRow>

      <Modal
        className="max-w-md"
        open={onOpen === 2}
        onOpenChange={() => {
          setOnOpen(0);
        }}
      >
        <Form {...form}>
          <FormField
            name="username"
            render={() => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={item.username}
                    {...register("username")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={() => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input defaultValue={"*******"} {...register("password")} />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </Modal>
    </>
  );
};

export default UserItem;
