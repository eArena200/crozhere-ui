import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StationType } from "@/lib/types/station";
import { RootState } from "@/redux/store";
import { PaymentMode, PaymentStatus } from "@/lib/types/payment";
import {
    getPaymentDetailsApi,
    initPaymentApi,
    InitPaymentRequest,
    PaymentResponse,
    PaymentServiceException,
} from "@/api/payment/paymentApi";
import { BookingStep } from "@/lib/types/bookings";
import { 
    BookingDetailsResponse, 
    BookingIntentDetailsResponse, 
    BookingServiceException, 
    CreateClubBookingIntentRequest
 } from "@/api/booking/model";
import { 
    cancelBookingIntentForClubApi, 
    createClubBookingIntentApi, 
    getActiveIntentsForClubApi, 
    getClubBookingDetailsByIntentIdApi 
} from "@/api/booking/clubBookingApi";
import { 
    ClubBookingFlowState, 
    BookingSelectionMode, 
    BookingStation, 
    BookingTimeBasedSelectionState, 
    BookingStationBasedSelectionState, 
    BookingPlayerState
} from "./state";
import { getUTCDateTimeWithStepMins } from "@/lib/date-time-util";
import { StationDetailsResponse, ClubServiceException } from "@/api/club/model";
import { getStationsInClubApi } from "@/api/club/clubDetailsApi";


const initialState: ClubBookingFlowState = {
    clubId: null,
    clubStations: {
        clubStations: {},
        clubStationsLoading: false
    },
    activeIntentsState: {
        activeIntents: {},
        loading: false
    },
    currentStep: BookingStep.SELECTION,
    bookingPlayerState: {
        playerPhoneNumber: null
    },
    selectionState: {
        mode: BookingSelectionMode.TIME,
        supportedStationTypes: [],
        timeBased: {
            startTime: getUTCDateTimeWithStepMins(30),
            endTime: getUTCDateTimeWithStepMins(30, 1),
            availableStations: {},
            selectedStations: {}
        },
        stationBased: {
            selectedStations: {},
            bookingDuration: 1,
            stationOptions: {},
            searchWindow: {
                windowStartTime: getUTCDateTimeWithStepMins(30),
                windowHours: 1
            },
            availableSlots: [],
            selectedSlot: null
        },
        createNewBookingLoading: false
    },
    paymentState: {
        selectedPaymentMode: PaymentMode.CASH,
        paymentStatus: PaymentStatus.IDLE
    },
    confirmationState: {
        bookingDetailsLoading: false
    }
};

export const setClubIdAndFetchStations = createAsyncThunk<
    Record<number, StationDetailsResponse>,
    number,
    { rejectValue: ClubServiceException }
