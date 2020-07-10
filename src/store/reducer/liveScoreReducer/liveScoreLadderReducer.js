import ApiConstants from '../../../themes/apiConstants'

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    liveScoreLadderDivisionData: [],
    liveScoreLadderListData: [],
    ladderData: [],
    teamResult: [],
    divisionList: [],
    divisionId: null,
    ladderDivisionList: []
};

function createLadderRank(array) {
    for (let i in array) {
        array[i]["rank"] = JSON.parse(i) + 1
    }
    return array
}


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
                // status: action.status
            };


        /// ONLY LADDER
        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS:

            return {
                ...state,
                onLoad: false,
                liveScoreLadderDivisionData: action.result,
                ladderDivisionList: action.result,
                status: action.status
            };

        //LIVESCORE LADDER LIST
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_SUCCESS:

            let ladder_List = createLadderRank(action.result)
            return {
                ...state,
                onLoad: false,
                liveScoreLadderListData: ladder_List
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

        //// Update Ladder Setting
        case ApiConstants.UPDATE_LADDER_ADJUSTMENT:
            let key = action.data.key
            let data = action.data.data
            let index = action.data.index


            if (key === "addLadderAdjustment") {
                var obj = {
                    teamId: '',
                    points: '',
                    reasonforChange: ''
                }
                state.ladderData.push(obj)
            } else if (key === 'refresh') {
                var obj = {
                    teamId: '',
                    points: '',
                    reasonforChange: ''
                }
                state.ladderData = [obj]

            } else if (key === 'divisionId') {

                state.divisionId = data

            } else {
                state.ladderData[index][key] = data
            }

            return {
                ...state,
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:

            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            console.log(action.result, 'teamSuccess~~~~~')
            return {
                ...state,
                // onLoad: false,
                // teamResult: action.result,

            };

        default:
            return state;
    };

}

export default liveScoreLaddersReducer;