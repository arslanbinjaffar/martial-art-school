import store from "../redux/store";

// checking object is empty or not
export const objectNotEmpty = <T>(object: Record<string, any>) => {
  return Object.keys(object).length > 0 ? true : false;
};

/* truncate string method */
export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + "...";
}

// object to array utlity function

export function ObjectToArray(obj: Record<string, unknown>): unknown[] {
  return Object.values(obj).reduce((acc: unknown[], val: unknown) => {
    if (typeof val === "object" && val !== null) {
      return acc.concat(ObjectToArray(val as Record<string, unknown>));
    }
    return acc.concat(val);
  }, []);
}

// local decimal function

export const numberToLocalString = (price: number) => {
  const formattedNumber = price.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  const finalFormattedNumber = formattedNumber.includes(".")
    ? formattedNumber
    : `${formattedNumber}.0`;
  return finalFormattedNumber;
};

// validation finder
const DEFAULT_VALIDATION = {
  key: "DEFAULT",
  pattern: "^.*$",
  notBlankMsgEn: "This field is required",
  notBlankMsgEs: "Este campo es requerido",
  notBlankMsgPt: "Este campo é obrigatório",
  notBlankMsgAr: "هذا الحقل مطلوب",
  notBlankMsgUr: "یہ خانہ پر کرنا ضروری ہے",
  patternMsgEn: "Please enter a valid value",
  patternMsgEs: "Por favor ingrese un valor válido",
  patternMsgPt: "Por favor insira um valor válido",
  patternMsgAr: "الرجاء إدخال قيمة صحيحة",
  patternMsgUr: "درست معلومات درج کریں",
};

const DEFAULT_VALIDATION_MAP: Record<string, typeof DEFAULT_VALIDATION> = {
  EMAIL_ADDRESS: {
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
  PASSWORD: {
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
  USER_FIRSTNAME: {
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
  USER_LASTNAME: {
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
  PHONE_NUMBER: {
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
  BUSINESS_NAME: {
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
  ADDRESS: {
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
};

export const validationFinder = (validationKey: string) => {
  const found = store
    .getState()
    .appData?.data?.validations?.find(({ key }) => key === validationKey);
  return found || DEFAULT_VALIDATION_MAP[validationKey] || DEFAULT_VALIDATION;
};
