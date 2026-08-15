import { createSlice } from "@reduxjs/toolkit";

const selectedMemberSlice = createSlice({
  name: "selectedMember",
  initialState: {
    member: null,
  },
  reducers: {
    setSelectedMember: (state, action) => {
      state.member = action.payload;
    },
    clearSelectedMember: (state) => {
      state.member = null;
    },
  },
});

export const { setSelectedMember, clearSelectedMember } =
  selectedMemberSlice.actions;

export const selectSelectedMember = (state) =>
  state.selectedMember.member;

export default selectedMemberSlice.reducer;
