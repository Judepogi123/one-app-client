import React, { useState } from "react";
//lib
import { useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
//url
import axios from "../../api/axios";
//ui
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
//icon
import { MdOutlineDelete } from "react-icons/md";
//mutation
import { CREATE_OPTION } from "../../GraphQL/Mutation";
import { GET_QUERIES } from "../../GraphQL/Queries";
import { toast } from "sonner";
//props
import { MediaUrl } from "../../interface/data";
interface NewOptionProps {
  setOnNew: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewQuery = ({ setOnNew }: NewOptionProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [withImage, setWithImage] = useState<boolean>(false);
  const [withDesc, setWithDesc] = useState<boolean>(false);
  const [onExit, setOnExit] = useState<boolean>(false);
  const [onTop, setOnTop] = useState<boolean>(false);
  const [optionContent, setOptionContent] = useState<string>("");
  const [optionDesc, setOptionDesc] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customizable, setCustomizable] = useState(false);

  const { queryID, surveyID } = useParams();

  const [createOptionWithMedia] = useMutation(CREATE_OPTION, {
    refetchQueries: [GET_QUERIES],
    variables: { id: queryID },
  });

  const handleSelectedImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSaveOption = async () => {
    if (withImage && selectedImage === null) {
      toast("No image attached.");
      return;
    }
    if (!optionContent && !optionDesc) {
      toast("All fields are required!");
      return;
    }
    setIsLoading(true);
    let imageUrl = "";
    if (withImage && selectedImage) {
      const imageData = new FormData();
      imageData.append("file", selectedImage);
      try {
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
        return;
      }
    }

    try {
      const optionData = await createOptionWithMedia({
        variables: {
          media: withImage
            ? {
                filename: selectedImage?.name,
                size: selectedImage?.size.toString(),
                url: imageUrl,
                surveyId: surveyID,
              }
            : null,
          option: {
            title: optionContent,
            desc: optionDesc,
            queryId: queryID,
            onExit: onExit,
            onTop: onTop,
            customizable: customizable
          },
        },
      });

      if (optionData) {
        setIsLoading(false);
        toast("New option added.");
        setOptionContent("");
        setOptionDesc("");
        setOnNew(false);
      }
    } catch (error) {
      toast("Error creating the option.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border border-gray-500 rounded">
      <div className="w-full p-4">
        <Input
          placeholder="Type the option here"
          value={optionContent}
          onChange={(e) => setOptionContent(e.target.value)}
        />
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            checked={withDesc}
            onCheckedChange={() => setWithDesc(!withDesc)}
          />
          <span className="text-sm font-medium">With Short Description</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Checkbox checked={onTop} onCheckedChange={() => setOnTop(!onTop)} />
          <span className="text-sm font-medium">On Top</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            checked={onExit}
            onCheckedChange={() => setOnExit(!onExit)}
          />
          <span className="text-sm font-medium">
            On exit (Exit when respondent click this option)
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            checked={customizable}
            onCheckedChange={() => setCustomizable(!customizable)}
          />
          <span className="text-sm font-medium">Title Editable</span>
        </div>
        {withDesc && (
          <div className="">
            <Textarea
              placeholder="Type the short description here"
              value={optionDesc}
              onChange={(e) => setOptionDesc(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2 px-4">
        <Checkbox
          checked={withImage}
          onCheckedChange={() => setWithImage(!withImage)}
        />
        <span className="text-sm font-medium">With Image</span>
      </div>
      <div className="w-full p-2 flex justify-between gap-2">
        <div className="flex gap-2">
          {withImage && (
            <>
              <Input
                onChange={handleSelectedImage}
                accept=".jpeg, .jpg, .png, .gif, .bmp, .webp"
                className="w-auto"
                type="file"
              />

              <Button variant="destructive" size="sm">
                <MdOutlineDelete />
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={() => setOnNew(false)}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleSaveOption}>
            {isLoading ? "Please wait..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewQuery;
