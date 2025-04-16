import axios from "../api/axios";
//
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
//props
interface Props {
  id: string;
}
const PrintBarangayValidation = ({ id }: Props) => {
  const handlePrint = async () => {
    if (!id) {
      toast.warning("Required ID not found!", {
        closeButton: false,
      });
      return;
    }
    try {
      const response = await axios.post(
        "upload/barangay-validation-result",
        {
          barangayId: id,
        },
        {
          responseType: "blob", // Important for file downloads
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `barangay_validation_${id}.xlsx`;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: handlePrint,
    onError: (err) => {
      toast.error(`Failed to generate`, {
        closeButton: false,
        description: `Error: ${err}`,
      });
    },
  });
  return (
    <div className="w-full">
      <p className=" font-medium text-lg">Print</p>
      <div className="w-full p-4 flex justify-end">
        <Button disabled={isPending} onClick={() => mutateAsync()}>
          {isPending ? "Please wait" : "Start"}
        </Button>
      </div>
    </div>
  );
};

export default PrintBarangayValidation;
