import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    regDashboardListData: [], ////////registration Dashboard list
    regDashboardListPage: 1,
    regDashboardListTotalCount: 1,
    competitionTypeList: []

};


function registrationDashboard(state = initialState, action) {
    switch (action.type) {
        //////get the Dashboard list in registration
        case ApiConstants.API_REG_DASHBOARD_LIST_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_REG_DASHBOARD_LIST_SUCCESS:
            let dashboardListData = action.result;
            return {
                ...state,
                onLoad: false,
                regDashboardListData: dashboardListData.orgReg,
                regDashboardListTotalCount: dashboardListData.page.totalCount,
                regDashboardListPage: dashboardListData.page
                    ? dashboardListData.page.currentPage
                    : 1,
                status: action.status,
                error: null
            };


        ///******fail and error handling */
        case ApiConstants.API_REG_DASHBOARD_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_REG_DASHBOARD_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        /////get the Competition type list 
        case ApiConstants.API_GET_ALL_COMPETITION_LOAD:
            state.competitionTypeList = [];
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_ALL_COMPETITION_SUCCESS:
            let competitionData = JSON.parse(JSON.stringify(action.result))
            let competitionObject = {
                competitionId: 0,
                competitionName: "New Competition ",
                competitionStatus: "draft",
                competitionStatusId: 0,
                id: 0,
                isDirect: false,
                registrationCloseDate: "",
                yearId: "",
                orgRegistratinId: 0,
                competitionCreatorOrganisation: 0,
                inviteeStatus: 0
            }
            competitionData.unshift(competitionObject)
            return {
                ...state,
                onLoad: false,
                competitionTypeList: competitionData,
                status: action.status
            };

        default:
            return state;
    }
}

export default registrationDashboard;
