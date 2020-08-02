import ApiConstants from "../../../themes/apiConstants";

var obj = 
{
    competitionFormatTemplateId: 0,
    competitionFinalsId: 0,
    isDefault: null,
    finalsFixtureTemplateRefId: null,
    finalsMatchTypeRefId:null,
    matchDuration: null,
    mainBreak: null,
    qtrBreak: null,
    timeBetweenGames: null,
    applyToRefId: null,
    extraTimeDuration: null,
    extraTimeMainBreak: null,
    extraTimeBreak: null,
    beforeExtraTime: null,
    extraTimeDrawRefId: null,
    finalsStartDate: null,
    extraTimeMatchTypeRefId: null
}
const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    competitionFinalsList: [obj],
    competitionVenuesList: []
};
function competitionFinalsReducer(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_GET_COMPETITION_FINALS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_COMPETITION_FINALS_SUCCESS:
			 state.competitionVenuesList= []							   
            let compFinalsData = action.result;
            return {
                ...state,
                onLoad: false,
                competitionFinalsList: compFinalsData.finals,
                competitionVenuesList: compFinalsData.venues,	 
                status: action.status
            };

        case ApiConstants.API_SAVE_COMPETITION_FINALS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_COMPETITION_FINALS_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
            };
        
        case ApiConstants.UPDATE_COMPETITION_FINALS:
        
            let oldData = state.competitionFinalsList;
            let updatedValue = action.updatedData;
            let getKey = action.key;
            let index = action.index;
            if(action.key.venueList == "venueList")
            {
                state.competitionVenuesList = []
                updatedValue.map((id)=>{
                    let obj={
                        venueId:id,
                        competitionVenueId:0,
                    }
                    state.competitionVenuesList.push(obj)
                })
            }
            else{
                oldData[index][getKey] = updatedValue;
            }
            return { ...state, error: null };

        case ApiConstants.API_COMPETITION_FINALS_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_FINALS_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_GET_TEMPLATE_DOWNLOAD_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_TEMPLATE_DOWNLOAD_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        default:
            return state;
    }
}

export default competitionFinalsReducer;
