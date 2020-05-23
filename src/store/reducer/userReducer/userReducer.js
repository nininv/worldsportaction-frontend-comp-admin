import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { JsonWebTokenError } from "jsonwebtoken";

let affiliate = {
    affiliateId: 0,
    affiliateOrgId: 0,
    organisationTypeRefId: 0,
    affiliatedToOrgId: 0,
    organisationId: "",
    name: '',
    street1: '',
    street2: '',
    suburb: '',
    phoneNo: '',
    city: '',
    postalCode: '',
    stateRefId: 0,
    whatIsTheLowestOrgThatCanAddChild: 0,
    contacts: []
}

let affiliateListObj = {
    affiliateId: 0,
    affiliateToOrgId: 0,
    affiliateOrgId: 0,
    affiliateName: '',
    affiliatedToName: '',
    organisationTypeRefName: '',
    contact1Name: '',
    contact2Name: '',
    statusRefName: ''
}

let affiliateToObj = {
    affiliateTo: [],
    organisationTypes: [],
    organisationName: ''

}

const initialState = {
    onLoad: false,
    affiliateOnLoad: false,
    affiliateToOnLoad: false,
    affiliateOurOrgOnLoad: false,
    onTextualLoad: false,
    error: null,
    result: [],
    status: 0,
    affiliate: { affiliate },
    affiliateEdit: affiliate,
    affiliateOurOrg: affiliate,
    affiliateList: [],
    affiliateTo: {},
    roles: [],
    userRolesEntity: [],
    affiliateListPage: 1,
    affiliateListTotalCount: 1,
    venueOragnasation: [],
    allUserOrganisationData: [],
    getUserOrganisation: [],
    userDashboardTextualList: [],
    userDashboardTextualPage: 1,
    userDashboardTextualTotalCount: 1,
    personalData: {},
    personalEmergency: [],
    medicalData: [],
    personalByCompData: [],
    userRegistrationList: [],
    userRegistrationPage: 1,
    userRegistrationTotalCount: 1,
    userRegistrationOnLoad: false,
    activityPlayerOnLoad: false,
    activityPlayerList: [],
    activityPlayerPage: 1,
    activityPlayerTotalCount: 1,
    activityParentOnLoad: false,
    activityParentList: [],
    activityParentPage: 1,
    activityParentTotalCount: 1,
    activityScorerOnLoad: false,
    activityScorerList: [],
    activityScorerPage: 1,
    activityScorerTotalCount: 1,
    activityManagerOnLoad: false,
    activityManagerList: [],
    activityManagerPage: 1,
    activityManagerTotalCount: 1,
    onOrgLoad: false,
    friendList: [],
    friendPage: 1,
    friendTotalCount: 1,
    referFriendList: [],
    referFriendPage: 1,
    referFriendTotalCount: 1,
    orgPhotosList: []
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_USER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_USER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        // get Role Entity List for current  user
        case ApiConstants.API_ROLE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_ROLE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                roles: action.result,
                status: action.status
            };

        // User Role Entity List for current  user
        case ApiConstants.API_URE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_URE_SUCCESS:

            return {
                ...state,
                onLoad: false,
                userRoleEntity: action.result,
                status: action.status
            };

        case ApiConstants.API_AFFILIATES_LISTING_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_AFFILIATES_LISTING_SUCCESS:
            let data = action.result;
            // console.log("DATA::" + JSON.stringify(data));

            return {
                ...state,
                onLoad: false,
                affiliateList: data.affiliates,
                affiliateListPage: data.page ? data.page.currentPage : 1,
                affiliateListTotalCount: data.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_SAVE_AFFILIATE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_AFFILIATE_SUCCESS:

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD:
            return { ...state, onLoad: true, affiliateOnLoad: true };

        case ApiConstants.API_AFFILIATE_BY_ORGANISATION_SUCCESS:
            let affiliateData = action.result;

            return {
                ...state,
                onLoad: false,
                affiliateOnLoad: false,
                affiliateEdit: affiliateData,
                status: action.status
            };
        case ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD:
            return { ...state, onLoad: true, affiliateOurOrgOnLoad: true };

        case ApiConstants.API_AFFILIATE_OUR_ORGANISATION_SUCCESS:
            let affiliateOurOrgData = action.result;

            return {
                ...state,
                onLoad: false,
                affiliateOurOrgOnLoad: false,
                affiliateOurOrg: affiliateOurOrgData,
                status: action.status
            };
        case ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD:
            return { ...state, onLoad: true, affiliateToOnLoad: true };

        case ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS:
            let affiliateToData = action.result;

            return {
                ...state,
                onLoad: false,
                affiliateTo: affiliateToData,
                affiliateToOnLoad: false,
                status: action.status
            };
        case ApiConstants.UPDATE_AFFILIATE:

            let oldData = state.affiliateEdit;
            let updatedValue = action.updatedData;
            let getKey = action.key;
            oldData[getKey] = updatedValue;
            return { ...state, error: null };

        case ApiConstants.UPDATE_ORG_AFFILIATE:

            let oldOrgData = state.affiliateOurOrg;
            let updatedOrgValue = action.updatedData;
            let getOrgKey = action.key;
            oldOrgData[getOrgKey] = updatedOrgValue;
            return { ...state, error: null };

        case ApiConstants.UPDATE_NEW_AFFILIATE:

            let oldAffiliateData = state.affiliate.affiliate;
            let updatedVal = action.updatedData;
            let key = action.key;
            oldAffiliateData[key] = updatedVal;

            return { ...state, error: null };



        //Get oragnasation for add venue 
        case ApiConstants.API_ORGANISATION_LOAD:
            return { ...state, onLoad: true, error: null }

        case ApiConstants.API_ORGANISATION_SUCCESS:
            return {
                ...state,
                venueOragnasation: action.result,
                onLoad: false,
                error: null,
                status: action.status
            }

        //////delete the Affiliate 
        case ApiConstants.API_AFFILIATE_DELETE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_AFFILIATE_DELETE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };


        /////get particular user organisation 
        case ApiConstants.API_GET_USER_ORGANISATION_LOAD:
            return { ...state, onLoad: true, error: null, onOrgLoad: true }

        case ApiConstants.API_GET_USER_ORGANISATION_SUCCESS:
            state.allUserOrganisationData = isArrayNotEmpty(action.result) ? action.result : []
            state.getUserOrganisation = isArrayNotEmpty(action.result) ? action.result : []
            state.onOrgLoad = false
            return {
                ...state,
                onLoad: false,
                error: null,
                status: action.status
            }

        ////onchange user organisation data
        case ApiConstants.ONCHANGE_USER_ORGANISATION:
            let allorgData = JSON.parse(JSON.stringify(state.allUserOrganisationData))
            let organisationIndex = allorgData.findIndex(
                x =>
                    x.organisationUniqueKey ==
                    action.organisationData.organisationUniqueKey
            );
            allorgData.splice(organisationIndex, 1)
            state.getUserOrganisation = allorgData
            return {
                ...state,
                onLoad: false,
                error: null
            };

        case ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD:
            return { ...state, onTextualLoad: true };

        case ApiConstants.API_USER_DASHBOARD_TEXTUAL_SUCCESS:
            let textualData = action.result;

            return {
                ...state,
                onTextualLoad: false,
                userDashboardTextualList: textualData.users,
                userDashboardTextualPage: textualData.page ? textualData.page.currentPage : 1,
                userDashboardTextualTotalCount: textualData.page.totalCount,
                status: action.status
            };
        case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_SUCCESS:
            let personalData = action.result;
            let arr = [];
            if (personalData != null) {
                let obj = {
                    emergencyContactName: personalData.emergencyContactName,
                    emergencyContactNumber: personalData.emergencyContactNumber
                };
                arr.push(obj);
            }
            return {
                ...state,
                onLoad: false,
                personalData: personalData,
                personalEmergency: arr,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_SUCCESS:
            let personalByCompData = action.result;
            return {
                ...state,
                onLoad: false,
                personalByCompData: personalByCompData,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_USER_MODULE_MEDICAL_INFO_SUCCESS:
            let medicalData = action.result;

            return {
                ...state,
                onLoad: false,
                medicalData: medicalData,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_REGISTRATION_LOAD:
            return { ...state, userRegistrationOnLoad: true };

        case ApiConstants.API_USER_MODULE_REGISTRATION_SUCCESS:
            let userRegistrationData = action.result;
            return {
                ...state,
                userRegistrationOnLoad: false,
                userRegistrationList: userRegistrationData.registrationDetails,
                userRegistrationDataPage: userRegistrationData.page ? userRegistrationData.page.currentPage : 1,
                userRegistrationDataTotalCount: userRegistrationData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD:
            return { ...state, activityPlayerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_SUCCESS:
            let activityPlayerData = action.result;
            return {
                ...state,
                activityPlayerOnLoad: false,
                activityPlayerList: activityPlayerData.activityPlayers,
                activityPlayerPage: activityPlayerData.page ? activityPlayerData.page.currentPage : 1,
                activityPlayerTotalCount: activityPlayerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD:
            return { ...state, activityParentOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_SUCCESS:
            let activityParentData = action.result;
            return {
                ...state,
                activityParentOnLoad: false,
                activityParentList: activityParentData.activityParents,
                activityParentPage: activityParentData.page ? activityParentData.page.currentPage : 1,
                activityParentTotalCount: activityParentData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD:
            return { ...state, activityScorerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_SUCCESS:
            let activityScorerData = action.result;
            return {
                ...state,
                activityScorerOnLoad: false,
                activityScorerList: activityScorerData.activityScorer,
                activityScorerPage: activityScorerData.page ? activityScorerData.page.currentPage : 1,
                activityScorerTotalCount: activityScorerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD:
            return { ...state, activityManagerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_SUCCESS:
            let activityManagerData = action.result;
            return {
                ...state,
                activityManagerOnLoad: false,
                activityManagerList: activityManagerData.activityManager,
                activityManagerPage: activityManagerData.page ? activityManagerData.page.currentPage : 1,
                activityManagerTotalCount: activityManagerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_FRIEND_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_USER_FRIEND_SUCCESS:
            let friendData = action.result;
            return {
                ...state,
                onLoad: false,
                friendList: friendData? friendData.friends : [],
                friendPage: (friendData && friendData.page) ? friendData.page.currentPage : 1,
                friendTotalCount: (friendData && friendData.page) ?  friendData.page.totalCount : 1,
                status: action.status
            };

        case ApiConstants.API_USER_REFER_FRIEND_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_USER_REFER_FRIEND_SUCCESS:
            let referFriendData = action.result;
            return {
                ...state,
                onLoad: false,
                referFriendList: referFriendData ? referFriendData.referFriends : [],
                referFriendPage: (referFriendData && referFriendData.page) ? referFriendData.page.currentPage : 1,
                referFriendTotalCount: (referFriendData && referFriendData.page) ? referFriendData.page.totalCount : 1,
                status: action.status
            };

        case ApiConstants.API_GET_ORG_PHOTO_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_ORG_PHOTO_SUCCESS:
            let orgPhotoData = action.result;
            return {
                ...state,
                onLoad: false,
                orgPhotosList: orgPhotoData ? orgPhotoData : [],
                status: action.status
            };

        case ApiConstants.API_SAVE_ORG_PHOTO_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_ORG_PHOTO_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        case ApiConstants.API_DELETE_ORG_PHOTO_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_DELETE_ORG_PHOTO_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };
        case ApiConstants.API_DELETE_ORG_CONTACT_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_DELETE_ORG_CONTACT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };
        default:
            return state;
    }
}


export default userReducer;