>(
    "clubBooking/setClubIdAndFetchStations",
    async (clubId, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setClubIdForBooking(clubId));
            const stations = await getStationsInClubApi(clubId);
            const stationTypes = Array.from(
                new Set(stations.map((s) => s.stationType))
            );
            dispatch(setSupportedStationTypes(stationTypes));

            const stationRecord: Record<number, StationDetailsResponse> = 
                Object.fromEntries(stations.map(s => [s.stationId, s]));
            return stationRecord;
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "SET_CLUBID_AND_FETCH_STATIONS",
                message: "Failed to fetch stations for club",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const fetchAndSetActiveIntents = createAsyncThunk<
    Record<number, BookingIntentDetailsResponse>,
    number,
    { 
        state: RootState
        rejectValue: BookingServiceException 
    }
>(
    "clubBooking/fetchAndSetActiveIntentsForClub",
    async (clubId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const authState = state.auth;

            if(!authState.loggedIn){
                return rejectWithValue({
                    error: "CLUB_BOOKING_THUNK_EXCEPTION",
                    type: "FETCH_AND_SET_ACTIVE_INTENTS_FOR_CLUB",
                    message: "User login is required for fetching active intents",
                    timestamp: new Date().toISOString(),
                });
            }

            let activeIntents: BookingIntentDetailsResponse[] = [];
            if(authState.user.role === 'PLAYER'){
                // TODO: Add fetch Active intents for player
            }

            if(authState.user.role === 'CLUB_ADMIN'){
                activeIntents = await getActiveIntentsForClubApi(clubId);
            }

            const activeIntentsRecord: Record<number, BookingIntentDetailsResponse> = 
                Object.fromEntries(activeIntents.map(aI => [aI.intentId, aI]));

            return activeIntentsRecord;
        } catch (err: any){
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "FETCH_AND_SET_ACTIVE_INTENTS_FOR_CLUB",
                message: "Failed to fetch active intents for club",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const createBookingIntent = createAsyncThunk<
    void,
    void,
    {
        state: RootState;
        rejectValue: BookingServiceException;
    }
>(
    "clubBooking/createBookingIntent",
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state: RootState = getState();
        const authState = state.auth;
        const clubId = state.clubBooking.clubId;
        const { 
            mode, 
            selectedStationType, 
            timeBased, 
            stationBased 
        } = state.clubBooking.selectionState;

        if(!authState.loggedIn){
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "CREATE_BOOKING_INTENT",
                message: "User login required for booking",
                timestamp: new Date().toISOString(),
            });
        }

        if (!clubId || !selectedStationType) {
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "CREATE_BOOKING_INTENT",
                message: "Missing club or stationType",
                timestamp: new Date().toISOString(),
            });
        }

        let startTime;
        let endTime;
        let stations: BookingStation[] = [];

        if(mode === BookingSelectionMode.TIME){
            startTime = timeBased.startTime;
            endTime = timeBased.endTime;
            stations = Object.values(timeBased.selectedStations);
        }
        
        if(mode === BookingSelectionMode.STATION){
            if(stationBased.selectedSlot){
                startTime = stationBased.selectedSlot
                endTime = getEndTimeForSlot(stationBased.selectedSlot, 
                    stationBased.bookingDuration);
                stations = Object.values(stationBased.selectedStations);
            }
        }

        if (!startTime || !endTime || stations.length === 0) {
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "CREATE_BOOKING_INTENT",
                message: "Missing booking details",
                timestamp: new Date().toISOString(),
            });
        }

        try {
            if(authState.user.role === 'PLAYER'){
                //TODO: Create Booking intent for player
            } 
            
            if(authState.user.role === 'CLUB_ADMIN'){
                const playerPhoneNumber = state.clubBooking.bookingPlayerState.playerPhoneNumber;
                if(playerPhoneNumber === null){
                    return rejectWithValue({
                        error: "CLUB_BOOKING_THUNK_EXCEPTION",
                        type: "CREATE_BOOKING_INTENT",
                        message: "Player phone number is required for booking",
                        timestamp: new Date().toISOString(),
                    });
                }

                const request: CreateClubBookingIntentRequest = {
                    clubId: clubId,
                    playerPhoneNumber: playerPhoneNumber,
                    stationType: selectedStationType,
                    stations: stations,
                    startTime: startTime,
                    endTime: endTime
                }

                const response = await createClubBookingIntentApi(request);
                await dispatch(setActiveIntentAndProceedToPayment(response));
            }

        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "CREATE_BOOKING_INTENT",
                message: "Failed to create booking-intent",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const setActiveIntentAndProceedToPayment = createAsyncThunk<
    void,
    BookingIntentDetailsResponse
>(
    'clubBooking/setActiveIntentAndProceedToPayment', 
    async (intent, { dispatch }) => {
        dispatch(setBookingIntent(intent));
        dispatch(setCurrentStep(BookingStep.PAYMENT));
    }
);

export const cancelBookingIntent = createAsyncThunk<
    number,
    {
        clubId: number,
        intentId: number
    },
    {
        state: RootState;
        rejectValue: BookingServiceException;
    }
>(
    "clubBooking/cancelBookingIntent",
    async ({clubId, intentId }, { getState, rejectWithValue }) => {
        const state = getState();
        const authState = state.auth;

        if(!authState.loggedIn){
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "CANCEL_BOOKING_INTENT",
                message: "User login required for cancellation",
                timestamp: new Date().toISOString(),
            });
        }

        try {
            cancelBookingIntentForClubApi(clubId, intentId);
            return intentId;
        } catch(err: any){
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }

            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "CANCEL_BOOKING_INTENT",
                message: "Cancel BookingIntent failed.",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const initiatePayment = createAsyncThunk<
    PaymentResponse,
    void,
    {
        state: RootState;
        rejectValue: PaymentServiceException;
    }
>(
    "clubBooking/initiatePayment",
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState();
        const intentId = state.clubBooking.paymentState.bookingIntent?.intentId;
        const amount = state.clubBooking.paymentState.bookingIntent?.intent.costDetails.totalCost;
        const paymentMode = state.clubBooking.paymentState.selectedPaymentMode;

        if (!intentId) {
            console.log("No Intent present for payment");
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "INITIATE_PAYMENT",
                message: "Booking intent is missing.",
                timestamp: new Date().toISOString(),
            });
        }

        if (amount === undefined) {
            console.log("No payment amount present for payment");
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "INITIATE_PAYMENT",
                message: "Booking amount is missing.",
                timestamp: new Date().toISOString(),
            });
        }

        try {
            const payRequest: InitPaymentRequest = {
                intentId: intentId,
                paymentMode: paymentMode,
                amount: amount,
            }
            const payResponse = await initPaymentApi(payRequest);

            if(payResponse.status === PaymentStatus.SUCCESS){
                await dispatch(fetchAndSetBookingDetails(intentId));
            }

            if(payResponse.status === PaymentStatus.PENDING){
                await dispatch(pollPaymentStatus({ 
                    paymentId: payResponse.paymentId 
                }));
            }

            return payResponse;
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }

            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "INITIATE_PAYMENT",
                message: "Payment failed.",
                timestamp: new Date().toISOString(),
            });
        }
    }
);

