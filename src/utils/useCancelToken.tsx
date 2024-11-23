import axios, { CancelTokenSource } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useCancelToken = (url: string) => {
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);

  const fetchData = async () => {
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
     await axios.get(url, {
        cancelToken: source.token,
      });
      toast("Request canceled")
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  const cancelRequest = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Request canceled by user.");
    }
  };

  return { fetchData, cancelRequest };
};

export default useCancelToken;
