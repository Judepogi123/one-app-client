import React, { useState, useEffect } from "react";
import { useUserData } from "../provider/UserDataProvider";
//lib
import axios from "../api/axios";
import { useMutation } from "@apollo/client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { toast } from "sonner";
import Img from "../components/custom/Img";
import Modal from "../components/custom/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../components/ui/select";
//
import { UploadIDSchema } from "../zod/data";
//utils
import { cmToPx } from "../utils/helper";

//icons
import { MdOutlineQrCode2 } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
//
import { NEW_ID_TEMPLATE } from "../GraphQL/Mutation";

type UploadIDType = z.infer<typeof UploadIDSchema>;

const UploadID = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [onOpen, setOnOpen] = useState(0);
  const form = useForm<UploadIDType>({
    resolver: zodResolver(UploadIDSchema),
    defaultValues: {
      name: "",
      level: "1",
    },
  });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = form;

  const [uploadIdTemplate, { loading }] = useMutation(NEW_ID_TEMPLATE, {
    onError: (err) => {
      console.log(err);
    },
    onCompleted: () => {
      toast.success("Successfully uploaded", {
        closeButton: false,
      });
      setOnOpen(0);
    },
  });

  const user = useUserData();

  const onSubmit = async (data: UploadIDType) => {
    console.log({ data });

    try {
      const imageData = new FormData();
      imageData.append("file", data.file);
      const response = await axios.post("/upload/image", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let imageUri = "";
      if (response.status === 200) {
        console.log("Response: ", response.data);

        imageUri = response.data.url;
      } else {
        throw new Error(`${response.data}`);
      }
      console.log({ imageUri });

      await uploadIdTemplate({
        variables: {
          uri: imageUri,
          name: data.name,
          desc: data.desc,
          level: parseInt(data.level, 10),
          municipalsId: user?.forMunicipal ? user.forMunicipal : 4905,
        },
      });
      setPreviewImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // Set the file value in the form
      setValue("file", file);
    }
  };

  useEffect(() => {
    if (errors.name) {
      toast.error(errors.name.message, {
        closeButton: false,
      });
      return;
    }
    if (errors.file) {
      toast.error(errors.file.message, {
        closeButton: false,
      });
      return;
    }
    if (errors.level) {
      toast.error(errors.level.message, {
        closeButton: false,
      });
      return;
    }
  }, [errors]);

  return (
    <div className=" w-full h-full flex">
      {/*       
      <Form {...form}>
        <FormField
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                // Handle file selection
                const file = e.target.files?.[0];
                onChange(file);
              }}
            />
          )}
        />
      </Form> */}

      <div className=" w-2/3 h-full ">
        <div className=" w-full h-[10%] p-2">
          <Button onClick={() => setOnOpen(2)} size="sm" variant="outline">
            Properties
          </Button>
        </div>
        {previewImage ? (
          <div className=" w-full h-[90%] grid">
            <div className="m-auto">
              <span>Preview With Mock data</span>
            </div>
            <div
              className="m-auto"
              style={{
                width: cmToPx(8.62),
                height: cmToPx(10.48),
                position: "relative",
              }}
            >
              <Img
                width={cmToPx(8.62)}
                height={cmToPx(10.48)}
                src={previewImage}
                local={undefined}
                name={""}
              />
              <div
                style={{
                  position: "absolute",
                  top: "43%",
                  left: "105%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: "100%", // Ensures text stays centered if it wraps
                }}
              >
                <MdOutlineQrCode2 size={100} />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "75%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: "100%", // Ensures text stays centered if it wraps
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    width: "100%", // Ensures text stays centered if it wraps
                  }}
                >
                  <span className="font-bold text-xl">Member's Fullname</span>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    width: "100%", // Ensures text stays centered if it wraps
                  }}
                >
                  <span className="font-medium text">Barangay</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className=" w-full h-full grid">
            <span className=" m-auto">Select a Id template</span>
          </div>
        )}
      </div>

      <div className=" w-1/3 h-full flex flex-col justify-between border border-y-0 border-r-0">
        <div className="w-full flex p-2 items-center gap-2">
          {" "}
          <Form {...form}>
            <FormField
              name="file"
              render={({ field: { onBlur, onChange } }) => (
                <Input
                  type="file"
                  accept="image/*"
                  onBlur={onBlur}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file); // This updates the form state
                      handleImageChange(e); // This handles the preview
                    }
                  }}
                />
              )}
            />
          </Form>
          <Button
            className=" flex gap-2"
            size="sm"
            onClick={() => {
              if (!previewImage) {
                return toast.warning("Please select an image as template.", {
                  closeButton: false,
                });
              }
              setOnOpen(1);
            }}
          >
            <FaRegSave size={22} />
            Save
          </Button>
        </div>
        {previewImage && (
          <div className=" w-full h-full grid">
            <div className="m-auto">
              <span>Selected preview</span>
            </div>
            <Img
              className="m-auto"
              width={cmToPx(8.62)}
              height={cmToPx(10.48)}
              src={previewImage}
              local={undefined}
              name={""}
            />
          </div>
        )}
      </div>
      <Modal
        children={
          <span className=" font-normal text-lg">Save this template?</span>
        }
        className=" max-w-md"
        loading={isSubmitting || loading}
        onFunction={handleSubmit(onSubmit)}
        footer={true}
        open={onOpen === 1}
        onOpenChange={() => {
          if (isSubmitting || loading) return;
          setOnOpen(0);
        }}
      />

      <Modal
        children={
          <div className=" w-full">
            <Form {...form}>
              <FormField
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder="Template Title"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="desc"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder="Template Description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="level"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue="1"
                        value={value}
                        onValueChange={(e) => onChange(e)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">TL</SelectItem>
                          <SelectItem value="2">PC</SelectItem>
                          <SelectItem value="3">BC</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="front"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder="Template Description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>
          </div>
        }
        loading={isSubmitting || loading}
        onFunction={handleSubmit(onSubmit)}
        open={onOpen === 2}
        onOpenChange={() => {
          if (isSubmitting || loading) return;
          setOnOpen(0);
        }}
      />
    </div>
  );
};

export default UploadID;
