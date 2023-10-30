import axios from "axios";
import { useEffect, useState } from "react";

const usePostNoAuth = (url: string, postData: unknown) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>({});
  const [refetch, setRefetch] = useState(false); // Add refetch state

  // api data promise
  const apiDataPromise = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(url, postData);
      setData(data.results);
      console.log({ data });
      setLoading(false);
    } catch (error: any) {
      setError(error.response.data.responseMessage);
      setLoading(false);
      console.log(error.response.data.responseMessage, "error in api data");
    }
  };

  // Fetch data when refetch state changes
  useEffect(() => {
    apiDataPromise();
  }, [refetch]);

  // Function to trigger refetch
  const triggerRefetch = () => {
    setRefetch((prev) => !prev);
  };

  return {
    loading,
    data,
    error,
    refetch: triggerRefetch, // Provide the refetch function as part of the hook's return value
  };
};

export default usePostNoAuth;
