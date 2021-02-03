import ApiConstants from 'themes/apiConstants';

// Get Role
function getRoleAction() {
    return {
        type: ApiConstants.API_ROLE_LOAD,
    };
}

// Get URE
function getUreAction() {
    return {
        type: ApiConstants.API_URE_LOAD,
    };
}

// Impersonation
function impersonationAction(payload) {
    return {
        type: ApiConstants.API_IMPERSONATION_LOAD,
        payload,
    };
}

/* Affiliates Listing */
function getAffiliatesListingAction(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_AFFILIATES_LISTING_LOAD,
        payload,
        sortBy,
        sortOrder,
    };
}

/* Save Affiliate */
function saveAffiliateAction(payload) {
    return {
        type: ApiConstants.API_SAVE_AFFILIATE_LOAD,
        payload,
    };
}

/* Get Affiliate by Organisation Id */
function getAffiliateByOrganisationIdAction(organisationId) {
    return {
        type: ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD,
        payload: organisationId,
    };
}

/* Get Affiliate Our Organisation */
function getAffiliateOurOrganisationIdAction(organisationId) {
    return {
        type: ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD,
        payload: organisationId,
    };
}

/* Get AffiliateTo Organisation */
function getAffiliateToOrganisationAction(organisationId, searchText) {
    return {
        type: ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD,
        payload: organisationId,
        searchText,
    };
}

// Update Affiliate
function updateAffiliateAction(data, key) {
    return {
        type: ApiConstants.UPDATE_AFFILIATE,
        updatedData: data,
        key,
    };
}

// Update NewAffiliate
function updateNewAffiliateAction(data, key) {
    return {
        type: ApiConstants.UPDATE_NEW_AFFILIATE,
        updatedData: data,
        key,
    };
}

// Update Org Affiliate
function updateOrgAffiliateAction(data, key) {
    return {
        type: ApiConstants.UPDATE_ORG_AFFILIATE,
        updatedData: data,
        key,
    };
}

// Get organisation
function getOrganisationAction(key) {
    return {
        type: ApiConstants.API_ORGANISATION_LOAD,
        key,
    };
}

function affiliateDeleteAction(affiliateId) {
    return {
        type: ApiConstants.API_AFFILIATE_DELETE_LOAD,
        payload: affiliateId,
    };
}

// Get particular user organisation
function getUserOrganisationAction() {
    return {
        type: ApiConstants.API_GET_USER_ORGANISATION_LOAD,
    };
}

// onchange user organisation data
function onOrganisationChangeAction(organisationData, key) {
    return {
        type: ApiConstants.ONCHANGE_USER_ORGANISATION,
        organisationData,
        key,
    };
}

/* User Dashboard Textual Listing */
function getUserDashboardTextualAction(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD,
        payload,
        sortBy,
        sortOrder,
    };
}

function getUserModulePersonalDetailsAction(userId) {
    return {
        type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD,
        payload: userId,
    };
}

function getUserModulePersonalByCompetitionAction(payload) {
    return {
        type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD,
        payload,
    };
}

function getUserModuleRegistrationAction(payload) {
    return {
        type: ApiConstants.API_USER_MODULE_REGISTRATION_LOAD,
        payload,
    };
}

function getUserModuleTeamRegistrationAction(payload) {
    return {
        type: ApiConstants.API_USER_MODULE_TEAM_REGISTRATION_LOAD,
        payload,
    };
}

function getUserModuleOtherRegistrationAction(payload) {
    return {
        type: ApiConstants.API_USER_MODULE_OTHER_REGISTRATION_LOAD,
        payload,
    };
}

function getUserModuleMedicalInfoAction(userId) {
    return {
        type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD,
        payload: userId,
    };
}

function getUserModuleActivityPlayerAction(userId) {
    return {
        type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD,
        payload: userId,
    };
}

function getUserModuleActivityParentAction(userId) {
    return {
        type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD,
        payload: userId,
    };
}

function getUserModuleActivityScorerAction(userId) {
    return {
        type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD,
        payload: userId,
    };
}

