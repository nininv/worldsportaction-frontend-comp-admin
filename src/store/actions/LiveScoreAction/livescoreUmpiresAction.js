import ApiConstants from 'themes/apiConstants';

function liveScoreUmpiresListAction(competitionId, body) {
  return {
    type: ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_LOAD,
    competitionId,
    body,
  };
}

function liveScoreUmpireImportAction(payload) {
  return {
    type: ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_LOAD,
    payload,
  };
}

function liveScoreUmpireResetImportResultAction() {
  return {
    type: ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_RESET,
  };
}

export {
  liveScoreUmpiresListAction,
  liveScoreUmpireImportAction,
  liveScoreUmpireResetImportResultAction,
};
