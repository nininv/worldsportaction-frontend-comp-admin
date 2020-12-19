import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxiosApi";
import { message } from "antd";
import history from "../../../util/history";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
  console.log("failSaga", result.result.data.message)
  yield put({
    type: ApiConstants.API_REGISTRATION_FAIL,
    error: result,
    status: result.status
  });
  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error(result.result.data.message);
  }, 800);
}

function* errorSaga(error) {
  console.log("errorSaga", error)
  yield put({
    type: ApiConstants.API_REGISTRATION_ERROR,
    error: error,
    status: error.status
  });

  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error(AppConstants.somethingWentWrong);
  }, 800);
}

//////get the membership fee list in registration
export function* regMembershipFeeListSaga(action) {
  try {
    const result = yield call(AxiosApi.registrationMembershipFeeList, action.offset, action.yearRefId, action.sortBy, action.sortOrder);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_MEMBERSHIP_LIST_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}


//////delete the membership list product
export function* regMembershipFeeListDeleteSaga(action) {
  try {
    const result = yield call(
      AxiosApi.registrationMembershipFeeListDelete,
      action
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_MEMBERSHIP_LIST_DELETE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
      message.success(result.result.data.message);
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

//////get the membership  product details
export function* regGetMembershipProductDetailSaga(action) {
  try {
    const result = yield call(AxiosApi.regGetMembershipProductDetails, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_GET_MEMBERSHIP_PRODUCT_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

//////save the membership  product details
export function* regSaveMembershipProductDetailSaga(action) {
  try {
    const result = yield call(
      AxiosApi.regSaveMembershipProductDetails,
      action.payload
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_SUCCESS,
        result: result.result.data,
        status: result.status
      });
      message.success(result.result.data.message);
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

/////get registration from
export function* getRegistrationFormSaga(action) {
  try {
    const result = yield call(
      AxiosApi.getRegistrationForm,
      action.yearId,
      action.competitionId
    );
    if (result.status === 1) {
      const resultMembershipProduct = yield call(
        AxiosApi.getMembershipProductList,
        action.competitionId
      );
      yield put({
        type: ApiConstants.API_GET_REG_FORM_SUCCESS,
        result: result.result.data,
        MembershipProductList:
          resultMembershipProduct.result.status === 200
            ? resultMembershipProduct.result.data
            : [],
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}
///////////get the default membership  product types in registartion membership fees
export function* regDefaultMembershipProductTypesSaga(action) {
  try {
    const result = yield call(
      AxiosApi.regDefaultMembershipProductTypes,
      action
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_GET_DEFAULT_MEMBERSHIP_PRODUCT_TYPES_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

//////save the membership  product fees
export function* regSaveMembershipProductFeeSaga(action) {
  try {
    const result = yield call(
      AxiosApi.regSaveMembershipProductFee,
      action.payload
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_FEES_SUCCESS,
        result: result.result.data,
        status: result.status
      });
      message.success(result.result.data.message);
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

//////save the membership  product discount
export function* regSaveMembershipProductDiscountSaga(action) {
  try {
    const result = yield call(
      AxiosApi.regSaveMembershipProductDiscount,
      action.payload
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_DISCOUNT_SUCCESS,
        result: result.result.data,
        status: result.status
      });
      message.success(result.result.data.message);
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

/////get the membership product discount Types
export function* membershipProductDiscountTypeSaga(action) {
  try {
    const result = yield call(AxiosApi.membershipProductDiscountTypes, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}
//////save the save reg from
export function* regSaveRegistrationForm(action) {
  try {
    const result = yield call(AxiosApi.regSaveRegistrationForm, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_FORM_SUCCESS,
        result: result.result.data,
        status: result.status,
        payload: action.payload
      });
      history.push("/registrationFormList")
      message.success(result.result.data.message);
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

export function* getMembershipproduct(action) {
  try {
    const result = yield call(
      AxiosApi.getMembershipProductList,
      action.competition
    );
    if (result.status === 1) {

      yield put({
        type: ApiConstants.API_REG_FORM_MEMBERSHIP_PRODUCT_SUCCESS,
        MembershipProductList: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

//////get the divisions list on the basis of year and competition
export function* getDivisionsListSaga(action) {
  try {
    const result = yield call(AxiosApi.getDivisionsList, action.yearRefId, action.competitionId, action.sourceModule);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_DIVISIONS_LIST_ON_YEAR_AND_COMPETITION_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

export function* getTeamRegistrationsSaga(action) {
  try {
    const result = yield call(AxiosApi.getTeamRegistrations,action.payload, action.sortBy, action.sortOrder);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_TEAM_REGISTRATIONS_DATA_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

export function* exportTeamRegistrationsSaga(action) {
  try {
    const result = yield call(AxiosApi.exportTeamRegistrations,action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_EXPORT_TEAM_REGISTRATIONS_DATA_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

export function* getMembershipFeeCapListSaga(action) {
  try {
    const result = yield call(AxiosApi.getMembershipFeeCapList,action.organisationUniqueKey,action.yearRefId);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_MEMBERSHIP_FEE_CAP_LIST_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}

export function* updateMembershipFeeCapSaga(action) {
  try {
    const result = yield call(AxiosApi.updateMembershipFeeCap,action.organisationUniqueKey,action.yearRefId,action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_UPDATE_MEMBERSHIP_FEE_CAP_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result)
    }
  } catch (error) {
    yield call(errorSaga, error)
  }
}