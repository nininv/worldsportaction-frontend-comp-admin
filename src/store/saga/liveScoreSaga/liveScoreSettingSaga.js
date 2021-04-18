import { put, call } from 'redux-saga/effects';
import LiveScoreAxiosApi from '../../http/liveScoreHttp/liveScoreAxiosApi';
import ApiConstants from '../../../themes/apiConstants';
import { message } from 'antd';
import history from '../../../util/history';
import CommonAxiosApi from '../../http/commonHttp/commonAxiosApi';
import {
  setUmpireCompitionData,
  getLiveScoreUmpireCompitionData,
  setLiveScoreUmpireCompition,
  setLiveScoreUmpireCompitionData,
} from '../../../util/sessionStorage';

export function* liveScoreSettingSaga({ payload }) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreSettingView, payload);

    if (result.status === 1) {
      yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_SUCCESS, payload: result.result.data });
    } else {
      yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: result });
      setTimeout(() => {
        message.error(result);
      }, 800);
    }
  } catch (e) {
    yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: e });
    setTimeout(() => {
      message.error('Something Went Wrong');
    }, 800);
  }
}

export function* liveScorePostSaga({ payload }) {
  try {
    const result = yield call(LiveScoreAxiosApi.liveScoreSettingPost, payload);

    if (payload.screenName === 'umpireDashboard') {
      setUmpireCompitionData(JSON.stringify(result.result.data));
    } else {
      localStorage.setItem('LiveScoreCompetition', JSON.stringify(result.result.data));
      if (getLiveScoreUmpireCompitionData()) {
        const { id } = JSON.parse(getLiveScoreUmpireCompitionData());
        if (payload.competitionId === id) {
          setLiveScoreUmpireCompition(result.result.data.id);
          setUmpireCompitionData(JSON.stringify(result.result.data));
        }
      } else {
        setLiveScoreUmpireCompition(result.result.data.id);
        setLiveScoreUmpireCompitionData(JSON.stringify(result.result.data));
      }
    }

    if (result.status === 1) {
      yield put({
        type: ApiConstants.LiveScore_SETTING_SUCCESS,
        payload: result.result.data,
        status: result.status,
      });
      message.success(payload.isEdit === 'edit' ? 'Successfully Updated' : 'Successfully Saved');

      if (payload.screenName === 'umpireDashboard') {
        history.push('/umpireDashboard');
      } else {
        history.push(payload.settingView && '/matchDayDashboard');
      }
    } else {
      yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_FAIL, payloads: result });
      let msg = result.result.data.message ? result.result.data.message : "'Something Went Wrong'";
      setTimeout(() => {
        message.error(msg);
      }, 800);
    }
  } catch (e) {
    yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: e });
  }
}

export function* settingRegInviteesSaga({ payload }) {
  try {
    const result = yield call(CommonAxiosApi.getRegistrationInvitees);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.SETTING_REGISTRATION_INVITEES_SUCCESS,
        payload: result.result.data,
      });
    } else {
      yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: result });
      setTimeout(() => {
        message.error('Something Went Wrong');
      }, 800);
    }
  } catch (e) {
    yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, repayloadsult: e });
    setTimeout(() => {
      message.error('Something Went Wrong');
    }, 800);
  }
}
