import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  auth_token_key,
  oauth_signin_url,
  oauth_signup_url,
} from "../utils/api_urls";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../redux/store";
import { OauthApiValueTypes } from "../components/Common/OauthLogin/constants";
import { setLoginData } from "../redux/features/loginDataSlice";
import MessageModal from "../components/Common/MessageModal/MessageModal";
import { useDispatch } from "react-redux";

const useOauthLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toastId = useRef<any>(null);
  const dispatch = useDispatch();

  const {
    countryName: {
      results: { countryCode, name },
    },
  } = useAppSelector((state: RootState) => state.appData.data);
  const { result } = useAppSelector((state: RootState) => state.userLocation);

  // signin
  const handleSignin = async (values: OauthApiValueTypes) => {
    console.log(values, "social login");
    let payload = {
      authProvider: values.authProvider,
      accessToken: values.accessToken,
    };
    try {
      setError("");
      setLoading(true);
      const { data } = await axios.post(oauth_signin_url, payload);
      if (data.responseCode === "500") {
        toast(data.responseMessage, {
          type: "error",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }
      localStorage.setItem(auth_token_key, JSON.stringify(data.results));
      dispatch(setLoginData(data.results));
      toast(
        <MessageModal
          message="Login Successfully"
          description="You are successfully logged in to your account."
          type="success"
        />,
        {
          autoClose: 1000,
        }
      );
      setLoading(false);
      navigate("/school/create");
      // navigate("/register/create-new-password", {
      //   state: {
      //     resetPasswordToken: data.results.resetPasswordToken,
      //   },
      // });
      console.log({ data });
    } catch (error: any) {
      console.log({ error });
      setLoading(false);
      setError(error?.response?.data?.responseMessage || error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
      toastId.current = toast(
        error?.response?.data?.responseMessage || error.message,
        {
          type: "error",
          autoClose: 1000,
        }
      );
    }
  };

  // register
  const handleSignup = async (values: OauthApiValueTypes) => {
    console.log(values, "social signup");
    let payload = {
      authProvider: values.authProvider,
      accessToken: values.accessToken,
      address: result?.address || "",
      city: result?.city || "",
      state: result?.state || "",
      countryCode: countryCode,
      countryName: name,
      channel: "WEB",
    };
    try {
      setError("");
      setLoading(true);
      const { data } = await axios.post(oauth_signup_url, payload);
      if (data.responseCode === "500") {
        toast(data.responseMessage, {
          type: "error",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }
      toastId.current = toast(data.responseMessage, {
        type: "success",
        autoClose: 1000,
      });
      setLoading(false);
      navigate("/login");
      console.log({ data });
    } catch (error: any) {
      console.log({ error });
      setLoading(false);
      setError(error?.response?.data?.responseMessage || error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
      toastId.current = toast(
        error?.response?.data?.responseMessage || error.message,
        {
          type: "error",
          autoClose: 1000,
        }
      );
    }
  };
  return {
    loading,
    handleSignup,
    handleSignin,
    error,
  };
};

export default useOauthLogin;