function getUserModuleActivityManagerAction(userId) {
    return {
        type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD,
        payload: userId,
    };
}

function getUserFriendAction(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_USER_FRIEND_LOAD,
        payload,
        sortBy,
        sortOrder,
    };
}

function exportUserFriendAction(payload) {
    return {
        type: ApiConstants.API_EXPORT_USER_FRIEND_LOAD,
        payload,
    };
}

function getUserReferFriendAction(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_USER_REFER_FRIEND_LOAD,
        payload,
        sortBy,
        sortOrder,
    };
}

function getOrganisationPhotoAction(payload) {
    return {
        type: ApiConstants.API_GET_ORG_PHOTO_LOAD,
        payload,
    };
}

function saveOrganisationPhotoAction(payload) {
    return {
        type: ApiConstants.API_SAVE_ORG_PHOTO_LOAD,
        payload,
    };
}

function deleteOrganisationPhotoAction(payload) {
    return {
        type: ApiConstants.API_DELETE_ORG_PHOTO_LOAD,
        payload,
    };
}

function deleteOrgContact(payload) {
    return {
        type: ApiConstants.API_DELETE_ORG_CONTACT_LOAD,
        payload,
    };
}

/* Export Organisation Registration Question */
function exportOrgRegQuestionAction(payload) {
    return {
        type: ApiConstants.API_EXPORT_ORG_REG_QUESTIONS_LOAD,
        payload,
    };
}

/* Export User Registration Data */
function getSubmittedRegData(payload) {
    return {
        type: ApiConstants.API_GET_SUBMITTED_REG_DATA_LOAD,
        payload,
    };
}

/* Transfer User Registration */
function transferUserRegistration(payload) {
    return {
        type: ApiConstants.API_TRANSFER_USER_REGISTRATION_LOAD,
        payload,
    };
}

/* Export User Registration Data */
function exportUserRegData(payload) {
    return {
        type: ApiConstants.API_EXPORT_USER_REG_DATA_LOAD,
        payload,
    };
}

/* Affiliate Directory Listing */
function getAffiliateDirectoryAction(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_AFFILIATE_DIRECTORY_LOAD,
        payload,
        sortBy,
        sortOrder,
    };
}

/* Export Affiliate Directory */
function exportAffiliateDirectoryAction(payload) {
    return {
        type: ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_LOAD,
        payload,
    };
}

function userProfileUpdateAction(data) {
    return {
        type: ApiConstants.API_USER_PROFILE_UPDATE_LOAD,
        data,
    };
}


function addChildAction(body, userId, sameEmail) {
    return {
        type: ApiConstants.API_ADD_CHILD_LOAD,
        payload: { body, userId, sameEmail },
    };
}

function addParentAction(body, userId, sameEmail) {
    return {
        type: ApiConstants.API_ADD_PARENT_LOAD,
        payload: { body, userId, sameEmail },
    };
}


function userPhotoUpdateAction(payload, userDetail) {
    return {
        type: ApiConstants.API_USER_PHOTO_UPDATE_LOAD,
        payload,
        userDetail,
    };
}

function userDetailUpdateAction(payload) {
    return {
        type: ApiConstants.API_USER_DETAIL_UPDATE_LOAD,
        payload,
    };
}

function userPasswordUpdateAction(payload) {
    return {
        type: ApiConstants.API_USER_PASSWORD_UPDATE_LOAD,
        payload,
    };
}

function getUserHistoryAction(userId) {
    return {
        type: ApiConstants.API_USER_MODULE_HISTORY_LOAD,
        payload: userId,
    };
}

function getUserProfileAction() {
    return {
        type: ApiConstants.API_USER_DETAIL_LOAD,
    };
}

// update charity value
function updateCharityValue(value, index, key) {
    return {
        type: ApiConstants.UPDATE_ORGANISATION_CHARITY_ROUND_UP,
        value,
        index,
        key,
    };
}

function updateCharityAction(payload) {
    return {
        type: ApiConstants.API_UPDATE_CHARITY_ROUND_UP_LOAD,
        payload,
    };
}

