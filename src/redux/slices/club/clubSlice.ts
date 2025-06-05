import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClubState {
    id?: number;
    clubAdminId?: number;
    clubLayoutId?: string;
    name?: string;
}

const initialState: ClubState = {

}

const clubSlice = createSlice({
    name: "club",
    initialState,
    reducers: {

    }
});


export const { } = clubSlice.actions;
export default clubSlice.reducer;