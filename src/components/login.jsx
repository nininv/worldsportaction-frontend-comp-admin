import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Layout, Button, Form } from "antd";

import InputWithHead from "../customComponents/InputWithHead";
import { loginAction, qrSubmitAction } from "../store/actions/authentication";
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import AppImages from "../themes/appImages";
import Loader from "../customComponents/loader";

const { Content } = Layout;
const loginFormSchema = Yup.object().shape({
  userName: Yup.string().min(2, 'Username must be at least 2 characters').required('Username is required'),
  password: Yup.string().min(5, 'Too Short!').required('Password is required')
});

class Login extends Component {
  state = {
    code: '',
  }

  componentDidMount() {
    if (localStorage.token != null) {
      history.push("/")
    }
  }

  onChangeCode = (e) => {
    this.setState({
      code: e.target.value,
    });
  }

  contentView = (values, errors, setFieldValue, touched, handleChange, handleBlur) => {
    return (
      <div className="content-view">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={AppImages.netballLogo1} alt=""/>
        </div>

        <InputWithHead
          heading={AppConstants.username}
          placeholder={AppConstants.username}
          name={"userName"}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.userName}
        />
        {errors.userName && touched.userName && (
          <span className="form-err">{errors.userName}</span>
        )}

        <InputWithHead
          heading={AppConstants.password}
          placeholder={AppConstants.password}
          name={"password"}
          onChange={handleChange}
          onBlur={handleBlur}
          type={"password"}
          value={values.password}
        />
        {errors.password && touched.password && (
          <span className="form-err">{errors.password}</span>
        )}

        <NavLink to={{ pathname: `/forgotPassword`, state: { email: values.userName } }}>
          <span className="forgot-password-link-text">{AppConstants.forgotResetPassword}</span>
        </NavLink>

        <div className="row pt-5">
          <div className="col-sm">
            <div className="comp-finals-button-view">
              <Button
                className="open-reg-button"
                htmlType="submit"
                type="primary"
                disabled={this.props.loginState.onLoad}
              >
                {AppConstants.login}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  submitCode = () => {
    const { code } = this.state;
    const { loginState, qrSubmitAction } = this.props;

    qrSubmitAction({
      code,
      userName: loginState.result.userName,
      password: loginState.result.password,
    });
  }

  render() {
    const { code } = this.state;
    const { loginState, loginAction } = this.props;

    return (
      <div className="fluid-width">
        <img src={AppImages.loginImage} className="bg" alt=""/>

        <Layout>
          <Content className="container" style={{ zIndex: 15 }}>
            {!loginState.result ? (
              <Formik
                enableReinitialize
                initialValues={{
                  userName: "",
                  password: "",
                }}
                validationSchema={loginFormSchema}
                onSubmit={(values) => {
                  if (!loginState.onLoad) {
                    loginAction(values);
                  }
                }}
              >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                  }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="auth-form" style={{ zIndex: 15 }}>
                      {this.contentView(values, errors, setFieldValue, touched, handleChange, handleBlur)}
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="auth-form" style={{ fontSize: 14, textAlign: 'center', zIndex: 15 }}>
                {!loginState.result.tfaEnabled && loginState.result.qrCode && (
                  <>
                    <img src={loginState.result.qrCode} alt="" />

                    <p>Scan QR code with your authenticator.</p>
                  </>
                )}

                <div className="qr-code-form">
                  <InputWithHead
                    type="number"
                    heading={AppConstants.qrCodeHeader}
                    placeholder={AppConstants.qrCodeHeader}
                    onChange={this.onChangeCode}
                    value={code}
                  />

                  <Button
                    className="open-reg-button"
                    type="primary"
                    disabled={code.length !== 6 || loginState.onLoad}
                    onClick={this.submitCode}
                  >
                    {AppConstants.submit}
                  </Button>
                </div>
              </div>
            )}

            <Loader visible={loginState.onLoad}/>
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginAction, qrSubmitAction }, dispatch);
}

function mapStateToProps(state) {
  return {
    loginState: state.LoginState
  }
}

export default connect(mapStateToProps, mapDispatchToProps)((Login));