function updateTermsAndConditionAction(payload) {
    return {
        type: ApiConstants.API_UPDATE_TERMS_AND_CONDITION_LOAD,
        payload,
    };
}

function userDeleteAction(payload) {
    return {
        type: ApiConstants.API_USER_DELETE_LOAD,
        payload,
    };
}

function getUserModuleIncidentListAction(payload) {
    return {
        type: ApiConstants.API_GET_USER_MODULE_INCIDENT_LIST_LOAD,
        payload,
    };
}

function getUserRole(userId) {
    return {
        type: ApiConstants.API_GET_USER_ROLE_LOAD,
        userId,
    };
}

function getScorerData(payload, roleId, matchStatus) {
    return {
        type: ApiConstants.API_GET_SCORER_ACTIVITY_LOAD,
        payload,
        roleId,
        matchStatus,
    };
}

function getUmpireData(payload, roleId, matchStatus) {
    return {
        type: ApiConstants.API_GET_UMPIRE_DATA_LOAD,
        payload,
        roleId,
        matchStatus,
    };
}

function getCoachData(payload, roleId, matchStatus) {
    return {
        type: ApiConstants.API_GET_COACH_DATA_LOAD,
        payload,
        roleId,
        matchStatus,
    };
}

function getUmpireActivityListAction(payload, roleId, userId, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_LOAD,
        payload,
        roleId,
        userId,
        sortBy,
        sortOrder,
    };
}

function getBannerCnt(organisationId) {
    return {
        type: ApiConstants.API_BANNER_COUNT_LOAD,
        organisationId,
    };
}

function updateBannerAction(payload) {
    return {
        type: ApiConstants.API_UPDATE_BANNER_COUNT_LOAD,
        payload,
    };
}

function clearListAction(payload) {
    return {
        type: ApiConstants.API_CLEAR_LIST_DATA,
        payload,
    };
}

function getSpectatorListAction(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_GET_SPECTATOR_LIST_LOAD,
        payload,
        sortBy,
        sortOrder,
    };
}

function registrationResendEmailAction(teamId, userId) {
    return {
        type: ApiConstants.API_REGISTRATION_RESEND_EMAIL_LOAD,
        teamId,
        userId,
    };
}

function resetTfaAction(Id) {
    return {
        type: ApiConstants.Api_RESET_TFA_LOAD,
        Id,
    };
}

function addUsersToBeCompared(users) {
    return {
        type: ApiConstants.ADD_USERS_TO_BE_MERGED,
        payload: users,
    };
}

function getUserModuleTeamMembersAction(payload) {
    return {
        type: ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_LOAD,
        payload,
    };
}

function getNetSetGoActionList(payload, sortBy, sortOrder) {
    return {
        type: ApiConstants.API_GET_NETSETGO_LIST_LOAD,
        payload,
        sortBy,
        sortOrder,
    };
}

function teamMemberSaveUpdateAction(data, key, index, subIndex) {
    return {
        type: ApiConstants.TEAM_MEMBER_SAVE_UPDATE_ACTION,
        data,
        key,
        index,
        subIndex,
    };
}

function teamMembersSaveAction(payload) {
    return {
        type: ApiConstants.API_TEAM_MEMBERS_SAVE_LOAD,
        payload,
    };
}

function getTeamMembersAction(teamMemberRegId) {
    return {
        type: ApiConstants.API_GET_TEAM_MEMBERS_LOAD,
        teamMemberRegId,
    };
}

function updateReviewInfoAction(value, key, index, subkey, subIndex) {
    return {
        type: ApiConstants.UPDATE_TEAM_MEMBER_REVIEW_INFO,
        value,
        key,
        index,
        subkey,
        subIndex,
    };
}

function getTeamMembersReviewAction(payload) {
    return {
        type: ApiConstants.API_GET_TEAM_MEMBERS_REVIEW_LOAD,
        payload,
    };
}

function teamMemberUpdateAction(data) {
    return {
        type: ApiConstants.API_TEAM_MEMBER_UPDATE_LOAD,
        data,
    };
}

