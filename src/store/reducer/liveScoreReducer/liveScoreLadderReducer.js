import ApiConstants from '../../../themes/apiConstants'

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    liveScoreLadderDivisionData: [],
    liveScoreLadderListData: [],
};

function liveScoreLaddersReducer(state = initialState, action) {

    switch (action.type) {

        //LIVESCORE DIVISION LIST
        case ApiConstants.API_LIVE_SCORE_DIVISION_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:
            let divisionDatafromAction = action.divisionList
            let ladderList = action.ladderList ? action.ladderList : []
            return {
                ...state,
                onLoad: false,
                liveScoreLadderDivisionData: divisionDatafromAction,
                liveScoreLadderListData: ladderList,
                status: action.status
            };



        //LIVESCORE LADDER LIST

        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                liveScoreLadderListData: action.result
            };

        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        default:
            return state;
    };

}

export default liveScoreLaddersReducer;