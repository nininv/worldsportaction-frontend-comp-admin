import ApiConstants from "../../../themes/apiConstants"

const initialState = {
    onLoad: false,
    status: 0,
    error: null,
    gameTimeStatisticsListResult: [],
    gameTimeStatistics: "",
    gameTimeStatisticsPage: 0,
    gameTimeStatisticstotalCount: 0,
    gameTimeStatisticsActionObject: null,
}

function liveScoreGameTimeStatisticsState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_LIST_LOAD:
            return {
                ...state,
                onLoad: true,
                gameTimeStatisticsActionObject: action
            }

        case ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_LIST_SUCCESS:
            let result = action.result
            state.gameTimeStatisticsListResult = result
            return {
                ...state,
                onLoad: false,
                status: action.status,
                gameTimeStatisticsPage: result.page.currentPage,
                gameTimeStatisticstotalCount: result.page.totalCount
            }
        case ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_FAIL:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error
            }

        case ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_ERROR:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error
            }

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.gameTimeStatisticsActionObject = null
            return { ...state, onLoad: false };

        default: return state
    }
}
export default liveScoreGameTimeStatisticsState;
