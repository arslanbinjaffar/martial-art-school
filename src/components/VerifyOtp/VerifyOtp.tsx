import { Formik } from "formik";
import logo from "../../assets/icons/ic_logo.svg";
import CustomButton from "../../components/CustomButton/CustomButton";
import { ImgContainer, primaryColor } from "../../components/GlobalStyle";
import VerifyOtpStyle from "./style";
import * as Yup from "yup";
import FormControl from "../../components/FormControl";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { errorTypes } from "../../utils/types";
import axios from "axios";
import {
  authorizationToken,
  create_pro_verfiy_otp,
  useCaseBecomeProfessional,
  useCaseRegisteration,
  verify_otp_url,
} from "../../utils/api_urls";
import { toast } from "react-toastify";
import Head from "../../components/Head/Head";

type verifyOtpTypes = {
  otp: string;
};
const VerifyOtp = () => {
  // get Validations from redux appData
  const { validations } = useAppSelector((state) => state.appData.data);
  const [count, setCount] = useState(59);
  const otpToastId = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | errorTypes>(null);

  // login data
  const { data: loginData } = useAppSelector((state) => state.loginData);

  // counter for otp
  useEffect(() => {
    let interval: any;
    if (count > 0) {
      interval = setInterval(() => {
        setCount((count) => count - 1);
      }, 1000);
    } else {
      return;
    }
    return () => {
      clearInterval(interval);
    };
  }, [count]);

  // user validations
  const otpValidation = validations[21];
  // user regExpressions
  const otpRegex = new RegExp(otpValidation.pattern);

  const initialValues: verifyOtpTypes = {
    otp: "",
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required(otpValidation.notBlankMsgEn)
      .matches(otpRegex, otpValidation.pattern),
  });

  // register phone handler
  const handleSubmit = async (values: verifyOtpTypes) => {
    const phoneData = {
      otp: values.otp.toString(),
      phoneNumber: "",
      useCase: useCaseBecomeProfessional,
    };

    try {
      setLoading(true);
      const { data } = await axios.post(create_pro_verfiy_otp, phoneData, {
        headers: {
          ...authorizationToken(loginData!),
        },
      });
      if (data.responseCode === "500") {
        otpToastId.current = toast(data.responseMessage, {
          type: "error",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }
      setLoading(false);
      otpToastId.current = toast(data.responseMessage, {
        type: "success",
        autoClose: 1000,
      });
      setLoading(false);
      console.log({ data });
    } catch (error: any) {
      otpToastId.current = toast(error.response.data.responseMessage, {
        type: "error",
        autoClose: 1000,
      });
      setLoading(false);
      setError(error.responseMessage);
    }
  };

  return (
    <>
      <Head title="verify-otp" />
      <VerifyOtpStyle>
        <div className="inner-container">
          <ImgContainer src={logo} alt="logo" height="33px" width="164px" />
          <h6 className="title mb-0">Veriﬁcation codes OTP</h6>
          <p className="message">
            A verification codes has been sent to:
            <p className="number d-flex justify-content-center align-items-center mb-0"></p>
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form
                  name="basic"
                  onFinish={formik.handleSubmit}
                  autoComplete="off"
                >
                  <div className="login-input-fields-field mt-2">
                    <FormControl
                      control="input"
                      type="tel"
                      name="otp"
                      maxLength={4}
                      border="1px solid #EFEFF4"
                      placeholder="_ _ - _ _"
                      className={
                        formik.errors.otp && formik.touched.otp
                          ? "is-invalid text-center"
                          : "customPasswordInput text-center"
                      }
                    />
                    {/* <p className="resend-box-time d-flex justify-content-between align-items-center">
                      {count}s
                      <span>
                        <CustomButton
                          bgcolor="transparent"
                          color={primaryColor}
                          padding="4px 8px"
                          width="100%"
                          type="button"
                          title="RESEND"
                          margin="auto"
                          fontSize="14px"
                          fontFamily="EnnVisionsMedium"
                          border="none"
                          clicked={() => navigate("/generate-otp")}
                        />
                      </span>
                    </p> */}
                    <div className="mt-3">
                      <CustomButton
                        bgcolor={primaryColor}
                        color="white"
                        padding="8px 8px"
                        width="100%"
                        type="submit"
                        title="NEXT"
                        margin="auto"
                        fontSize="16px"
                        loading={loading}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </VerifyOtpStyle>
    </>
  );
};

export default VerifyOtp;
