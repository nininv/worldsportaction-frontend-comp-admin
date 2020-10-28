import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

const initialState = {
    loader: false,
    List: null,
    yearList: [],
    ownedCompetitions: [],
    participatingInComptitions: [],
    ownedTotalCount: 1,
    ownedCurrentPage: 1,
    participateTotalCount: 1,
    participateCurrentPage: 1,
    ownedLoad: false,
    partLoad: false,
    allCompListLoad: false,
    competitionListActionObject: null,
}
export default function liveScoreCompetition(state = initialState, payload) {
    switch (payload.type) {
        case ApiConstants.API_LIVESCORE_COMPETITION_INITATE:
            return {
                ...state,
                loader: true
            }
        case ApiConstants.API_LIVESCORE_COMPETITION_SUCCESS:
            return {
                ...state,
                loader: false,
                List: payload.payload
            }
        case ApiConstants.API_LIVESCORE_COMPETITION_ERROR:
            return {
                ...state,
                loader: false,
                errorMessage: payload.payload
            }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_INITIATE:
            return {
                ...state,
                loader: true,
                ownedLoad: true
            }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_SUCCESS:
            if (payload.key === "own") {
                let ownIndex = state.ownedCompetitions.findIndex(data => data.id === payload.payload.id)
                state.ownedCompetitions.splice(ownIndex, 1)
            }
            if (payload.key === "part") {
                let partIndex = state.participatingInComptitions.findIndex(data => data.id === payload.payload.id)
                state.participatingInComptitions.splice(partIndex, 1)
            }
            return {
                ...state,
                loader: false,
                ownedLoad: false
            }
        case ApiConstants.API_LIVESCORE_COMPETION_DELETE_ERROR:

            return {
                ...state,
                loader: false,
                deleteError: payload.payload.message
            }

        //LIve score year reducer

        case ApiConstants.API_ONLY_YEAR_LIST_LOAD:
            return { ...state, loader: true };

        case ApiConstants.API_ONLY_YEAR_LIST_SUCCESS:
            return {
                ...state,
                loader: false,
                yearList: payload.result,
                // status: action.status
            };

        /////livescore own part competition listing
        case ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_LOAD:
            return {
                ...state,
                loader: true,
                ownedLoad: payload.key === "own" || payload.key === "all",
                partLoad: payload.key === "part" || payload.key === "all",
                allCompListLoad: true,
                competitionListActionObject: payload,
            }

        case ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_SUCCESS:
            let allData = payload.payload
            if (payload.key === "own" || payload.key === "all") {
                state.ownedCompetitions = isArrayNotEmpty(allData.ownedCompetitions.competitions) ? allData.ownedCompetitions.competitions : []
                state.ownedTotalCount = allData.ownedCompetitions.page ? allData.ownedCompetitions.page.totalCount : 1
                state.ownedCurrentPage = allData.ownedCompetitions.page ? allData.ownedCompetitions.page.currentPage : 1
            }
            if (payload.key === "part" || payload.key === "all") {
                state.participatingInComptitions = isArrayNotEmpty(allData.participatingInCompetitions.competitions) ? allData.participatingInCompetitions.competitions : []
                state.participateTotalCount = allData.participatingInCompetitions.page ? allData.participatingInCompetitions.page.totalCount : 1
                state.participateCurrentPage = allData.participatingInCompetitions.page ? allData.participatingInCompetitions.page.currentPage : 1
            }
            return {
                ...state,
                loader: false,
                ownedLoad: false,
                partLoad: false,
                allCompListLoad: false,
            }
        case ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_ERROR:
            return {
                ...state,
                loader: false,
                ownedLoad: false,
                partLoad: false,
            }

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.competitionListActionObject = null
            return { ...state, onLoad: false };

        default:
            return state
    }
}
