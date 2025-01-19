/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
//lib
import { useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
//ui
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import Modal from "../custom/Modal";
import Img from "../custom/Img";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
//props
import { MediaUrl, OptionProps } from "../../interface/data";
//mutation
import {
  DELETE_OPTION,
  UPDATE_OPTION_IMAGE,
  DELETE_OPTION_MEDIA,
  UPDATE_OPTION,
  UPDATE_OPTION_FORALL,
} from "../../GraphQL/Mutation";
import { GET_QUERIES } from "../../GraphQL/Queries";
//icon
import { CiImageOn } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { toast } from "sonner";
import { IoMdExit } from "react-icons/io";
import axios from "../../api/axios";

const OptionItem = ({ ...props }: OptionProps) => {
  const { queryID } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [onDelete, setOnDelete] = useState<string | null>(null);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [, setOnForAll] = useState<boolean>(false);

  const [optionContent, setOptionContent] = useState<string | "">(
    props.title && props.title
  );
  const [optionDesc, setOptionDesc] = useState<string | "">(
    props.desc && props.desc
  );

  const [deleteOption, { loading }] = useMutation(DELETE_OPTION, {
    refetchQueries: [GET_QUERIES],
    variables: { id: queryID },
  });

  const [updateOption, { loading: updateLoading }] = useMutation(
    UPDATE_OPTION,
    {
      refetchQueries: [GET_QUERIES],
      variables: { id: queryID },
    }
  );

  // const [updateOptionTop, { loading: updateOptionIsLoading }] =
  //   useMutation(UPDATE_OPTION_TOP);

  const handleDeleteOption = async () => {
    try {
      const data = await deleteOption({
        variables: {
          id: onDelete,
        },
      });
      if (data) {
        setOnDelete(null);
        toast("Option have been removed");
      }
    } catch (error) {
      toast("Failed to remove the option");
    }
  };

  const handleSelectedImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const [updateOptionImage] = useMutation(UPDATE_OPTION_IMAGE, {
    refetchQueries: [GET_QUERIES],
    variables: { id: queryID },
  });

  const [deleteOptionMedia, { loading: deleteMediaLoading }] = useMutation(
    DELETE_OPTION_MEDIA,
    {
      refetchQueries: [GET_QUERIES],
      variables: { id: queryID },
    }
  );

  const [optionForAll] = useMutation(UPDATE_OPTION_FORALL);

  const handleChangeImg = async () => {
    if (selectedImage === null) {
      toast("No image attached.");
      return;
    }

    setIsLoading(true);
    let imageUrl = "";
    try {
      const imageData = new FormData();
      imageData.append("file", selectedImage);
      const response = await axios.post<MediaUrl>("upload/image", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status !== 200) {
        toast("Failed to upload the image.");
        return;
      }

      imageUrl = response.data.url;
    } catch (error) {
      toast("Error uploading the image.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await updateOptionImage({
        variables: {
          image: {
            id: props.fileUrl.id,
            url: imageUrl,
            size: selectedImage.size.toString(),
            filename: selectedImage.name,
          },
        },
      });
      if (response.data) {
        setSelectedImage(null);
        toast("Image updated successfully.");
        return;
      }
      toast("Failed to update.");
    } catch (error) {
      toast("Unexpected error, unable to update.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMedia = async () => {
    try {
      const response = await deleteOptionMedia({
        variables: {
          option: {
            id: props.fileUrl.id,
            optionID: props.id,
          },
        },
      });
      if (response.data) {
        toast("Image removed successfully.");
        return;
      }
      toast("Failed to update.");
    } catch (error) {
      toast("Unexpected error, unable to remove.");
    }
  };

  const handleOptionUpdate = async () => {
    try {
      const response = await updateOption({
        variables: {
          option: {
            id: props.id,
            title: optionContent,
            desc: optionDesc,
          },
        },
      });
      if (response.data) {
        setOptionContent(props.title);
        setOptionDesc(props.desc);
        setOnEdit(false);
        toast("Option update successfully.");
        return;
      }
      toast("Failed to update.");
    } catch (error) {
      toast("Unexpected error, unable to update.");
    }
  };

  const handleChagneForAll = async (value: boolean) => {
    setOnForAll(value);
    try {
      const response = await optionForAll({
        variables: {
          id: props.id,
          value: value,
        },
      });

      if (response.data) {
        toast("Update Success!");
        return;
      }
    } catch (error) {
      toast("An error occurred.");
    }
  };

  return (
    <div className="w-full p-4 border border-slate-600 rounded">
      <div className="flex gap-2">
        <h1>{props.index}.</h1>
        {onEdit ? (
          <div className="w-full flex flex-col gap-2">
            <Input
              value={optionContent}
              onChange={(e) => setOptionContent(e.target.value)}
            />
            <Textarea
              value={optionDesc}
              onChange={(e) => setOptionDesc(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Switch
                defaultChecked={props.forAll}
                onCheckedChange={(value) => handleChagneForAll(value)}
                id="airplane-mode"
              />
              <Label htmlFor="airplane-mode">For all</Label>
            </div>
          </div>
        ) : (
          <h1 className="font-semibold">{props.title}</h1>
        )}
      </div>
      {props.desc && <div className="w-full">{props.desc}</div>}

      <div className="w-full flex gap-2 justify-between mt-2">
        <div>
          {props.onExit && (
            <div className="">
              <IoMdExit />
            </div>
          )}
        </div>

        <div className="w-auto flex gap-2">
          {props.fileUrl && (
            <Popover>
              <PopoverTrigger>
                <div className="w-auto p-1 border hover:border-gray-500 rounded cursor-pointer">
                  <CiImageOn />
                </div>
              </PopoverTrigger>

              <PopoverContent>
                <Img
                  src={
                    selectedImage !== null
                      ? URL.createObjectURL(selectedImage)
                      : props.fileUrl?.url
                  }
                  local={false}
                  name={props.fileUrl.filename}
                />
                <div className="">
                  <Input
                    accept=".jpeg, .jpg, .png"
                    onChange={handleSelectedImage}
                    type="file"
                    className="mb-3"
                    placeholder="Change image"
                  />

                  {selectedImage === null ? (
                    <Button onClick={handleRemoveMedia} className="w-full">
                      {deleteMediaLoading ? "Removing..." : "Remove"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setSelectedImage(null)}
                        className="w-full mb-2"
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={isLoading}
                        onClick={handleChangeImg}
                        className="w-full "
                      >
                        {isLoading ? "Updating..." : "Upadate"}
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
          {onEdit && !props.mediaUrlId && (
            <Input className="w-auto" type="file" />
          )}

          <div
            onClick={() => {
              setOnDelete(props.id);
            }}
            className="w-auto p-1 border hover:border-gray-500 rounded cursor-pointer"
          >
            <MdDeleteOutline />
          </div>

          <div
            onClick={() => {
              setOptionContent(props.title && props.title);
              setOnEdit(!onEdit);
            }}
            className="w-auto p-1 border hover:border-gray-500 rounded cursor-pointer"
          >
            <CiEdit />
          </div>

          {onEdit && (
            <Button
              onClick={handleOptionUpdate}
              disabled={
                (props.title === optionContent && props.desc === optionDesc) ||
                updateLoading
              }
              size="sm"
            >
              {updateLoading ? "Updating" : "Save"}
            </Button>
          )}
        </div>
      </div>
      <Modal
        title="Remove this option"
        className=" w-[90%] max-w-sm"
        footer={true}
        loading={loading}
        onFunction={handleDeleteOption}
        open={onDelete ? true : false}
        onOpenChange={() => setOnDelete(null)}
      />
    </div>
  );
};

export default OptionItem;
