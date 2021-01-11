import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    DatePicker,
    Input,
    Radio,
    Form,
    message
} from "antd";
import moment from 'moment';

import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { userProfileUpdateAction } from '../../store/actions/userAction/userAction'
import ValidationConstants from "../../themes/validationConstant";
import {
    getCommonRefData, countryReferenceAction, nationalityReferenceAction,
    getGenderAction, disabilityReferenceAction, checkVenueDuplication,
    combinedAccreditationUmpieCoachRefrence
} from '../../store/actions/commonAction/commonAction';
import history from '../../util/history'
import Loader from '../../customComponents/loader';
import { getOrganisationData, getUserId } from "../../util/sessionStorage";
import { regexNumberExpression } from '../../util/helpers'
import PlacesAutocomplete from "../competition/elements/PlaceAutoComplete";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

class UserProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            userRegistrationId: '',
            displaySection: "0",
            loadValue: false,
            saveLoad: false,
            tabKey: "3",
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            userData: {
                genderRefId: 0,
                firstName: "",
                lastName: "",
                mobileNumber: "",
                email: "",
                middleName: "",
                dateOfBirth: null,
                street1: "",
                street2: "",
                suburb: "",
                stateRefId: 1,
                postalCode: "",
                statusRefId: 0,
                emergencyFirstName: "",
                emergencyLastName: "",
                emergencyContactNumber: "",
                existingMedicalCondition: "",
                regularMedication: "",
                disabilityCareNumber: '',
                isDisability: 0,
                disabilityTypeRefId: 0,
                countryRefId: null,
                nationalityRefId: null,
                languages: "",
                childrenCheckNumber: "",
                childrenCheckExpiryDate: "",
                parentUserId: 0,
                childUserId: 0,
                accreditationLevelUmpireRefId: null,
                accreditationLevelCoachRefId: null,
                accreditationUmpireExpiryDate: null,
                accreditationCoachExpiryDate: null
            },
            titleLabel: "",
            section: "",
            isSameUserEmailChanged: false,
            hasErrorParticipitant: false,
            hasErrorParent: [],
            hasErrorEmergency: false,
            hasErrorAddressNumber: false,
            venueAddressError: '',
            manualAddress: false
        }
        // this.props.getCommonRefData();
        this.props.countryReferenceAction();
        this.props.nationalityReferenceAction();
        this.props.getGenderAction();
        this.props.disabilityReferenceAction();
        this.formRef = React.createRef();
        this.props.combinedAccreditationUmpieCoachRefrence();
    }

    async componentDidMount() {
        if (this.props.history.location.state) {
            let titleLabel = "";
            let section = ""
            let data = this.props.history.location.state.userData;
            let moduleFrom = this.props.history.location.state.moduleFrom;
            if (moduleFrom === "1") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.address;
                section = "address";
            } else if (moduleFrom === "2") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.parentOrGuardianDetail
                section = "primary";
            } else if (moduleFrom === "3") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.emergencyContacts;
                section = "emergency";
            } else if (moduleFrom === "4") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.otherInformation;
                section = "other";
            } else if (moduleFrom === "5") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.medical;
                section = "medical";
                this.setState({ tabKey: "4" });
                if (data != null) {
                    if (data.disability != null && data.disability.length > 0) {
                        data["isDisability"] = data.disability[0]["isDisability"];
                        data["disabilityTypeRefId"] = data.disability[0]["disabilityTypeRefId"];
                        data["disabilityCareNumber"] = data.disability[0]["disabilityCareNumber"];
                        delete data.disability;
                    }
                }
            } else if (moduleFrom === "6") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.child;
                section = "child";
            } else if (moduleFrom === "7") {
                titleLabel = AppConstants.addChild;
                section = "child";
            }
            else if (moduleFrom === "8") {
                titleLabel = AppConstants.addParent_guardian;
                section = "primary";
            }
            let userDataTemp = this.state.userData;
            if (moduleFrom == 7 || moduleFrom == 8) {
                userDataTemp.userId = data.userId;
            }
            await this.setState({
                displaySection: moduleFrom,
                userData: (moduleFrom != "7" && moduleFrom != "8") ? data : userDataTemp,
                titleLabel: titleLabel, section: section, loadValue: true
            })
        }
    }

    componentDidUpdate(nextProps) {
        if (this.state.loadValue) {
            this.setState({ loadValue: false })
            if (this.state.displaySection === "1") {
                this.setAddressFormFields();
            } else if (this.state.displaySection === "2") {
                this.setPrimaryContactFormFields();
            } else if (this.state.displaySection === "3") {
                this.setEmergencyFormField();
            } else if (this.state.displaySection === "4") {
                this.setOtherInfoFormField();

            } else if (this.state.displaySection === "6") {
                this.setPrimaryContactFormFields();
            }
        }
        let userState = this.props.userState;
        if (userState.onUpUpdateLoad == false && this.state.saveLoad) {
            this.setState({ saveLoad: false })
            if (userState.status === 1) {
                if (this.state.isSameUserEmailChanged) {
                    this.logout();
                } else {
                    history.push({
                        pathname: '/userPersonal',
                        state: { tabKey: this.state.tabKey, userId: this.props.history.location.state.userData.userId }
                    });
                }
            } else if (userState.status === 4) {
                message.config({ duration: 1.5, maxCount: 1, });
                message.error(userState.userProfileUpdate);
            }
        }
    }

    logout = () => {
        try {
            localStorage.clear();
            history.push("/login");
        } catch (error) {
            console.log("Error" + error);
        }
    };

    setAddressFormFields = () => {
        let userData = this.state.userData;
        this.formRef.current.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            dateOfBirth: ((userData.dateOfBirth != null && userData.dateOfBirth != '') ?
                moment(userData.dateOfBirth, "YYYY-MM-DD") : null),
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode,
        })
    }

    setPrimaryContactFormFields = () => {
        let userData = this.state.userData;
        this.formRef.current.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode
        })
    }

    setEmergencyFormField = () => {
        let userData = this.state.userData;
        this.formRef.current.setFieldsValue({
            emergencyFirstName: userData.emergencyFirstName,
            emergencyLastName: userData.emergencyLastName,
            emergencyContactNumber: userData.emergencyContactNumber,
        })
    }

    setOtherInfoFormField = () => {
        let userData = this.state.userData;
        let personalData = this.props.location.state ? this.props.location.state.personalData ? this.props.location.state.personalData : null : null
        if (personalData) {
            userData['accreditationCoachExpiryDate'] = personalData.accreditationCoachExpiryDate
            userData['accreditationLevelCoachRefId'] = personalData.accreditationLevelCoachRefId
            userData['accreditationLevelUmpireRefId'] = personalData.accreditationLevelUmpireRefId
            userData['accreditationUmpireExpiryDate'] = personalData.accreditationUmpireExpiryDate
        }
        this.formRef.current.setFieldsValue({
            genderRefId: userData.genderRefId != null ? parseInt(userData.genderRefId) : 0
        })
    }

    onChangeSetValue = (value, key) => {
        let data = this.state.userData;
        if (key === "isDisability") {
            if (value === 0) {
                data["disabilityCareNumber"] = null;
                data["disabilityTypeRefId"] = null;
            }
        } else if (key === "dateOfBirth") {
            value = (moment(value).format("YYYY-MM-DD"))
        } else if (key === "email" && this.state.section === "address") {
            if (data.userId == getUserId()) {
                this.setState({ isSameUserEmailChanged: true });
            } else {
                this.setState({ isSameUserEmailChanged: false });
            }
        }
        else if (key === "mobileNumber") {
            if (value.length === 10) {
                this.setState({
                    hasErrorAddressNumber: false
                })
                value = regexNumberExpression(value);
            } else if (value.length < 10) {
                this.setState({
                    hasErrorAddressNumber: true
                })
                value = regexNumberExpression(value);
            }
            console.log(regexNumberExpression(value))
            if (regexNumberExpression(value) == undefined) {
                setTimeout(() => {
                    this.formRef.current.setFieldsValue({
                        mobileNumber: this.state.userData.mobileNumber,
                    })
                }, 300);
            }

        }
        else if (key === "emergencyContactNumber") {
            if (value.length === 10) {
                this.setState({
                    hasErrorEmergency: false
                })
                value = regexNumberExpression(value);
            } else if (value.length < 10) {
                this.setState({
                    hasErrorEmergency: true
                })
                value = regexNumberExpression(value);
            }
            console.log(regexNumberExpression(value))
            if (regexNumberExpression(value) == undefined) {
                setTimeout(() => {
                    this.formRef.current.setFieldsValue({
                        emergencyContactNumber: this.state.userData.emergencyContactNumber,
                    })
                }, 300);
            }

        }

        if (key === 'accreditationLevelUmpireRefId') {
            data['accreditationUmpireExpiryDate'] = value == 1 && null
        }

        if (key === 'accreditationLevelCoachRefId') {
            data['accreditationCoachExpiryDate'] = value == 1 && null
        }


        data[key] = value;

        this.setState({ userData: data });
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view d-flex bg-transparent align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {this.state.titleLabel}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    handlePlacesAutocomplete = (data) => {
        const { stateList } = this.props.commonReducerState;
        const address = data;
        let userData = this.state.userData;
        this.props.checkVenueDuplication(address);

        if (!address || !address.addressOne || !address.suburb) {
            this.setState({
                venueAddressError: ValidationConstants.venueAddressDetailsError,
            })
        } else {
            this.setState({
                venueAddressError: ''
            })
        }

        this.setState({
            venueAddress: address,
        });
        const stateRefId = stateList.length > 0 && address.state
            ? stateList.find((state) => state.name === address.state).id
            : null;

        // this.formRef.current.setFieldsValue({
        //     state: address.state,
        //     addressOne: address.addressOne || null,
        //     suburb: address.suburb || null,
        //     postcode: address.postcode || null,
        // });
        if (address) {
            userData['street1'] = address.addressOne
            userData['stateRefId'] = stateRefId
            userData['suburb'] = address.suburb
            userData['postalCode'] = address.postcode
        }
    };

    addressEdit = () => {
        let userData = this.state.userData
        const { stateList } = this.props.commonReducerState;
        let hasErrorAddressNumber = this.state.hasErrorAddressNumber;

        let state = (stateList.length > 0 && userData.stateRefId)
            ? stateList.find((state) => state.id == userData.stateRefId).name
            : null;

        let defaultVenueAddress = null
        if (userData.street1) {
            defaultVenueAddress = `${userData.street1 && `${userData.street1},`
                } ${userData.suburb && `${userData.suburb},`
                } ${state && `${state},`
                } `;
        }

        return (
            <div className="pt-0">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name='firstName' rules={[{ required: true, message: ValidationConstants.firstName }]}>
                            <InputWithHead
                                auto_complete='new-firstName'
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name={'firstName'}
                                value={userData?.firstName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item name='lastName' rules={[{ required: false }]}>
                            <InputWithHead
                                auto_complete='new-lastName'
                                required="required-field"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name={'lastName'}
                                value={userData?.lastName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm">
                        <InputWithHead
                            auto_complete='new-middleName'
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.middleName}
                            placeholder={AppConstants.middleName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "middleName")}
                            value={userData?.middleName}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dob} />
                        <DatePicker
                            // size="large"
                            style={{ width: '100%' }}
                            onChange={e => this.onChangeSetValue(e, "dateOfBirth")}
                            format="DD-MM-YYYY"
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            name="dateOfBirth"
                            value={userData?.dateOfBirth != null && moment(userData.dateOfBirth)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name='mobileNumber' rules={[{ required: true, message: ValidationConstants.contactField }]}
                            help={hasErrorAddressNumber && ValidationConstants.mobileLength}
                            validateStatus={hasErrorAddressNumber ? "error" : 'validating'}
                        >
                            <InputWithHead
                                auto_complete="new-mobileNumber"
                                required="required-field"
                                heading={AppConstants.contactMobile}
                                placeholder={AppConstants.contactMobile}
                                value={userData?.mobileNumber}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                                maxLength={10}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item
                            name='email'
                            rules={[
                                {
                                    required: true, message: ValidationConstants.emailField[0]
                                },
                                {
                                    type: "email",
                                    pattern: new RegExp(AppConstants.emailExp),
                                    message: ValidationConstants.email_validation
                                }
                            ]}
                        >
                            <InputWithHead
                                auto_complete="new-email"
                                required="required-field"
                                heading={AppConstants.contactEmail}
                                placeholder={AppConstants.contactEmail}
                                name={'email'}
                                value={userData?.email}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                            />
                        </Form.Item>
                        {(userData.userId == getUserId() && this.state.isSameUserEmailChanged) && (
                            <div className="same-user-validation">
                                {ValidationConstants.emailField[2]}
                            </div>
                        )}
                    </div>
                </div>


                {
                    !this.state.manualAddress &&
                    <PlacesAutocomplete
                        defaultValue={defaultVenueAddress && `${defaultVenueAddress}Australia`}
                        heading={AppConstants.addressSearch}
                        // required
                        error={this.state.venueAddressError}
                        onSetData={this.handlePlacesAutocomplete}
                    />
                }

                <div
                    className="orange-action-txt" style={{ marginTop: "10px" }}
                    onClick={() => this.setState({ manualAddress: !this.state.manualAddress })}

                >{this.state.manualAddress ? AppConstants.returnAddressSearch : AppConstants.enterAddressManually}
                </div>

                {
                    this.state.manualAddress &&
                    <div className="row">
                        <div className="col-sm" >
                            <InputWithHead
                                auto_complete="new-addressOne"
                                // required="required-field"
                                heading={AppConstants.addressOne}
                                placeholder={AppConstants.addressOne}
                                name={'street1'}
                                value={userData ?.street1}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "street1")}
                            // readOnly
                            />

                        </div>
                        <div className="col-sm" >
                            <InputWithHead
                                auto_complete="new-addressTwo"
                                // style={{ marginTop: 9 }}
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                name={'street2'}
                                value={userData ?.street2}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "street2")}
                            />
                        </div>
                    </div>
                }

                {
                    this.state.manualAddress &&
                    <div className="row">
                        <div className="col-sm" >
                            <InputWithHead
                                // style={{ marginTop: 9 }}
                                heading={AppConstants.suburb}
                                placeholder={AppConstants.suburb}
                                // required="required-field"
                                name={'suburb'}
                                value={userData ?.suburb}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "suburb")}
                            // readOnly
                            />
                        </div>
                        <div className="col-sm">
                            <div >
                                <InputWithHead heading={AppConstants.stateHeading} />
                            </div>
                            <Select
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                placeholder={AppConstants.select}
                                // required="required-field"
                                value={userData ?.stateRefId}
                                name="stateRefId"
                                onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                            // readOnly
                            // disabled
                            >
                                {stateList.map((item) => (
                                    <Option key={'state_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                }
                {
                    this.state.manualAddress &&
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.postCode}
                                placeholder={AppConstants.postCode}
                                name={'postalCode'}
                                value={userData ?.postalCode}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "postalCode")}
                            // readOnly
                            />
                        </div>
                        <div className="col-sm" />
                    </div>
                }
            </div >
        );
    };

    primaryContactEdit = () => {
        let userData = this.state.userData
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name='firstName' rules={[{ required: true, message: ValidationConstants.firstName }]}>
                            <InputWithHead
                                auto_complete="new-firstName"
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name={'firstName'}
                                value={userData.firstName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item name='lastName' rules={[{ required: false }]}>
                            <InputWithHead
                                auto_complete="new-lastName"
                                required="required-field"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name={'lastName'}
                                value={userData.lastName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" >
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            name={'street1'}
                            value={userData.street1}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street1")}
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            name={'street2'}
                            value={userData.street2}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street2")}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" >
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            name={'suburb'}
                            value={userData.suburb}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "suburb")}
                        />
                    </div>
                    <div className="col-sm">
                        <div >
                            <InputWithHead heading={AppConstants.stateHeading} />
                        </div>

                        <Select
                            className="w-100"
                            style={{ paddingRight: 1, minWidth: 182 }}
                            placeholder={AppConstants.select_state}
                            // onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                            value={userData.stateRefId}
                            name="stateRefId"
                            onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                        >
                            {stateList.map((item) => (
                                <Option key={'state_' + item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row">
                    <div className="col-sm" >
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.postCode}
                            placeholder={AppConstants.enterPostCode}
                            name={'postalCode'}
                            value={userData.postalCode}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "postalCode")}
                        />
                    </div>
                    <div className="col-sm">
                        <Form.Item name='email' rules={[{ required: true, message: ValidationConstants.emailField[0] }]}>
                            <InputWithHead
                                auto_complete="new-email"
                                heading={AppConstants.contactEmail}
                                placeholder={AppConstants.contactEmail}
                                name={'email'}
                                value={userData.email}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <Form.Item name='mobileNumber' rules={[{ required: true, message: ValidationConstants.contactField }]}>
                            <InputWithHead
                                auto_complete="new-mobileNumber"
                                heading={AppConstants.contactMobile}
                                placeholder={AppConstants.contactMobile}
                                name={'mobileNumber'}
                                value={userData.mobileNumber}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm" />
                </div>
            </div>
        );
    };

    emergencyContactEdit = () => {
        let userData = this.state.userData
        let hasErrorEmergency = this.state.hasErrorEmergency;
        return (
            <div className="content-view pt-0">
                {/* First and Last name row */}
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <Form.Item name='emergencyFirstName' rules={[{ required: true, message: ValidationConstants.emergencyContactName[0] }]}>
                            <InputWithHead
                                auto_complete="new-emergencyFirstName"
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name={'emergencyFirstName'}
                                value={userData.emergencyFirstName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyFirstName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Form.Item name='emergencyLastName' rules={[{ required: true, message: ValidationConstants.emergencyContactName[1] }]}>
                            <InputWithHead
                                auto_complete="new-emergencyLastName"
                                required="required-field"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name={'emergencyLastName'}
                                value={userData.emergencyLastName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyLastName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Form.Item name='emergencyContactNumber' rules={[{ required: true, message: ValidationConstants.emergencyContactNumber[0] }]}
                            help={hasErrorEmergency && ValidationConstants.mobileLength}
                            validateStatus={hasErrorEmergency ? "error" : 'validating'}
                        >
                            <InputWithHead
                                auto_complete="new-emergencyContactName"
                                required="required-field"
                                heading={AppConstants.emergencyContactMobile}
                                placeholder={AppConstants.emergencyContactMobile}
                                name={'emergencyContactNumber'}
                                maxLength={10}
                                value={userData.emergencyContactNumber}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyContactNumber")}
                            />
                        </Form.Item>
                    </div>
                </div>
            </div>
        );
    };

    otherInfoEdit = () => {
        let userData = this.state.userData
        const { countryList, nationalityList, genderData, accreditationUmpireList, umpireAccreditation, coachAccreditation } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm">
                        <div style={{ paddingTop: 11, paddingBottom: 10 }}>
                            <InputWithHead heading={AppConstants.gender} required="required-field" />
                            <Form.Item name='genderRefId' rules={[{ required: true, message: ValidationConstants.genderField }]}>
                                <Radio.Group
                                    className="reg-competition-radio"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "genderRefId")}
                                    value={userData.genderRefId}
                                >
                                    {(genderData || []).map((gender) => (
                                        <Radio key={'gender_' + gender.id} value={gender.id}>
                                            {gender.description}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        </div>

                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelUmpire} required={"required-field"} />
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetValue(e.target.value, "accreditationLevelUmpireRefId")}
                                value={userData.accreditationLevelUmpireRefId}
                            >
                                {(umpireAccreditation || []).map((accreditaiton, accreditationIndex) => (
                                    <Radio style={{ marginBottom: "10px" }} key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                ))}
                            </Radio.Group>

                            {(userData.accreditationLevelUmpireRefId != 1 && userData.accreditationLevelUmpireRefId != null) && (
                                <DatePicker
                                    size="large"
                                    placeholder={AppConstants.expiryDate}
                                    style={{ width: "100%", marginTop: "20px" }}
                                    onChange={(e, f) => this.onChangeSetValue((moment(e).format("YYYY-MM-DD")), "accreditationUmpireExpiryDate")}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={userData.accreditationUmpireExpiryDate && moment(userData.accreditationUmpireExpiryDate)}
                                />
                            )}
                        </div>

                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach} required={"required-field"} />
                            <Radio.Group
                                style={{ display: "flex", flexDirection: "column" }}
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetValue(e.target.value, "accreditationLevelCoachRefId")}
                                value={userData.accreditationLevelCoachRefId}
                            >
                                {(coachAccreditation || []).map((accreditaiton, accreditationIndex) => (
                                    <Radio style={{ marginBottom: "10px" }} key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                ))}
                            </Radio.Group>

                            {(userData.accreditationLevelCoachRefId != 1 && userData.accreditationLevelCoachRefId != null) && (
                                <DatePicker
                                    size="large"
                                    placeholder={AppConstants.expiryDate}
                                    style={{ width: "100%", marginTop: "20px" }}
                                    onChange={(e, f) => this.onChangeSetValue((moment(e).format("YYYY-MM-DD")), "accreditationCoachExpiryDate")}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={userData.accreditationCoachExpiryDate && moment(userData.accreditationCoachExpiryDate)}
                                />
                            )}
                        </div>

                    </div>
                </div>
                {userData.userRegistrationId != null && (
                    <div>
                        <div className="row">
                            <div className="col-sm">
                                <div style={{ paddingTop: 11, paddingBottom: 10 }}>
                                    <InputWithHead heading={AppConstants.childCountry} />
                                </div>
                                <Select
                                    className="w-100"
                                    placeholder={AppConstants.childCountry}
                                    onChange={(e) => this.onChangeSetValue(e, "countryRefId")}
                                    value={userData.countryRefId}
                                    name="countryRefId"
                                >
                                    {countryList.map((country) => (
                                        <Option key={'country_' + country.id} value={country.id}>
                                            {country.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        {/*
                        <div className="row">
                            <div className="col-sm">
                                <div style={{paddingTop: 11, paddingBottom: 10}}>
                                    <InputWithHead heading={AppConstants.nationalityReference} />
                                </div>
                                <Select
                                    className="w-100"
                                    placeholder={AppConstants.nationalityReference}
                                    onChange={(e) => {this.onChangeSetValue(e, "nationalityRefId")}}
                                    value={userData.nationalityRefId}
                                    name="nationalityRefId"
                                >
                                    {nationalityList.map((nation) => (
                                        <Option key={'nationality_' + nation.id} value={nation.id}>
                                            {nation.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    heading={AppConstants.childLangSpoken}
                                    placeholder={AppConstants.childLangSpoken}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "languages")}
                                    value={userData.languages}
                                    name={'languages'}
                                />
                            </div>
                        </div>
                        */}
                    </div>
                )}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            heading={AppConstants.childrenNumber}
                            placeholder={AppConstants.childrenNumber}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "childrenCheckNumber")}
                            value={userData.childrenCheckNumber}
                            name={'childrenCheckNumber'}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.checkExpiryDate} />
                        <DatePicker
                            // size="large"
                            style={{ width: '100%', marginTop: 9, minHeight: 50 }}
                            onChange={e => this.onChangeSetValue(e, "childrenCheckExpiryDate")}
                            format="DD-MM-YYYY"
                            showTime={false}
                            value={userData.childrenCheckExpiryDate !== null && moment(userData.childrenCheckExpiryDate)}
                            placeholder="dd-mm-yyyy"
                            name={'childrenCheckExpiryDate'}
                        />
                    </div>
                </div>
            </div>
        );
    };

    medicalEdit = () => {
        let userData = this.state.userData
        let { disabilityList } = this.props.commonReducerState;

        return (
            <div className="formView pt-5" style={{ paddingBottom: "40px" }}>
                {/* <span className="form-heading"> {AppConstants.additionalInfoReqd} </span>    */}
                <InputWithHead heading={AppConstants.existingMedConditions} />
                <TextArea
                    placeholder={AppConstants.existingMedConditions}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "existingMedicalCondition")}
                    value={userData.existingMedicalCondition}
                    allowClear
                />

                <InputWithHead heading={AppConstants.regularMedicalConditions} />
                <TextArea
                    placeholder={AppConstants.regularMedicalConditions}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "regularMedication")}
                    value={userData.regularMedication}
                    allowClear
                />

                <div>
                    <InputWithHead heading={AppConstants.haveDisability} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.onChangeSetValue(e.target.value, "isDisability")}
                        value={userData.isDisability}
                    >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        {userData.isDisability == 1 && (
                            <div style={{ marginLeft: 25 }}>
                                <InputWithHead
                                    auto_complete='new-disabilityCareNumber'
                                    heading={AppConstants.disabilityCareNumber}
                                    placeholder={AppConstants.disabilityCareNumber}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityCareNumber")}
                                    value={userData.disabilityCareNumber}
                                />
                                <InputWithHead heading={AppConstants.typeOfDisability} />
                                <Radio.Group
                                    className="reg-competition-radio"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityTypeRefId")}
                                    value={userData.disabilityTypeRefId}
                                >
                                    {(disabilityList || []).map((dis) => (
                                        <Radio key={'disabilityType_' + dis.id} value={dis.id}>{dis.description}</Radio>
                                    ))}
                                </Radio.Group>
                            </div>
                        )}
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    }

    addParentOrChild = () => {
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name='firstName' rules={[{ required: true, message: ValidationConstants.firstName }]}>
                            <InputWithHead
                                auto_complete="new-firstName"
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name={'firstName'}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item name='lastName' rules={[{ required: false }]}>
                            <InputWithHead
                                auto_complete="new-lastName"
                                required="required-field"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name={'lastName'}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name='email' rules={[{ required: true, message: ValidationConstants.emailField[0] }]}>
                            <InputWithHead
                                auto_complete="new-email"
                                heading={AppConstants.emailAdd}
                                placeholder={AppConstants.emailAdd}
                                name={'email'}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dob} />
                        <DatePicker
                            // size="large"
                            style={{ width: '100%' }}
                            onChange={e => this.onChangeSetValue(e, "dateOfBirth")}
                            format="DD-MM-YYYY"
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            name={'dateOfBirth'}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <Form.Item name='mobileNumber' rules={[{ required: true, message: ValidationConstants.contactField }]}>
                            <InputWithHead
                                auto_complete="new-mobileNumber"
                                heading={AppConstants.contactMobile}
                                placeholder={AppConstants.contactMobile}
                                name={'mobileNumber'}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                            />
                        </Form.Item>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        const { displaySection } = this.state;
        return (
            <div className="content-view pt-0">
                {(displaySection === "1" || displaySection === "2" || displaySection === "6" || displaySection === "7" || displaySection === "8") && <div>{this.addressEdit()}</div>}
                {/* {(displaySection === "2" ) && <div>{this.primaryContactEdit()}</div>} */}
                {displaySection === "3" && <div>{this.emergencyContactEdit()}</div>}
                {displaySection === "4" && <div>{this.otherInfoEdit()}</div>}
                {displaySection === "5" && <div>{this.medicalEdit()}</div>}
                {/* {(displaySection === "7" || displaySection === "8") && <div>{this.addParentOrChild()}</div>} */}
            </div>
        );
    };

    onSaveClick = (e) => {
        let data = this.state.userData;
        data["section"] = this.state.section;
        data["organisationId"] = this.state.organisationId;

        if (this.state.venueAddressError) {
            message.config({ duration: 1.5, maxCount: 1, });
            message.error(this.state.venueAddressError);
            return;
        }


        if (this.state.displaySection == 8 && !data.parentUserId) {
            data["parentUserId"] = 0;
        }
        else if (this.state.displaySection == 7 && !data.childUserId) {
            data["childUserId"] = 0;
        }
        if (this.state.hasErrorAddressNumber == true || this.state.hasErrorEmergency == true) {
            return false;
        }
        this.props.userProfileUpdateAction(data);
        this.setState({ saveLoad: true });
    }

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to={{ pathname: `/userPersonal`, state: { tabKey: this.state.tabKey, userId: this.props.history.location.state.userData.userId } }}>
                                    <Button type="cancel-button">{AppConstants.cancel}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Form.Item>
                                    <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                        {AppConstants.save}
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} onMenuHeadingClick={() => history.push("./userTextualDashboard")} />
                <InnerHorizontalMenu menu="user" userSelectedKey="5" />
                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onSaveClick}
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView">{this.contentView()}</div>
                            <Loader visible={this.props.userState.onUpUpdateLoad || this.props.commonReducerState.onLoad} />
                        </Content>

                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        userProfileUpdateAction,
        getCommonRefData,
        countryReferenceAction,
        nationalityReferenceAction,
        getGenderAction,
        disabilityReferenceAction,
        checkVenueDuplication,
        combinedAccreditationUmpieCoachRefrence
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        userState: state.UserState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit);
