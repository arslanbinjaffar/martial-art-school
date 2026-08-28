import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ScreenTranslation } from "../redux/features/screenTranslationSlice";

const DEFAULT_FALLBACK_LABELS: Record<string, string> = {
  // Login
  title: "Welcome Back",
  subtitle: "Please enter your details to sign in",
  emailFieldTitle: "Email Address",
  emailFieldPlaceholder: "Enter your email address",
  passcodeFieldTitle: "Password",
  passcodeFieldPlaceholder: "Enter your password",
  rememberMe: "Remember Me",
  forgotPassword: "Forgot Password?",
  loginButton: "Sign In",
  or: "OR",
  google: "Google",
  facebook: "Facebook",
  apple: "Apple",
  microsoft: "Microsoft",
  discord: "Discord",
  legalNote: "By continuing, you agree to our Terms & Privacy Policy",
  register: "Don't have an account?",
  registerAccount: "Sign Up",

  // Register
  firstNameFieldTitle: "First Name",
  firstNameFieldPlaceholder: "Enter your first name",
  surNameFieldTitle: "Last Name",
  surNameFieldPlaceholder: "Enter your last name",
  mobileFieldTitle: "Phone Number",
  mobileFieldPlaceholder: "Enter phone number",
  confrimPasscodeFieldTitle: "Confirm Password",
  confrimPasscodeFieldPlaceholder: "Re-enter password",
  registerButton: "Create Account",
  login: "Already have an account?",

  // School, Branch & Franchise
  businessName: "School / Dojo Name",
  businessNamePlaceholder: "e.g. Cobra Martial Arts Academy",
  businessType: "School Category",
  businessTypePlaceholder: "Select category",
  address: "Address",
  addressPlaceholder: "Enter street address, city, state",
  businessPhoneNumber: "Phone Number",
  belts: "Belt Grading System",
  beltsPlaceholder: "Select Belt Grading System",
  defaultLanguage: "Primary Language",
  defaultCurrency: "Billing Currency",
  activity: "Martial Arts Disciplines",
  facilities: "Dojo Facilities",
  description: "Description",
  enterDescription: "Describe your martial arts philosophy, trainers, and classes",
  primaryButton: "Save & Continue",
  sumbitButton: "Submit",
  expireMessage: "OTP expired, please resend",
};

const formatKeyToLabel = (key: string): string => {
  if (DEFAULT_FALLBACK_LABELS[key]) return DEFAULT_FALLBACK_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const useScreenTranslation = (screenName: string) => {
  const { translations } = useSelector(
    (state: RootState) => state.translations
  );
  const { selectedLanguage } = useSelector(
    (state: RootState) => state.selectedLanguage
  );

  const [screenTranslation, setScreenTranslation] = useState<
    ScreenTranslation[]
  >([]);

  const getScreenData = () => {
    const screen = translations?.[screenName] || [];
    setScreenTranslation(screen);
  };

  const getLabelByKey = (key: string): string => {
    const item = screenTranslation.find((item) => item.labelKey === key);
    if (item) {
      const val = (item as any)?.[selectedLanguage] || item?.en;
      if (val && val.trim().length > 0) return val;
    }
    return formatKeyToLabel(key);
  };

  useEffect(() => {
    getScreenData();
  }, [screenName, translations]);

  return { screenTranslation, getLabelByKey };
};

export default useScreenTranslation;
