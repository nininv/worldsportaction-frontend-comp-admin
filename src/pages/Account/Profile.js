import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Form, message } from "antd";
import moment from "moment";

import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import { getOrganisationData, setOrganisationData } from "util/sessionStorage";
import {
  userPhotoUpdateAction,
  userDetailUpdateAction,
} from "store/actions/userAction/userAction";
import InputWithHead from "customComponents/InputWithHead";
import Loader from "customComponents/loader";

function Profile(props) {
  const {
    userState,
    userPhotoUpdateAction,
    userDetailUpdateAction,
  } = props;

  const [user, setUser] = useState(userState.userProfile);

  const [form] = Form.useForm();

  useEffect(() => {
    if (userState.userProfile.photoUrl) {
      const orgData = getOrganisationData();
      if (orgData) {
        orgData.photoUrl = userState.userProfile.photoUrl;
        setOrganisationData(orgData);
      }
    }
  }, [userState.userProfile.photoUrl]);

  const onChangeField = useCallback(
    (e) => {
      setUser({
        ...user,
        [e.currentTarget.name]: e.currentTarget.value,
      });
    },
    [user, setUser]
  );

  const handleSubmit = useCallback(
    (values) => {
      form.validateFields().then(values => {
        const { photo, photoUrl, ...restUserProperty } = user;

        const isChangedData =
          user.firstName !== userState.userProfile.firstName ||
          user.lastName !== userState.userProfile.lastName ||
          user.mobileNumber !== userState.userProfile.mobileNumber ||
          user.email !== userState.userProfile.email;

        if (photo && photoUrl) {
          let formData = new FormData();
          formData.append("profile_photo", photo);
          userPhotoUpdateAction(
            formData,
            isChangedData ? restUserProperty : null
          );
        } else if (isChangedData) {
          userDetailUpdateAction(restUserProperty);
        }
      }).catch((err) => console.log('err: ', err));
    },
    [
      form,
      user,
      userState.userProfile,
      userPhotoUpdateAction,
      userDetailUpdateAction,
    ]
  );

  const selectImage = useCallback(() => {
    const fileInput = document.getElementById("user-pic");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "image/*");
    if (!!fileInput) {
      fileInput.click();
    }
  }, []);

  const setImage = useCallback(
    (data) => {
      if (data.files[0] !== undefined) {
        let files_ = data.files[0].type.split("image/");
        let fileType = files_[1];

        if (data.files[0].size > AppConstants.logo_size) {
          message.error(AppConstants.logoImageSize);
          return;
        }

        if (fileType === `jpeg` || fileType === `png` || fileType === `gif`) {
          setUser({
            ...user,
            photoUrl: URL.createObjectURL(data.files[0]),
            photo: data.files[0],
          });
        } else {
          message.error(AppConstants.logoType);
        }
      }
    },
    [user, setUser]
  );

  return (
    <div className="inside-table-view">
      <Form form={form} colon={false} onFinish={handleSubmit}>
        <div className="fluid-width">
          <div className="d-flex justify-content-center">
            <div className="reg-competition-logo-view" onClick={selectImage}>
              <label>
                <img
                  src={user.photoUrl || AppImages.circleImage}
                  alt=""
                  height="120"
                  width="120"
                  style={{ borderRadius: 60 }}
                  onError={(ev) => {
                    ev.target.src = AppImages.circleImage;
                  }}
                />
              </label>
            </div>
            <input
              type="file"
              id="user-pic"
              style={{ display: "none" }}
              onChange={(evt) => setImage(evt.target)}
            />
          </div>

          <InputWithHead
            disabled
            heading={AppConstants.firstName}
            placeholder={AppConstants.enterFirstName}
            readOnly
            value={user.firstName}
          />

          <InputWithHead
            disabled
            heading={AppConstants.lastName}
            placeholder={AppConstants.enterLastName}
            readOnly
            value={user.lastName}
          />

          <InputWithHead
            disabled
            heading={AppConstants.dateOfBirth}
            placeholder={AppConstants.enterDateOfBirth}
            readOnly
            value={
              user.dateOfBirth
                ? moment(user.dateOfBirth).format("DD-MM-YYYY")
                : ""
            }
          />

          <InputWithHead
            required="required-field"
            heading={AppConstants.phoneNumber}
            type="tel"
            name="mobileNumber"
            placeholder={AppConstants.enterPhoneNumber}
            value={user.mobileNumber}
            maxlength={10}
            onChange={onChangeField}
          />

          <InputWithHead
            required="required-field"
            heading={AppConstants.email}
            type="email"
            name="email"
            placeholder={AppConstants.enterEmail}
            value={user.email}
            onChange={onChangeField}
          />
          {userState.userProfile.email !== user.email && (
            <div className="form-field-error">
              {AppConstants.emailChangedWarning}
            </div>
          )}

          <div className="d-flex justify-content-end mt-4">
            <Button
              className="publish-button"
              type="primary"
              htmlType="submit"
            >
              {AppConstants.save}
            </Button>
          </div>
        </div>
      </Form>

      <Loader
        visible={userState.userDetailUpdate || userState.userPhotoUpdate}
      />
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      userPhotoUpdateAction,
      userDetailUpdateAction,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    appState: state.AppState,
    userState: state.UserState,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