export const pollPaymentStatus = createAsyncThunk<
    PaymentResponse,
    { paymentId: number },
    {
        state: RootState;
        rejectValue: PaymentServiceException;
    }
>(
    "clubBooking/pollPaymentStatus",
    async ({ paymentId }, { dispatch, rejectWithValue }) => {
        const POLL_INTERVAL_MS = 3000;

        return new Promise<PaymentResponse>((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const response = await getPaymentDetailsApi(paymentId);

                    if (response.status === PaymentStatus.SUCCESS) {
                        clearInterval(intervalId);
                        dispatch(fetchAndSetBookingDetails(response.intentId));
                        resolve(response);
                    } else if (response.status === PaymentStatus.FAILED) {
                        clearInterval(intervalId);
                        reject(
                            rejectWithValue({
                                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                                type: "POLL_PAYMENT_STATUS",
                                message: "Payment failed.",
                                timestamp: new Date().toISOString(),
                            })
                        );
                    }
                } catch (error: any) {
                    clearInterval(intervalId);
                    reject(
                        rejectWithValue({
                            error: "CLUB_BOOKING_THUNK_EXCEPTION",
                            type: "POLL_PAYMENT_STATUS",
                            message: "Error checking payment status.",
                            timestamp: new Date().toISOString(),
                        })
                    );
                }
            }, POLL_INTERVAL_MS);
        });
    }
);


export const fetchAndSetBookingDetails = createAsyncThunk<
    BookingDetailsResponse | null,
    number,
    {
        state: RootState;
        rejectValue: BookingServiceException;
    }
