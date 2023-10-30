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

export const validationFinder = (validationKey: string) => {
  return store
    .getState()
    .appData?.data?.validations?.find(({ key }) => key === validationKey);
};
