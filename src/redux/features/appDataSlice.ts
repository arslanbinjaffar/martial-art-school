import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url, app_data_url } from "../../utils/api_urls";
import { appDataTypes } from "./types";

type appDataInitailValues = {
  data: appDataTypes;
  loading: boolean;
  error: string;
};

const defaultAppData: appDataTypes = {
  appTheme: {
    title: "#1B2559",
    subtitle: "#A3AED0",
    detail: "#2B3674",
    lightBorder: "#E0E5F2",
    darkBorder: "#2B3674",
    background: "#F4F7FE",
    primaryColor: "#4318FF",
    secondaryColor: "#6AD2FF",
    primaryButton: "#4318FF",
    secondaryButton: "#868CFF",
    cancelButton: "#FF5B5B",
    bookingButton: "#01B574",
    cancelStatus: "#EE5D50",
    activeStatus: "#01B574",
    pendingStatus: "#FFB547",
  },
  serverTimeZone: "UTC",
  countryName: {
    responseCode: 200,
    responseMessage: "Success",
    execTime: 0,
    errors: null,
    results: {
      id: 1,
      name: "United States",
      countryFlagURL: "https://flagcdn.com/w40/us.png",
      currency: "USD",
      currencySymbol: "$",
      currencySymbolBase64: "JA==",
      countryCode: "+1",
      phoneNumberLength: 10,
      examplePhoneNumber: "5551234567",
      status: true,
      iso2: "US",
    },
  },
  validations: [
    {
      key: "EMAIL_ADDRESS",
      pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
      notBlankMsgEn: "Email is required",
      notBlankMsgEs: "El correo es obligatorio",
      notBlankMsgPt: "O email é obrigatório",
      notBlankMsgAr: "البريد الإلكتروني مطلوب",
      notBlankMsgUr: "ای میل درکار ہے",
      patternMsgEn: "Invalid email address format",
      patternMsgEs: "Formato de correo no válido",
      patternMsgPt: "Formato de email inválido",
      patternMsgAr: "صيغة البريد الإلكتروني غير صحيحة",
      patternMsgUr: "ای میل کی درست فارمیٹ درج کریں",
    },
    {
      key: "PASSWORD",
      pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{6,}$",
      notBlankMsgEn: "Password is required",
      notBlankMsgEs: "La contraseña es obligatoria",
      notBlankMsgPt: "A senha é obrigatória",
      notBlankMsgAr: "كلمة المرور مطلوبة",
      notBlankMsgUr: "پاس ورڈ درکار ہے",
      patternMsgEn: "Password must be at least 6 characters with letters and numbers",
      patternMsgEs: "La contraseña debe tener al menos 6 caracteres",
      patternMsgPt: "A senha deve ter pelo menos 6 caracteres",
      patternMsgAr: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
      patternMsgUr: "پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے",
    },
    {
      key: "USER_FIRSTNAME",
      pattern: "^[a-zA-Z\\s]{2,50}$",
      notBlankMsgEn: "First name is required",
      notBlankMsgEs: "El nombre es obligatorio",
      notBlankMsgPt: "O primeiro nome é obrigatório",
      notBlankMsgAr: "الاسم الأول مطلوب",
      notBlankMsgUr: "پہلا نام درکار ہے",
      patternMsgEn: "First name must contain 2-50 alphabetic characters",
      patternMsgEs: "El nombre debe contener 2-50 letras",
      patternMsgPt: "O nome deve conter 2-50 letras",
      patternMsgAr: "يجب أن يحتوي الاسم على 2-50 حرفاً",
      patternMsgUr: "پہلے نام میں 2 سے 50 حروف ہونے چاہئیں",
    },
    {
      key: "USER_LASTNAME",
      pattern: "^[a-zA-Z\\s]{2,50}$",
      notBlankMsgEn: "Last name is required",
      notBlankMsgEs: "El apellido es obligatorio",
      notBlankMsgPt: "O sobrenome é obrigatório",
      notBlankMsgAr: "اسم العائلة مطلوب",
      notBlankMsgUr: "آخری نام درکار ہے",
      patternMsgEn: "Last name must contain 2-50 alphabetic characters",
      patternMsgEs: "El apellido debe contener 2-50 letras",
      patternMsgPt: "O sobrenome deve conter 2-50 letras",
      patternMsgAr: "يجب أن يحتوي اسم العائلة على 2-50 حرفاً",
      patternMsgUr: "آخری نام میں 2 سے 50 حروف ہونے چاہئیں",
    },
    {
      key: "PHONE_NUMBER",
      pattern: "^\\+?[1-9]\\d{1,14}$",
      notBlankMsgEn: "Phone number is required",
      notBlankMsgEs: "El número de teléfono es obligatorio",
      notBlankMsgPt: "O número de telefone é obrigatório",
      notBlankMsgAr: "رقم الهاتف مطلوب",
      notBlankMsgUr: "فون نمبر درکار ہے",
      patternMsgEn: "Please enter a valid phone number",
      patternMsgEs: "Ingrese un número válido",
      patternMsgPt: "Digite um número válido",
      patternMsgAr: "الرجاء إدخال رقم هاتف صحيح",
      patternMsgUr: "درست فون نمبر درج کریں",
    },
    {
      key: "BUSINESS_NAME",
      pattern: "^.{3,100}$",
      notBlankMsgEn: "School name is required",
      notBlankMsgEs: "El nombre es obligatorio",
      notBlankMsgPt: "O nome é obrigatório",
      notBlankMsgAr: "اسم المدرسة مطلوب",
      notBlankMsgUr: "اسکول کا نام درکار ہے",
      patternMsgEn: "School name must be between 3 and 100 characters",
      patternMsgEs: "El nombre debe tener entre 3 y 100 caracteres",
      patternMsgPt: "O nome deve ter entre 3 e 100 caracteres",
      patternMsgAr: "يجب أن يتراوح اسم المدرسة بين 3 و 100 حرف",
      patternMsgUr: "اسکول کا نام 3 سے 100 حروف کے درمیان ہونا چاہیے",
    },
    {
      key: "ADDRESS",
      pattern: "^.{5,255}$",
      notBlankMsgEn: "Address is required",
      notBlankMsgEs: "La dirección es obligatoria",
      notBlankMsgPt: "O endereço é obrigatório",
      notBlankMsgAr: "العنوان مطلوب",
      notBlankMsgUr: "پتہ درکار ہے",
      patternMsgEn: "Please enter a valid complete address",
      patternMsgEs: "Ingrese una dirección válida",
      patternMsgPt: "Digite um endereço válido",
      patternMsgAr: "الرجاء إدخال عنوان صحيح",
      patternMsgUr: "درست پتہ درج کریں",
    },
  ],
  statusData: {
    activities: [],
    facilities: [],
    language: [],
    currency: [],
    businessTypes: [],
  },
};

const initialState: appDataInitailValues = {
  data: defaultAppData,
  loading: false,
  error: "",
};

export const getAppData = createAsyncThunk(
  "user/AppData",
  async (country: string, thunkAPI) => {
    try {
      const { data } = await axios.post(base_url + app_data_url, {
        countryName: country,
      });
      data.results.statusData.activities.forEach((element: any) => {
        element.id = element.id.toString();
      });
      data.results.statusData.facilities.forEach((element: any) => {
        element.id = element.id.toString();
      });
      return data.results;
    } catch (error: any) {
      console.log({ error });
      thunkAPI.rejectWithValue("something went wrong");
    }
  }
);
const appDataSlice = createSlice({
  name: "user_appData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAppData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getAppData.fulfilled,
      (state, action: PayloadAction<appDataTypes>) => {
        state.loading = false;
        state.data = action.payload;
      }
    );
    builder.addCase(
      getAppData.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log(action.payload, "error in getAppData");
        state.error = action.payload;
      }
    );
  },
});
export default appDataSlice.reducer;