>(
    "clubBooking/fetchAndSetBookingDetails",
    async (intentId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const authState = state.auth;

            if(!authState.loggedIn){
                return rejectWithValue({
                    error: "CLUB_BOOKING_THUNK_EXCEPTION",
                    type: "FETCH_BOOKING_DETAILS",
                    message: "User login is required to fetch booking",
                    timestamp: new Date().toISOString(),
                });
            }
            
            let booking = null;

            if(authState.user.role === 'PLAYER'){
                // TODO: Fetch Booking for player with intent
            }

            if(authState.user.role === 'CLUB_ADMIN'){
                const clubId = state.clubBooking.clubId;
                if(!clubId){
                    return rejectWithValue({
                        error: "CLUB_BOOKING_THUNK_EXCEPTION",
                        type: "FETCH_BOOKING_DETAILS",
                        message: "Failed to fetch booking details for club",
                        timestamp: new Date().toISOString(),
                    });
                }
                booking = await getClubBookingDetailsByIntentIdApi(clubId, intentId);
            }

            return booking;
        } catch (err: any) {
            if (err.response?.data) {
                return rejectWithValue(err.response.data);
            }
            return rejectWithValue({
                error: "CLUB_BOOKING_THUNK_EXCEPTION",
                type: "FETCH_BOOKING_DETAILS",
                message: "Failed to fetch booking details",
                timestamp: new Date().toISOString(),
            });
        }
    }
);


const createClubBookingSlice = createSlice({
    name: "clubBookingSlice",
    initialState,
    reducers: {
        setClubIdForBooking: (state, action: PayloadAction<number>) => {
            state.clubId = action.payload;
        },
        setSupportedStationTypes: (state, action: PayloadAction<StationType[]>) => {
            state.selectionState.supportedStationTypes = action.payload;
        },
        setBookingPlayerState: (state, action:PayloadAction<BookingPlayerState>) => {
            state.bookingPlayerState = action.payload;
        },
        setSelectedStationType: (state, action: PayloadAction<StationType | undefined>) => {
            state.selectionState.selectedStationType = action.payload;
        },
        setBookingMode: (state, action: PayloadAction<BookingSelectionMode>) => {
            state.selectionState.mode = action.payload;
        },
        setTimeBasedState: (state, action: PayloadAction<BookingTimeBasedSelectionState>) => {
            state.selectionState.timeBased = action.payload;
        },
        setStationBasedState: (state, action: PayloadAction<BookingStationBasedSelectionState>) => {
            state.selectionState.stationBased = action.payload;
        },
        setBookingIntent: (state, action: PayloadAction<BookingIntentDetailsResponse>) => {
            state.paymentState.bookingIntent = action.payload;
        },
        setSelectedPaymentMode: (state, action: PayloadAction<PaymentMode>) => {
            state.paymentState.selectedPaymentMode = action.payload;
        },
        setBookingDetails: (state, action: PayloadAction<BookingDetailsResponse>) => {
            state.confirmationState.bookingDetails = action.payload;
        },
        setCurrentStep: (state, action: PayloadAction<BookingStep>) => {
            state.currentStep = action.payload;
        },
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(setClubIdAndFetchStations.pending, (state) => {
            state.clubStations.clubStationsLoading = true;
        })
        .addCase(setClubIdAndFetchStations.fulfilled, (state, action) => {
            state.clubStations.clubStationsLoading = false;
            state.clubStations.clubStations = action.payload;
        })
        .addCase(setClubIdAndFetchStations.rejected, (state, action) => {
            state.clubStations.clubStationsLoading = false;
            state.clubStations.clubStationsError = action.payload?.message;
        })

        .addCase(fetchAndSetActiveIntents.pending, (state) => {
            state.activeIntentsState.loading = true;
        })
        .addCase(fetchAndSetActiveIntents.fulfilled, (state, action) => {
            state.activeIntentsState.loading = false;
            state.activeIntentsState.activeIntents = action.payload;
        })
        .addCase(fetchAndSetActiveIntents.rejected, (state, action) => {
            state.activeIntentsState.loading = false;
            state.activeIntentsState.error = action.payload?.message;
        })

        .addCase(createBookingIntent.pending, (state) => {
            state.selectionState.createNewBookingLoading = true;
        })
        .addCase(createBookingIntent.fulfilled, (state) => {
            state.selectionState.createNewBookingLoading = false;
        })
        .addCase(createBookingIntent.rejected, (state, action) => {
            state.selectionState.createNewBookingLoading = false;
            state.selectionState.createNewBookingError = action.payload?.message;
        })

        .addCase(cancelBookingIntent.fulfilled, (state, action) => {
            const cancelledIntentId = action.payload;
            delete state.activeIntentsState.activeIntents[cancelledIntentId];
        })

        .addCase(initiatePayment.pending, (state) => {
            state.paymentState.paymentStatus = PaymentStatus.PENDING;
        })
        .addCase(initiatePayment.fulfilled, (state, action) => {
            state.paymentState.paymentStatus = action.payload.status;
            if(action.payload.status === PaymentStatus.SUCCESS){
                state.confirmationState.paymentDetails = action.payload;
                state.currentStep = BookingStep.COMMIT;
            }
        })
        .addCase(initiatePayment.rejected, (state, action) => {
            state.paymentState.paymentStatus = PaymentStatus.FAILED;
            state.paymentState.paymentError = action.payload?.message;
        })


        .addCase(pollPaymentStatus.pending, (state) => {
            state.paymentState.paymentStatus = PaymentStatus.PENDING;
        })
        .addCase(pollPaymentStatus.fulfilled, (state, action) => {
            state.paymentState.paymentStatus = PaymentStatus.SUCCESS;
            state.confirmationState.paymentDetails = action.payload;
            state.currentStep = BookingStep.COMMIT;
        })
        .addCase(pollPaymentStatus.rejected, (state, action) => {
            state.paymentState.paymentStatus = PaymentStatus.FAILED;
            state.paymentState.paymentError = action.payload?.message;
        })

        .addCase(fetchAndSetBookingDetails.pending, (state) => {
            state.confirmationState.bookingDetailsLoading = true;
        })
        .addCase(fetchAndSetBookingDetails.fulfilled, (state, action) => {
            state.confirmationState.bookingDetailsLoading = false;
            if(action.payload){
                state.confirmationState.bookingDetails = action.payload;
            }
        })
        .addCase(fetchAndSetBookingDetails.rejected, (state, action) => {
            state.confirmationState.bookingDetailsLoading = false;
            state.confirmationState.bookingDetailsError = action.payload?.message;
        })

    }
});

