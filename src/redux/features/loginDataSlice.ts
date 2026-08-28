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
            ...(payload.firstName !== undefined && {
              userFirstName: payload.firstName,
              firstName: payload.firstName,
            }),
            ...(payload.lastName !== undefined && {
              userLastName: payload.lastName,
              lastName: payload.lastName,
            }),
            ...(payload.profilePictureURL !== undefined && {
              profileImageURL: payload.profilePictureURL,
              profilePictureURL: payload.profilePictureURL,
            }),
          };

          try {
            const rawStored = localStorage.getItem("ennvision-admin:token");
            if (rawStored) {
              const parsed = JSON.parse(rawStored);
              parsed.userDetails = draft.data.userDetails;
              localStorage.setItem("ennvision-admin:token", JSON.stringify(parsed));
            }
            if (payload.profilePictureURL) {
              localStorage.setItem("user_profile_picture", payload.profilePictureURL);
            }
          } catch (e) {
            // quiet storage catch
          }
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
