import ApiConstants from '../../../themes/apiConstants'

var managerObj = {
    id: null,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    teams: null
}

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    managerListResult: [],
    MainManagerListResult: [],
    managerData: managerObj,
    teamId: null,
    managerRadioBtn: null,
    exsitingManagerId: null,
    teamResult: [],
    onLoadSearch: false,
    managerSearchResult: [],
    loading: false,
}

/////get manager List Object on index basis
function getManagerListObject(managerListArray, key) {
    let obj = null
    let index = managerListArray.findIndex(x => x.id == key)
    // let index = managerListArray.findIndex(x => x.firstName + " " + x.lastName == key)
    if (index > -1) {
        obj = managerListArray[index]
    }
    return obj
}

function genrateTeamId(teamIdArr) {

    let teamId = []
    for (let i in teamIdArr) {
        teamId.push(teamIdArr[i].entityId)
    }

    return teamId

}

function getTeamObj(teamSelectId, teamArr) {

    let teamObj = []
    let obj = ''
    for (let i in teamArr) {

        for (let j in teamSelectId) {
            if (teamSelectId[j] == teamArr[i].id) {
                obj = {
                    "name": teamArr[i].name,
                    "id": teamArr[i].id
                }
                teamObj.push(obj)
                break;
            }

        }

    }
    return teamObj;

}

function getSelectedTeam(managerSelectedId, managerArr){
    let teamObjArr
    console.log(managerSelectedId,"managerSelectedId")

    for(let i in managerArr){
        if(managerSelectedId == managerArr[i].id){
            teamObjArr =  managerArr[i].linkedEntity
         console.log(teamObjArr,"teamObjArr")
         return teamObjArr
        }
         
    }
}
function genrateSelectedTeamId(linkedEntityArr , teamArray){
    let teamIds = []
    let teamsIds
    console.log(linkedEntityArr,teamArray,"ididid")

    for(let i in teamArray){
        for(let j in linkedEntityArr){
            if(linkedEntityArr[j].entityId == teamArray[i].id){
                teamIds.push(linkedEntityArr[j].entityId)
            }
        }
    }
    console.log(teamIds,"teams11")
    return teamIds
}
function liveScoreMangerState(state = initialState, action) {
    switch (action.type) {
        //// Manager List
        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_MANAGER_LIST_SUCCESS:
            return {
                ...state,
                onLoad: false,
                MainManagerListResult: action.result,
                managerListResult: action.result,
                status: action.status,
                managerSearchResult: action.result
            }

        //// Add Edit Manager
        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_LOAD:
            return { ...state, loading: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_SUCCESS:
            return {
                ...state,
                loading: false,
            }

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            console.log(action.result)
            // let playerData = liveScoreTeamModal.getTeamViewPlayerListData(action.result.players)
            return {
                ...state,
                teamResult: action.result,

            };

        ////Update Manager Data
        case ApiConstants.API_LIVE_SCORE_UPDATE_MANAGER_DATA:


            if (action.key == 'teamId') {

                let teamObj = getTeamObj(action.data, state.teamResult)
                state.managerData['teams'] = teamObj
                state.teamId = action.data

            } else if (action.key == 'managerRadioBtn') {
                state[action.key] = action.data
                state.exsitingManagerId = null

            } else if (action.key == "managerSearch") {

                state.exsitingManagerId = action.data
                state.selectedTeam = getSelectedTeam(action.data, state.managerListResult)

                // let getTeamId = genrateSelectedTeamId( state.selectedTeam, state.teamResult)
                // state.teamId = getTeamId

                // let managerTeamObj = getTeamObj(state.teamId, state.teamResult)
                // // let managerTeamObj1 = getSelectedTeamObj(state.getSelectedTeam)
                //  state.managerData['teams'] = managerTeamObj

            } else if (action.key == 'isEditManager') {
                state.managerData.id = action.data.id
                state.managerData.firstName = action.data.firstName
                state.managerData.lastName = action.data.lastName
                state.managerData.mobileNumber = action.data.mobileNumber
                state.managerData.email = action.data.email
                let getTeamId = genrateTeamId(action.data.linkedEntity)
                state.teamId = getTeamId

                let managerTeamObj = getTeamObj(state.teamId, state.teamResult)
                state.managerData['teams'] = managerTeamObj

                state.managerRadioBtn = 'new'

            } else if (action.key == 'isAddManager') {
                state.managerData = managerObj
                state.managerData.id = null
                state.teamId = []
                state.managerRadioBtn = 'new'

            } else {
                state.managerData[action.key] = action.data
            }
            return {
                ...state,

            }

        ///******fail and error handling */

        case ApiConstants.API_LIVE_SCORE_MANAGER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_MANAGER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVESCORE_MANAGER_FILTER:

            return {
                ...state,
                managerListResult: action.payload
            }
        case ApiConstants.CLEAR_LIVESCORE_MANAGER:

            return {
                ...state,
                managerListResult: state.MainManagerListResult
            }

        ////Manager Search
        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_LOAD:
            return { ...state, onLoadSearch: true };

        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_SUCCESS:
            console.log(action, 'API_LIVESCORE_MANAGER_SEARCH_SUCCESS')
            // state.managerListResult = action.result ? action.result : state.managerSearchResult
            return {
                ...state,
                onLoadSearch: false,
                // managerSearchResult: action.result,
                managerListResult: action.result,
                status: action.status,
            }
        default:
            return state;
    }
}

export default liveScoreMangerState;