export const {
    setClubIdForBooking,
    setSupportedStationTypes,
    setBookingPlayerState,
    setSelectedStationType,
    setBookingMode,
    setTimeBasedState,
    setStationBasedState,
    setBookingIntent,
    setSelectedPaymentMode,
    setBookingDetails,
    setCurrentStep,
    resetState
} = createClubBookingSlice.actions;

function getEndTimeForSlot(startTime: string, durationHrs: number): string {
    const start = new Date(startTime);
    const durationMs = durationHrs * 60 * 60 * 1000;
    const end = new Date(start.getTime() + durationMs);
    return end.toISOString();
}

export const selectBookingState = (state: RootState) => state.clubBooking;
export const selectActiveIntents = (state: RootState) => state.clubBooking.activeIntentsState.activeIntents;
export const selectBookingPlayerState = (state: RootState) => state.clubBooking.bookingPlayerState;
export const selectSelectionState = (state: RootState) => state.clubBooking.selectionState;
export const selectTimeBasedSelectionState = (state: RootState) => state.clubBooking.selectionState.timeBased;
export const selectStationBasedSelectionState = (state: RootState) => state.clubBooking.selectionState.stationBased;
export const selectBookingMode = (state: RootState) => state.clubBooking.selectionState.mode;
export const selectSupportedStationTypes = (state: RootState) => state.clubBooking.selectionState.supportedStationTypes;
export const selectClubStations = (state: RootState) => state.clubBooking.clubStations.clubStations;
export const selectSelectedStationType = (state: RootState) => state.clubBooking.selectionState.selectedStationType;
export const selectPaymentState = (state: RootState) => state.clubBooking.paymentState;
export const selectConfirmationState = (state: RootState) => state.clubBooking.confirmationState;

export default createClubBookingSlice.reducer;
