import produce from "immer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userDataTypes } from "./admin/user/updateUserStatusSlice";
import { loginDataTypes, professionalDetailTypes } from "./types";

type appDataTypes = {
  data: null | loginDataTypes;
  loading: boolean;
  error: any;
};

const initialState: appDataTypes = {
  data: {} as loginDataTypes,
  loading: false,
  error: "",
};

const loginDataSlice = createSlice({
  name: "user/loginData",
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<loginDataTypes>) => {
      state.data = action.payload;
    },
    removeLoginData: (state) => {
      state.data = null;
    },
    becomeProHandler: (
      state,
      { payload }: PayloadAction<professionalDetailTypes>
    ) => {
      console.log({ payload }, "payload");
      return produce(state, (draft) => {
        if (draft.data !== null) {
          draft.data.ProfessionalDetails = payload;
        }
      });
    },
    becomeUserHandler: (state) => {
      return produce(state, (draft) => {
        if (draft.data !== null) {
          draft.data.ProfessionalDetails = null;
        }
      });
    },
    updateUserHandler: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      return produce(state, (draft) => {
        if (draft.data !== null && draft.data.userDetails) {
          draft.data.userDetails = {
            ...draft.data.userDetails,
            ...(payload.firstName !== undefined && { userFirstName: payload.firstName }),
            ...(payload.lastName !== undefined && { userLastName: payload.lastName }),
            ...(payload.profilePictureURL !== undefined && {
              profileImageURL: payload.profilePictureURL,
              profilePictureURL: payload.profilePictureURL,
            }),
          };
        }
      });
    },
  },
});
export const {
  setLoginData,
  removeLoginData,
  becomeProHandler,
  becomeUserHandler,
  updateUserHandler,
} = loginDataSlice.actions;
export default loginDataSlice.reducer;
