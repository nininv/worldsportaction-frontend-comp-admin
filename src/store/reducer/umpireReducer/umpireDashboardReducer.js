import ApiConstants from "../../../themes/apiConstants";

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    umpireVenueList: [],
    onVenueLoad: false,
    umpireDivisionList: [],
    onDivisionLoad: false,
    umpireDashboardList: [],
    totalPages: null,
    umpireRoundList: []
};

function getHighestSequence(roundArr) {

    let sequence = []

    for (let i in roundArr) {
        sequence.push(roundArr[i].sequence)
    }

    return Math.max.apply(null, sequence);

}

// Remove duplicate rounds names 

function removeDuplicateValues(array) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((el) => (
            el["name"] === obj["name"]
        ))
    )

}

function umpireDashboardState(state = initialState, action) {
    switch (action.type) {
        //// Umpire Dashboard List
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                umpireDashboardList: action.result.results,
                totalPages: action.result.page.totalCount,
                status: action.status
            };
        //// Venue List
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_LOAD:
            return { ...state, onVenueLoad: true };
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_SUCCESS:
            return {
                ...state,
                onVenueLoad: false,
                umpireVenueList: action.result,
                status: action.status
            };
        //// Division List
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_LOAD:
            return { ...state, onDivisionLoad: true };
        case ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_SUCCESS:
            return {
                ...state,
                onDivisionLoad: false,
                umpireDivisionList: action.result,
                status: action.status
            };
        //// Umpire Import
        case ApiConstants.API_UMPIRE_IMPORT_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_UMPIRE_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false
            };
        //// Fail and Error case
        case ApiConstants.API_UMPIRE_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_UMPIRE_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_UMPIRE_ROUND_LIST_LOAD:
            return { ...state, rounLoad: true };


        case ApiConstants.API_UMPIRE_ROUND_LIST_SUCCESS:
            let sequenceValue = getHighestSequence(action.result)
            state.highestSequence = sequenceValue
            let roundListArray = action.result
            roundListArray.sort((a, b) => Number(a.sequence) - Number(b.sequence));
            state.umpireRoundList = removeDuplicateValues(roundListArray)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                rounLoad: false
            };

        default:
            return state;
    }
}
export default umpireDashboardState;
