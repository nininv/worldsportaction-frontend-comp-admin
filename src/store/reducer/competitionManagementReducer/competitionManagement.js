import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
};
function CompetitionManagementState(state = initialState, action) {

    switch (action.type) {
        ////Competition Dashboard Case
        case ApiConstants.API_COMPETITION_DASHBOARD_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_COMPETITION_DASHBOARD_SUCCESS:
            console.log(action.result, 'action.result')
            return {
                ...state,
                onLoad: false,
                result: action.result,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_DASHBOARD_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_DASHBOARD_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        ///get competition with time slot
        case ApiConstants.API_GET_COMPETITION_WITH_TIME_SLOTS_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_GET_COMPETITION_WITH_TIME_SLOTS_SUCCESS:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            }

        default:
            return state;
    }
}

export default CompetitionManagementState;
