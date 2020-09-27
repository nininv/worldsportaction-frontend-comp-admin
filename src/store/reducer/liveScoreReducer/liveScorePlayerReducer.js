import moment from "moment";

import ApiConstants from "themes/apiConstants";
import liveScoreModal from "store/objectModel/liveScoreModal";

const playerObj = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    mnbPlayerId: "",
    teamId: "",
    competitionId: null,
    photoUrl: null,
};

const initialState = {
    onLoad: false,
    onSearchLoad: false,
    error: null,
    result: [],
    status: 0,
    playerData: playerObj,
    playerDataArr: [],
    totalCount: null,
    searchResult: [],
    currentPage: 1
};

function LiveScorePlayerState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_SEARCH_LOAD:
            return { ...state, onSearchLoad: true };

        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_SEARCH_SUCCESS:
            return {
                ...state,
                onSearchLoad: false,
                searchResult: liveScoreModal.getPlayerListData(action.result),
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            return {
                ...state,
                onLoad: false,
                teamResult: action.result,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_UPDATE_PLAYER:
            if (action.key === "addplayerScreen") {
                state.playerData = playerObj;
            } else if (action.key === "editplayerScreen") {
                if (action.data) {
                    state.playerData = {
                        firstName: action.data.firstName,
                        lastName: action.data.lastName,
                        dateOfBirth: action.data.dateOfBirth ? moment(action.data.dateOfBirth).format("DD-MM-YYYY") : null,
                        phoneNumber: action.data.phoneNumber,
                        mnbPlayerId: action.data.mnbPlayerId,
                        teamId: action.data.team ? action.data.team.id : action.data.teamId,
                        competitionId: action.data.division ? action.data.division.competitionId : action.data.competitionId,
                        photoUrl: action.data.profilePicture ? action.data.profilePicture : action.data.photoUrl,
                    };
                }
            } else {
                state.playerData[action.key] = action.data;
            }
            return { ...state };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_SUCCESS:
            return {
                ...state,
                onLoad: false,
                playerData: action.result,
            };


        case ApiConstants.API_LIVE_SCORE_DELETE_PLAYER_LOAD:

            return {
                ...state,
                onLoad: true,
            }
        case ApiConstants.API_LIVE_SCORE_DELETE_PLAYER_SUCCESS:
            return { ...state, onLoad: false };

        case ApiConstants.API_LIVE_SCORE_DELETE_PLAYER_FAIL:
            return {
                ...state,
                onLoad: true,
                importResult: null,
            };
        case ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_LOAD:
            return {
                ...state,
                onLoad: true,
                importResult: null,
            };

        case ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                importResult: action.result,
            };

        case ApiConstants.API_LIVE_SCORE_PLAYER_IMPORT_RESET:
            return {
                ...state,
                importResult: null,
            };

        case ApiConstants.API_LIVE_SCORE_PLAYER_FAIL:
            return {
                ...state,
                onLoad: false,
                onSearchLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_PLAYER_ERROR:
            return {
                ...state,
                onLoad: false,
                onSearchLoad: false,
                error: action.error,
                status: action.status,
            };

        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_LOAD:
            return { ...state, onLoad: true, currentPage: 1 };

        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_SUCCESS:
            const playerListResult = liveScoreModal.getPlayerListData(action.result.players);
            state.totalCount = action.result.page.totalCount;
            state.currentPage = action.result.page.currentPage;
            return {
                ...state,
                onLoad: false,
                result: playerListResult,
                status: action.status,
            };

        default:
            return state;
    }
}

export default LiveScorePlayerState;
