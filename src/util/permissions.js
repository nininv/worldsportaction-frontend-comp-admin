import { getOrganisationData, getLiveScoreCompetiton } from "./sessionStorage";
import AppConstants from "../themes/appConstants";
import history from "../util/history";

const organisationTypeRefIdObject = {
    [AppConstants.national]: 1,
    [AppConstants.state]: 2,
    [AppConstants.association]: 3,
    [AppConstants.club]: 4
}


async function checkOrganisationLevel() {
    let orgItem = await getOrganisationData()
    let organisationTypeRefId = orgItem ? orgItem.organisationTypeRefId : 0
    let orgLevel = Object.keys(organisationTypeRefIdObject).find(key => organisationTypeRefIdObject[key] === organisationTypeRefId);
    return orgLevel
}


const userRoleIdObject = {
    [AppConstants.super_admin]: 1,
    [AppConstants.admin]: 2,
    [AppConstants.manager]: 3,
    [AppConstants.scorer]: 4,
    [AppConstants.member]: 5,
    [AppConstants.spectator]: 6,
    [AppConstants.attendance_recorder]: 7,
    [AppConstants.player]: 8,
    [AppConstants.parent]: 9,
    [AppConstants.web_communications_admin]: 10,
    [AppConstants.web_umpires_admin]: 11,
    [AppConstants.web_results_admin]: 12,
    [AppConstants.web_finance_admin]: 13,
}

async function checkUserRole() {
    let orgItem = await getOrganisationData()
    let userRoleId = orgItem ? orgItem.userRoleId : 0
    let userRole = Object.keys(userRoleIdObject).find(key => userRoleIdObject[key] === userRoleId);
    return userRole
}


async function routePermissionForOrgLevel(orgLevel1, orgLevel2) {
    let orgLevel = await checkOrganisationLevel()
    if (orgLevel1 == orgLevel || orgLevel2 == orgLevel) {

    } else {
        history.push('./')
    }
}
const registrationsInviteesObject = {
    [AppConstants.firstlevelAffiliate]: 2,
    [AppConstants.secondlevelAffiliate]: 3,
    [AppConstants.anyOrgAssociation]: 7,
    [AppConstants.anyOrgClub]: 8,
    [AppConstants.direct]: 5,
    [AppConstants.notApplicable]: 6,
    [AppConstants.NoRegistrations]: 0,

}

function checkRegistrationType(registrationInviteesRefId) {
    let registrationType = Object.keys(registrationsInviteesObject).find(key => registrationsInviteesObject[key] === registrationInviteesRefId);
    return registrationType
}

async function checkLivScoreCompIsParent() {
    let orgItem = await getOrganisationData()
    let liveScoreCompetition = await getLiveScoreCompetiton()
    let organisationId = orgItem ? orgItem.organisationId : 0
    let liveScoreCompetitionOrgId = liveScoreCompetition ? JSON.parse(liveScoreCompetition).organisationId : 0
    if (liveScoreCompetitionOrgId === organisationId) {
        return true
    } else {
        return false
    }
}

async function checkUserAccess() {
    let orgItem = await getOrganisationData()
    let userRoleId = orgItem ? orgItem.userRoleId : 2
    if (userRoleId == 2) {
        return "admin"
    }
    else if (userRoleId == 11) {
        return "umpire"
    }
    else if (userRoleId == 13) {
        return "finance"
    }
    else {
        return "admin"
    }

}

function showRoleLevelPermision(userRoleId, menuName) {

    if (menuName === 'user') {

        switch (userRoleId) {
            case 2: return true
                break;
            case 11: return true
                break;
            case 13: return true
                break;
            default: return false

        }
    } else if (menuName === 'registration') {

        switch (userRoleId) {
            case 2: return true
                break;
            default: return false

        }
    } else if (menuName === 'competitions') {

        switch (userRoleId) {
            case 2: return true
                break;
            default: return false

        }
    } else if (menuName === 'liveScores') {

        switch (userRoleId) {
            case 2: return true
                break;
            default: return false

        }
    } else if (menuName === 'events') {

        switch (userRoleId) {
            case 2: return true
                break;
            default: return false

        }
    } else if (menuName === 'shop') {

        switch (userRoleId) {
            case 2: return true
            default: return false

        }
    } else if (menuName == 'umpires') {

        switch (userRoleId) {
            case 2: return true
                break;
            case 11: return true
                break;
            default: return false

        }
    } else if (menuName == 'finance') {

        switch (userRoleId) {
            case 2: return true
                break;
            case 13: return true
                break;
            default: return false

        }
    }

}

function getUserRoleId() {
    let orgItem = getOrganisationData()
    let userRoleId = orgItem ? orgItem.userRoleId : 2

    return userRoleId
}

export { checkOrganisationLevel, checkUserRole, routePermissionForOrgLevel, checkRegistrationType, checkLivScoreCompIsParent, checkUserAccess, showRoleLevelPermision, getUserRoleId }