function filterByRelations(data) {
    return {
        type: ApiConstants.API_FILTER_USERS_LOAD,
        data,
    }
}

function getUsersByIds(data) {
    return {
        type: ApiConstants.API_GET_USERS_BY_IDS_LOAD,
        data,
    }
}

function getUserParentDataAction(data) {
    return {
        type: ApiConstants.API_GET_USER_PARENT_DATA_LOAD,
        data,
    }
}

function setAffiliateDirectoryListPageSizeAction(pageSize) {
    return {
        type: ApiConstants.SET_AFFILIATE_DIRECTORY_LIST_PAGE_SIZE,
        pageSize,
    };
}

function setAffiliateDirectoryListPageNumberAction(pageNum) {
    return {
        type: ApiConstants.SET_AFFILIATE_DIRECTORY_LIST_PAGE_CURRENT_NUMBER,
        pageNum,
    };
}

function setNetSetGoListPageSizeAction(pageSize) {
    return {
        type: ApiConstants.SET_NETSETGO_LIST_PAGE_SIZE,
        pageSize,
    };
}

function setNetSetGoListPageNumberAction(pageNum) {
    return {
        type: ApiConstants.SET_NETSETGO_LIST_PAGE_CURRENT_NUMBER,
        pageNum,
    };
}

export {
    getRoleAction,
    getUreAction,
    getAffiliatesListingAction,
    saveAffiliateAction,
    getAffiliateByOrganisationIdAction,
    getAffiliateToOrganisationAction,
    updateAffiliateAction,
    updateNewAffiliateAction,
    getAffiliateOurOrganisationIdAction,
    updateOrgAffiliateAction,
    getOrganisationAction,
    affiliateDeleteAction,
    getUserOrganisationAction,
    onOrganisationChangeAction,
    getUserDashboardTextualAction,
    getUserModulePersonalDetailsAction,
    getUserModuleMedicalInfoAction,
    getUserModuleRegistrationAction,
    getUserModuleTeamRegistrationAction,
    getUserModuleOtherRegistrationAction,
    getUserModulePersonalByCompetitionAction,
    getUserModuleActivityPlayerAction,
    getUserModuleActivityParentAction,
    getUserModuleActivityScorerAction,
    getUserModuleActivityManagerAction,
    getUserFriendAction,
    exportUserFriendAction,
    getUserReferFriendAction,
    getOrganisationPhotoAction,
    saveOrganisationPhotoAction,
    deleteOrganisationPhotoAction,
    deleteOrgContact,
    exportOrgRegQuestionAction,
    getAffiliateDirectoryAction,
    exportAffiliateDirectoryAction,
    userProfileUpdateAction,
    getUserHistoryAction,
    userPhotoUpdateAction,
    userDetailUpdateAction,
    userPasswordUpdateAction,
    getUserProfileAction,
    updateCharityValue,
    updateCharityAction,
    updateTermsAndConditionAction,
    impersonationAction,
    userDeleteAction,
    getUserModuleIncidentListAction,
    getUserRole,
    getScorerData,
    getUmpireData,
    getCoachData,
    getUmpireActivityListAction,
    getBannerCnt,
    updateBannerAction,
    clearListAction,
    getSpectatorListAction,
    registrationResendEmailAction,
    resetTfaAction,
    addUsersToBeCompared,
    getUserModuleTeamMembersAction,
    getNetSetGoActionList,
    addChildAction,
    addParentAction,
    teamMemberSaveUpdateAction,
    teamMembersSaveAction,
    getTeamMembersAction,
    updateReviewInfoAction,
    getTeamMembersReviewAction,
    teamMemberUpdateAction,
    exportUserRegData,
    getSubmittedRegData,
    transferUserRegistration,
    filterByRelations,
    getUsersByIds,
    getUserParentDataAction,
    setAffiliateDirectoryListPageSizeAction,
    setAffiliateDirectoryListPageNumberAction,
    setNetSetGoListPageSizeAction,
    setNetSetGoListPageNumberAction,
};
