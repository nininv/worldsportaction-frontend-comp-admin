import ApiConstants from '../../../themes/apiConstants';
import ApiConstatnts from '../../../themes/apiConstants';

function liveScoreIncidentList(
  competitionId,
  search,
  limit,
  offset,
  sortBy,
  sortOrder,
  liveScoreCompIsParent,
  competitionOrganisationId,
) {
  const action = {
    type: ApiConstatnts.API_LIVE_SCORE_INCIDENT_LIST_LOAD,
    competitionId,
    search: search,
    limit,
    offset,
    sortBy,
    sortOrder,
    liveScoreCompIsParent,
    competitionOrganisationId,
  };
  return action;
}

function liveScoreUpdateIncident(data, key) {
  const action = {
    type: ApiConstatnts.API_LIVE_SCORE_UPDATE_INCIDENT,
    key,
    data,
  };
  return action;
}

// function liveScoreClearIncident() {
//     const action = {
//         type: ApiConstatnts.API_LIVE_SCORE_CLEAR_INCIDENT,
//     };
//     return action;
// }

export const createPlayerSuspensionAction = data => {
  return {
    type: ApiConstatnts.API_CREATE_PLAYER_SUSPENSION,
    data,
  };
};

export const updatePlayerSuspensionAction = (suspensionId, data) => {
  return {
    type: ApiConstatnts.API_UPDATE_PLAYER_SUSPENSION,
    suspensionId,
    data,
  };
};

export const liveScoreClearIncident = () => {
  return {
    type: ApiConstatnts.API_LIVE_SCORE_CLEAR_INCIDENT,
  };
};

function liveScoreUpdateIncidentData(data, key) {
  const action = {
    type: ApiConstatnts.API_LIVE_SCORE_UPDATE_INCIDENT_DATA,
    key,
    data,
  };

  return action;
}

function liveScoreAddEditIncident(data) {
  const action = {
    type: ApiConstatnts.API_LIVE_SCORE_ADD_EDIT_INCIDENT_LOAD,
    data,
  };

  return action;
}

function liveScoreIncidentTypeAction() {
  const action = {
    type: ApiConstatnts.API_LIVE_SCORE_INCIDENT_TYPE_LOAD,
  };

  return action;
}

function setPageSizeAction(pageSize) {
  const action = {
    type: ApiConstants.SET_LIVE_SCORE_INCIDENT_LIST_PAGE_SIZE,
    pageSize,
  };

  return action;
}

function setPageNumberAction(pageNum) {
  const action = {
    type: ApiConstants.SET_LIVE_SCORE_INCIDENT_LIST_PAGE_CURRENT_NUMBER,
    pageNum,
  };

  return action;
}

export {
  liveScoreIncidentList,
  liveScoreUpdateIncident,
  liveScoreUpdateIncidentData,
  liveScoreAddEditIncident,
  liveScoreIncidentTypeAction,
  setPageSizeAction,
  setPageNumberAction,
};
