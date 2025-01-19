import { useState } from "react";
import { toast } from "sonner";
import axios from "../api/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
//layout
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "../components/ui/form";
//hooks
import { useForm } from "react-hook-form";

//props
const FormScheema = z.object({
  zipCode: z.string(),
  barangay: z.string(),
});

type FormProsp = z.infer<typeof FormScheema>;

const NewVoterListUpdate = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormProsp>({
    resolver: zodResolver(FormScheema),
  });
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = form;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };

  const handleFileupload = async (data: FormProsp) => {
    if (!selectedFile) {
      toast("Select JSON file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("zipCode", data.zipCode);
    formData.append("barangay", data.barangay);
    const response = await axios.post("upload/voter-list", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.status === 200 && response.data);
  };
  return (
    <div className="w-full p-2">
      <div className="w-full">
        <form action="">
          <Form {...form}>
            <FormField
              name="zipCode"
              render={() => (
                <FormItem>
                  <FormLabel>Municipal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...register("zipCode")}
                      placeholder="Municipal ZipCode"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="barangay"
              render={() => (
                <FormItem>
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...register("barangay")}
                      placeholder="Barangay number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </form>
        <h1 className=" font-medium text-base mb-4">
          Select JSON file to upload
        </h1>
        <Input type="file" onChange={handleFileChange} />
      </div>

      <div className="w-full p-2 flex gap-2 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit(handleFileupload)}
        >
          {isSubmitting ? "Loading..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
};

export default NewVoterListUpdate;
