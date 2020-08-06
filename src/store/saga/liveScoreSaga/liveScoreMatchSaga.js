import { message } from "antd";
import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import CommonAxiosApi from "../../http/commonHttp/commonAxios"
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_CREATE_MATCH_FAIL,
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
        type: ApiConstants.API_LIVE_SCORE_CREATE_MATCH_ERROR,
        error: error,
        status: error.status
    });


    if (error.status == 400) {

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

////Match List
export function* liveScoreMatchListSaga(action) {
    try {
        const result = yield call(
            LiveScoreAxiosApi.liveScoreMatchList,
            action.competitionID,
            action.start,
            action.offset,
            action.search,
            action.divisionId,
            action.roundName,
            action.teamIds,
            action.sortBy,
            action.sortOrder,
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_MATCH_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

////Add Match
export function* liveScoreAddMatchSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreAddEditMatch, action.matchId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_MATCH_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

////Add Match
export function* liveScoreCreateMatchSaga(action) {
    try {
        const result = yield call(
            LiveScoreAxiosApi.liveScoreCreateMatch,
            action.data,
            action.competitionId,
            action.key,
            action.isEdit,
            action.team1resultId,
            action.team2resultId,
            action.matchStatus,
            action.endTime,
            action.umpireArr,
            action.scorerData,
            action.recordUmpireType
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_CREATE_MATCH_SUCCESS,
                result: result.result.data,
                status: result.status,
            });

            if (action.umpireKey) {
                history.push({
                    pathname: '/umpireDashboard'
                })
            } else {
                history.push(action.key === 'dashboard' ? 'liveScoreDashboard' : action.key === 'umpireRoaster' ? 'umpireRoaster' : '/liveScoreMatches')
            }

            message.success(action.data.id === 0 ? 'Match has been created Successfully.' : 'Match has been updated Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

////Delete Match
export function* liveScoreDeleteMatchSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreDeleteMatch, action.matchId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_DELETE_MATCH_SUCCESS,
                status: result.status,
            });
            history.push('/liveScoreMatches')
            message.success('Match Deleted Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

////Delete Match
export function* liveScoreCompetitionVenuesList(action) {
    try {
        const result = yield call(CommonAxiosApi.getVenueList, action.competitionID, action.searchValue);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_COMPETITION_VENUES_LIST_SUCCESS,
                status: result.status,
                venues: result.result.data,
                payload: result.result.data
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

////Match Import
export function* liveScoreMatchImportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreMatchImport, action.competitionId, action.csvFile);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_SUCCESS,
            });
            history.push('/liveScoreMatches')
            message.success('Match Imported Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreMatchSaga({ payload, isLineup }) {
    try {
        const result = yield call(LiveScoreAxiosApi.livescoreMatchDetails, payload, isLineup)
        if (result.status === 1) {
            yield put({ type: ApiConstants.API_GET_LIVESCOREMATCH_DETAIL_SUCCESS, payload: result.result.data })
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreClubListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreClubList, action.competitionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_CLUB_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* playerLineUpStatusChnage(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.playerLineUpApi, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_CHNAGE_LINEUP_STATUS_SUCCESS,
                result: result.result.data,
                status: result.status,
                index: action.data.index,
                key: action.data.key,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* bulkScoreChange(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.bulkScoreChangeApi, action.data)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.BULK_SCORE_UPDATE_SUCCESS,
                result: result.result.data,
                status: result.status
            })
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}
