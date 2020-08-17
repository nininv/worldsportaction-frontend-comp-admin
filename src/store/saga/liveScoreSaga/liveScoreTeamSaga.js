import { put, call, takeEvery } from "redux-saga/effects"
import { message } from "antd";

import AppConstants from "../../../themes/appConstants";
import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import { receiptImportResult } from "../../../util/showMsgOfImportRes";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";

function* failSaga(result) {
  yield put({
    type: ApiConstants.API_LIVE_SCORE_TEAM_FAIL,
    error: result,
    status: result.status
  });

  let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
  message.config({
    duration: 1.5,
    maxCount: 1,
  });
  message.error(msg);
}

function* errorSaga(error) {
  yield put({
    type: ApiConstants.API_LIVE_SCORE_TEAM_ERROR,
    error: error,
    status: error.status
  });

  if (error.status === 400) {
    message.config({
      duration: 1.5,
      maxCount: 1,
    });
    message.error((error && error.error) ? error.error : AppConstants.somethingWentWrong);
  } else {
    message.config({
      duration: 1.5,
      maxCount: 1,
    });
    message.error(AppConstants.somethingWentWrong);
  }
}

function* liveScoreTeamSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreTeam, action.competitionID, action.divisionId);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Team View Player List Saga
function* liveScoreTeamViewPlayerListSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreTeamViewPlayerList, action.teamId);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_TEAM_VIEW_PLAYER_LIST_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Delete Team Saga
function* liveScoreDeleteTeamSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreDeleteTeam, action.teamId);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_DELETE_TEAM_SUCCESS,
        status: result.status,
      });

      history.push('/liveScoreTeam');

      message.success('Team Deleted Successfully.');
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

function* liveScoreTeamDivisionSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreGetDivision, action.payload);

    if (result.status === 1) {
      yield put({ type: ApiConstants.GET_DIVISION_SUCCESS, payload: result.result.data });
    } else {
      yield call(failSaga, result);
    }
  } catch (e) {
    yield call(errorSaga, e);
  }
}

function* liveScoreAffiliateSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreGetAffilate, action.payload);

    if (result.status === 1) {
      yield put({ type: ApiConstants.GET_AFFILATE_SUCCESS, payload: result.result.data });
    } else {
      yield call(failSaga, result);
    }
  } catch (e) {
    yield call(errorSaga, e);
  }
}

function* addTeamLiveScoreSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreAddNewTeam, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_ADD_TEAM_SUCCESS,
      });

      message.success(action.teamId ? 'Team has been updated Successfully' : 'Team has been created Successfully.');

      history.push(action.key ? 'liveScoreDashboard' : '/liveScoreTeam');
    } else {
      yield call(failSaga, result);
    }
  } catch (e) {
    yield call(errorSaga, e);
  }
}

function* liveScoreTeamImportSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreTeamImport, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_TEAM_IMPORT_SUCCESS
      });

      history.push('/liveScoreTeam');

      receiptImportResult(result.result);

      message.success('Team Imported Successfully.');
    } else {
      yield call(failSaga, result);
    }
  } catch (e) {
    yield call(errorSaga, e);
  }
}

function* liveScoreGetTeamSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreGetTeamData, action.teamId);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_GET_TEAM_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Team list with paging
function* liveScoreTeamPagingSaga(action) {
  try {
    const result = yield call(LiveScoreAxiosApi.getTeamWithPagging, action.competitionID, action.offset, action.limit, action.search);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LIVE_SCORE_TEAM_WITH_PAGGING_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

export default function* rootLiveScoreTeamSaga() {
  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_LOAD, liveScoreTeamSaga);
  yield takeEvery(ApiConstants.API_GET_TEAM_VIEW_PLAYER_LIST_LOAD, liveScoreTeamViewPlayerListSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_DELETE_TEAM_LOAD, liveScoreDeleteTeamSaga);
  yield takeEvery(ApiConstants.GET_DIVISION_TEAM, liveScoreTeamDivisionSaga);
  yield takeEvery(ApiConstants.GET_AFFILATE_TEAM, liveScoreAffiliateSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ADD_TEAM_LOAD, addTeamLiveScoreSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_IMPORT_LOAD, liveScoreTeamImportSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_GET_TEAM_LOAD, liveScoreGetTeamSaga);
  yield takeEvery(ApiConstants.API_LIVE_SCORE_TEAM_WITH_PAGGING_LOAD, liveScoreTeamPagingSaga);
}
