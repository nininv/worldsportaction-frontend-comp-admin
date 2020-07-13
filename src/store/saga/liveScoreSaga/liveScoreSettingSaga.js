import { put, call } from '../../../../node_modules/redux-saga/effects';
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import ApiConstants from '../../../themes/apiConstants';
import { message } from "antd";
import history from "../../../util/history";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";
import { setUmpireCompitionData, getLiveScoreUmpireCompitionData } from '../../../util/sessionStorage'

export function* liveScoreSettingSaga({ payload }) {
    try {

        const result = yield call(LiveScoreAxiosApi.liveScoreSettingView, payload)
        if (result.status === 1) {
            yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_SUCCESS, payload: result.result.data })
        } else {
            yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: result })
            setInterval(() => {
                message.error('Something Went Wrong')
            }, 800)
        }
    } catch (e) {
        yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: e })
        setTimeout(() => {
            message.error('Something Went Wrong')
        }, 800)
    }
}

export function* liveScorePostSaga({ payload }) {
    yield console.log('Sagapayload', payload)
    try {

        const result = yield call(LiveScoreAxiosApi.liveScoreSettingPost, payload)

        // setUmpireCompitionData(JSON.stringify(result.result.data))
        // localStorage.setItem("LiveScoreCompetiton", JSON.stringify(result.result.data))

        if (payload.screenName === 'umpireDashboard') {
            setUmpireCompitionData(JSON.stringify(result.result.data))
        } else {
            localStorage.setItem("LiveScoreCompetiton", JSON.stringify(result.result.data))
            const { id } = JSON.parse(getLiveScoreUmpireCompitionData())
            console.log(payload.competitionId, 'liveScorePostSaga', id)
            if (payload.competitionId === id) {
                setUmpireCompitionData(JSON.stringify(result.result.data))
            }
        }
        if (result.status === 1) {
            yield put({
                type: ApiConstants.LiveScore_SETTING_SUCCESS,
                payload: result.result.data,
                status: result.status,
            });
            message.success('Successfully Updated')
            if (payload.screenName == 'umpireDashboard') {
                history.push('/umpireDashboard')
            } else {
                history.push(payload.settingView && '/liveScoreDashboard')
            }

        } else {

            yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_FAIL, payloads: result })

        }
    } catch (e) {

        yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: e })
    }
}

export function* settingRegInviteesSaga({ payload }) {
    try {

        const result = yield call(CommonAxiosApi.getRegistrationInvitees)
        console.log('saga', result)
        if (result.status === 1) {
            yield put({ type: ApiConstants.SETTING_REGISTRATION_INVITEES_SUCCESS, payload: result.result.data, })
        } else {
            yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, payloads: result })
            setInterval(() => {
                message.error('Something Went Wrong')
            }, 800)
        }
    } catch (e) {
        yield put({ type: ApiConstants.LiveScore_SETTING_VIEW_ERROR, repayloadsult: e })
        setTimeout(() => {
            message.error('Something Went Wrong')
        }, 800)
    }
}