import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Table,
    Radio,
    Tabs,
    Form,
    Modal,
    message,
    Tooltip
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import { captializedString } from "../../util/helpers"
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getAllCompetitionFeesDeatilsAction,
    saveCompetitionFeesDetailsAction,
    getDefaultCompFeesMembershipProductTabAction,
    saveCompetitionFeesDivisionAction,
    divisionTableDataOnchangeAction,
    addRemoveDivisionAction,
    paymentFeeDeafault,
    paymentSeasonalFee,
    add_editcompetitionFeeDeatils,
    competitionDiscountTypesAction,
    regCompetitionListDeleteAction,
    getDefaultCharity,
    getDefaultCompFeesLogoAction,
    clearCompReducerDataAction,
    removeCompetitionDivisionAction
} from "../../store/actions/registrationAction/competitionFeeAction";
import {
    competitionFeeInit, getVenuesTypeAction,
    getCommonDiscountTypeTypeAction, getOnlyYearListAction,
    clearFilter, searchVenueList, CLEAR_OWN_COMPETITION_DATA
} from "../../store/actions/appAction";
import moment from "moment";
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import { NavLink } from "react-router-dom";
import Loader from '../../customComponents/loader';
import { venueListAction } from '../../store/actions/commonAction/commonAction'
import { getOrganisationData } from "../../util/sessionStorage"
import { fixtureTemplateRoundsAction } from '../../store/actions/competitionModuleAction/competitionDashboardAction';
import AppUniqueId from "../../themes/appUniqueId";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;
let this_Obj = null;

const permissionObject = {
    compDetailDisable: false,
    regInviteesDisable: false,
    membershipDisable: false,
    divisionsDisable: false,
    feesTableDisable: false,
    paymentsDisable: false,
    discountsDisable: false,
    allDisable: false,
    isPublished: false
}

class RegistrationCompetitionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "NETSETGO",
            division: "Division",
            sourceModule: "COMP",
            competitionTabKey: "1",
            profileImage: null,
            image: null,
            loading: false,
            getDataLoading: false,
            statusRefId: 1,
            visible: false,
            buttonPressed: "next",
            logoIsDefault: false,
            logoSetDefault: false,
            isSetDefaul: false,
            competitionIsUsed: false,
            organisationTypeRefId: 0,
            isCreatorEdit: false, //////// user is owner of the competition than isCreatorEdit will be false
            isPublished: false,
            isRegClosed: false,
            permissionState: permissionObject,
            tooltipVisibleDelete: false,
            tooltipVisibleDraft: false,
            tooltipVisiblePublish: false,
            deleteDivModalVisible: false,
            competitionDivisionId: null,
            deleteLoading: false,
            divisionTable: [
                {
                    title: "Division Name",
                    dataIndex: "divisionName",
                    key: "divisionName",
                    render: (divisionName, record, index) => {
                        return (
                            <Form.Item
                                name={`divisionName${record.parentIndex}${index}`}
                                rules={[{ required: true, message: ValidationConstants.divisionName }]}
                            >
                                <Input
                                    className="input-inside-table-fees"
                                    required="required-field pt-0 pb-0"
                                    value={divisionName}
                                    onChange={e => this.divisionTableDataOnchange(e.target.value, record, index, "divisionName")}
                                    disabled={this.state.permissionState.divisionsDisable}
                                />
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Gender Restriction",
                    dataIndex: "genderRestriction",
                    key: AppUniqueId.div_gender_chkbox,
                    render: (genderRestriction, record, index) => (
                        <div>
                            <Checkbox
                                className="single-checkbox mt-1"
                                disabled={this.state.permissionState.divisionsDisable}
                                checked={genderRestriction}
                                onChange={e => this.divisionTableDataOnchange(e.target.checked, record, index, "genderRestriction")}
                            />
                        </div>
                    )
                },
                {
                    dataIndex: "genderRefId",
                    key: AppUniqueId.div_gender_refid,
                    render: (genderRefId, record, index) => {
                        return record.genderRestriction && (
                            <Form.Item
                                name={`genderRefId${record.parentIndex}${index}`}
                                rules={[{ required: true, message: ValidationConstants.genderRestriction }]}
                            >
                                <Select
                                    className='division-age-select'
                                    style={{ width: "100%", minWidth: 120, }}
                                    onChange={genderRefId => this.divisionTableDataOnchange(genderRefId, record, index, "genderRefId")}
                                    value={genderRefId}
                                    placeholder="Select"
                                    disabled={this.state.permissionState.divisionsDisable}
                                >
                                    {this.props.commonReducerState.genderDataEnum.map(item => (
                                        <Option key={'gender_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Age Restriction",
                    dataIndex: "ageRestriction",
                    key: AppUniqueId.div_ageres_chkbox,
                    render: (ageRestriction, record, index) => (
                        <div>
                            <Checkbox
                                className="single-checkbox mt-1"
                                checked={ageRestriction}
                                onChange={e => this.divisionTableDataOnchange(e.target.checked, record, index, "ageRestriction")}
                                disabled={this.state.permissionState.divisionsDisable}
                            />
                        </div>
                    )
                },
                {
                    title: "DOB From",
                    dataIndex: "fromDate",
                    key: AppUniqueId.div_ageres_fromdate,
                    width: "25%",
                    render: (fromDate, record, index) => {
                        return (
                            <Form.Item
                                name={`fromDate${record.parentIndex}${index}`}
                                rules={[{ required: record.ageRestriction, message: ValidationConstants.pleaseSelectDOBFrom }]}
                            >
                                <DatePicker
                                    size="default"
                                    className="comp-venue-time-datepicker"
                                    style={{ width: "100%", minWidth: 135 }}
                                    onChange={date => this.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "fromDate")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    disabled={!record.ageRestriction || this.state.permissionState.divisionsDisable}
                                    value={fromDate !== null && moment(fromDate)}
                                    disabledDate={d => !d || d.isSameOrAfter(record.toDate)}
                                />
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "DOB To",
                    dataIndex: "toDate",
                    width: "25%",
                    key: AppUniqueId.div_ageres_todate,
                    render: (toDate, record, index) => {
                        return (
                            <Form.Item
                                name={`toDate${record.parentIndex}${index}`}
                                rules={[{ required: record.ageRestriction, message: ValidationConstants.PleaseSelectDOBTo }]}
                            >
                                <DatePicker
                                    size="default"
                                    className="comp-venue-time-datepicker"
                                    style={{ width: "100%", minWidth: 135 }}
                                    onChange={date => this.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "toDate")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    disabled={!record.ageRestriction || this.state.permissionState.divisionsDisable}
                                    value={toDate !== null && moment(toDate)}
                                    disabledDate={d => moment(record.fromDate).isSameOrAfter(d, 'day')}
                                />
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "",
                    dataIndex: "clear",
                    key: "clear",
                    render: (clear, record, index) => (
                        <span style={{ display: "flex", justifyContent: "center", width: "100%", cursor: "pointer" }}>
                            <img
                                className="dot-image"
                                src={AppImages.redCross}
                                alt=""
                                width="16"
                                height="16"
                                onClick={() => !this.state.permissionState.divisionsDisable ? this.addRemoveDivision(index, record, "remove") : null}
                            />
                        </span>
                    )
                }
            ],
            divisionState: false
        };
        this_Obj = this;
        this.props.CLEAR_OWN_COMPETITION_DATA()
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        competitionId !== null && this.props.clearCompReducerDataAction("all");
        this.formRef = React.createRef();
    }

    componentDidUpdate(nextProps) {
        let competitionFeesState = this.props.competitionFeesState
        let competitionId = this.props.location.state ? this.props.location.state.id : null
        if (competitionFeesState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false })
            if (!competitionFeesState.error) {
                this.setState({
                    competitionTabKey: JSON.stringify(JSON.parse(this.state.competitionTabKey) + 1),
                    logoSetDefault: false,
                    image: null
                })
            }
            if (this.state.buttonPressed === "save" || this.state.buttonPressed === "publish" || this.state.buttonPressed === "delete") {
                history.push('/competitionDashboard');
            }
        }
        if (nextProps.competitionFeesState !== competitionFeesState) {
            if (competitionFeesState.getCompAllDataOnLoad === false && this.state.getDataLoading) {
                let isPublished = competitionFeesState.competitionDetailData.statusRefId == 2

                let registrationCloseDate = competitionFeesState.competitionDetailData.registrationCloseDate
                  && moment(competitionFeesState.competitionDetailData.registrationCloseDate)
                let isRegClosed = registrationCloseDate ? !registrationCloseDate.isSameOrAfter(moment()) : false;

                let creatorId = competitionFeesState.competitionCreator
                let orgData = getOrganisationData()
                let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0
                let isCreatorEdit = creatorId != organisationUniqueKey;

                this.setPermissionFields(isPublished, isRegClosed, isCreatorEdit)

                this.setState({
                    getDataLoading: false,
                    profileImage: competitionFeesState.competitionDetailData.competitionLogoUrl,
                    competitionIsUsed: competitionFeesState.competitionDetailData.isUsed,
                    isPublished,
                    isRegClosed,
                    isCreatorEdit
                })
                this.setDetailsFieldValue()
            }
            if (competitionFeesState.deleteDivisionLoad == false && this.state.deleteLoading) {
                this.setState({ deleteLoading: false });
                this.setDivisionFormFields();
            }
        }
        if (competitionFeesState.onLoad === false && this.state.divisionState === true) {
            setTimeout(() => {
                this.setDetailsFieldValue();
            }, 100);
            this.setState({ divisionState: false });
        }
    }

    ////disable or enable particular fields
    setPermissionFields = (isPublished, isRegClosed, isCreatorEdit) => {
        let hasRegistration = this.props.competitionFeesState.competitionDetailData.hasRegistration
        if (isPublished) {
            if (isRegClosed) {
                let permissionObject = {
                    compDetailDisable: true,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: true,
                    feesTableDisable: true,
                    paymentsDisable: true,
                    discountsDisable: true,
                    allDisable: true,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
                return
            }
            if (isCreatorEdit) {
                let permissionObject = {
                    compDetailDisable: true,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: false,
                    feesTableDisable: true,
                    paymentsDisable: true,
                    discountsDisable: true,
                    allDisable: true,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
            } else {
                let permissionObject = {
                    compDetailDisable: false,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    //divisionsDisable: hasRegistration == 1,
                    divisionsDisable: false,
                    feesTableDisable: true,
                    paymentsDisable: false,
                    discountsDisable: true,
                    allDisable: false,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
            }
        } else {
            let permissionObject = {
                compDetailDisable: false,
                regInviteesDisable: false,
                membershipDisable: false,
                divisionsDisable: false,
                feesTableDisable: false,
                paymentsDisable: false,
                discountsDisable: false,
                allDisable: false,
                isPublished: false
            }
            this.setState({ permissionState: permissionObject })
        }
    }

    componentDidMount() {
        let orgData = getOrganisationData()
        this.setState({ organisationTypeRefId: orgData.organisationTypeRefId })
        let competitionId = this.props.location.state ? this.props.location.state.id : null
        this.apiCalls(competitionId)
        this.setDetailsFieldValue()
        let checkVenueScreen = (this.props.location.state && this.props.location.state.venueScreen)
            ? this.props.location.state.venueScreen
            : null;
        checkVenueScreen ? window.scrollTo(0, 500) : window.scrollTo(0, 0)
    }

    ////all the api calls
    apiCalls = (competitionId) => {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.props.getDefaultCompFeesLogoAction()
        this.props.competitionDiscountTypesAction()
        this.props.competitionFeeInit();
        this.props.paymentFeeDeafault()
        this.props.paymentSeasonalFee()
        this.props.getCommonDiscountTypeTypeAction()
        this.props.getVenuesTypeAction('all');
        this.props.fixtureTemplateRoundsAction();
        // this.props.venueListAction();
        if (competitionId !== null) {
            let hasRegistration = 0
            this.props.getAllCompetitionFeesDeatilsAction(competitionId, hasRegistration, this.state.sourceModule)
            this.setState({ getDataLoading: true })
        } else {
            let hasRegistration = 0
            this.props.getDefaultCompFeesMembershipProductTabAction(hasRegistration)
            this.props.getDefaultCharity()
        }
    }

    setDetailsFieldValue() {
        let compFeesState = this.props.competitionFeesState
        this.formRef.current.setFieldsValue({
            competition_name: compFeesState.competitionDetailData.competitionName,
            numberOfRounds: compFeesState.competitionDetailData.noOfRounds,
            yearRefId: compFeesState.competitionDetailData.yearRefId,
            competitionTypeRefId: compFeesState.competitionDetailData.competitionTypeRefId,
            competitionFormatRefId: compFeesState.competitionDetailData.competitionFormatRefId,
            selectedVenues: compFeesState.selectedVenues,
            startDate: compFeesState.competitionDetailData.startDate && moment(compFeesState.competitionDetailData.startDate),
            endDate: compFeesState.competitionDetailData.endDate && moment(compFeesState.competitionDetailData.endDate),
        })
        let data = this.props.competitionFeesState.competionDiscountValue
        let discountData = data && data.competitionDiscounts !== null ? data.competitionDiscounts[0].discounts : []
        discountData.map((item, index) => {
            let competitionMembershipProductTypeId = `competitionMembershipProductTypeId${index}`
            let membershipProductUniqueKey = `membershipProductUniqueKey${index}`
            this.formRef.current.setFieldsValue({
                [competitionMembershipProductTypeId]: item.competitionMembershipProductTypeId,
                [membershipProductUniqueKey]: item.membershipProductUniqueKey,
            })
        })
        this.setDivisionFormFields();
    }

    setDivisionFormFields = () => {
        let divisionData = this.props.competitionFeesState.competitionDivisionsData
        let divisionArray = divisionData !== null ? divisionData : []
        divisionArray.map((item, index) => {
            item.divisions.map((divItem, divIndex) => {
                let divisionName = `divisionName${index}${divIndex}`
                let genderRefId = `genderRefId${index}${divIndex}`
                let fromDate = `fromDate${index}${divIndex}`
                let toDate = `toDate${index}${divIndex}`
                this.formRef.current.setFieldsValue({
                    [divisionName]: divItem.divisionName,
                    [genderRefId]: divItem.genderRefId ? divItem.genderRefId : [],
                    [fromDate]: divItem.fromDate && moment(divItem.fromDate),
                    [toDate]: divItem.toDate && moment(divItem.toDate),
                });
            })
        })
    }

    checkDivisionEmpty(data) {
        for (let i in data) {
            if (data[i].divisions.length === 0) {
                return true
            }
        }
    }

    saveAPIsActionCall = (values) => {
        let tabKey = this.state.competitionTabKey
        let compFeesState = this.props.competitionFeesState
        let competitionId = compFeesState.competitionId
        let postData = compFeesState.competitionDetailData

        let nonPlayingDate = JSON.stringify(postData.nonPlayingDates)
        let venue = JSON.stringify(compFeesState.postVenues)
        let invitees = JSON.stringify(compFeesState.postInvitees)
        if (tabKey == "1") {
            if (compFeesState.competitionDetailData.competitionLogoUrl !== null) {
                let formData = new FormData();
                formData.append("competitionUniqueKey", competitionId);
                formData.append("name", postData.competitionName);
                formData.append("yearRefId", values.yearRefId);
                formData.append("description", postData.description);
                formData.append("competitionTypeRefId", postData.competitionTypeRefId);
                formData.append("competitionFormatRefId", postData.competitionFormatRefId);
                formData.append("startDate", postData.startDate);
                formData.append("endDate", postData.endDate);
                if (postData.competitionFormatRefId == 4) {
                    if (postData.noOfRounds !== null && postData.noOfRounds !== '') formData.append("noOfRounds", postData.noOfRounds);
                }
                if (postData.roundInDays !== null && postData.roundInDays !== '') formData.append("roundInDays", postData.roundInDays);
                if (postData.roundInHours !== null && postData.roundInHours !== '') formData.append("roundInHours", postData.roundInHours);
                if (postData.roundInMins !== null && postData.roundInMins !== '') formData.append("roundInMins", postData.roundInMins);
                if (postData.minimunPlayers !== null && postData.minimunPlayers !== '') formData.append("minimunPlayers", postData.minimunPlayers);
                if (postData.maximumPlayers !== null && postData.maximumPlayers !== '') formData.append("maximumPlayers", postData.maximumPlayers);
                formData.append("venues", venue);
                formData.append("registrationCloseDate", postData.registrationCloseDate);
                formData.append("statusRefId", this.state.isPublished ? 2 : this.state.statusRefId);
                formData.append("nonPlayingDates", nonPlayingDate);
                formData.append("invitees", invitees);
                formData.append("logoSetAsDefault", this.state.logoSetDefault)
                formData.append("hasRegistration", 0);
                if (this.state.logoSetDefault) {
                    formData.append("organisationLogoId", compFeesState.defaultCompFeesOrgLogoData.id)
                }
                if (postData.logoIsDefault) {
                    formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                    formData.append("logoFileUrl", compFeesState.defaultCompFeesOrgLogo);
                    formData.append("competition_logo", compFeesState.defaultCompFeesOrgLogo)
                } else {
                    if (this.state.image !== null) {
                        formData.append("competition_logo", this.state.image)
                        formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                    } else {
                        formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                        formData.append("logoFileUrl", postData.competitionLogoUrl);
                        // formData.append("competition_logo", compFeesState.defaultCompFeesOrgLogo)
                    }
                }
                formData.append("logoIsDefault", postData.logoIsDefault)
                if (this.state.image) {
                    formData.append("uploadFileType", 1);
                }
                this.props.saveCompetitionFeesDetailsAction(formData, compFeesState.defaultCompFeesOrgLogoData.id, this.state.sourceModule)
                this.setState({ loading: true, divisionState: true });
            } else {
                message.error(ValidationConstants.competitionLogoIsRequired)
            }
        } else if (tabKey == "2") {
            let divisionArrayData = compFeesState.competitionDivisionsData
            let finalDivisionArray = []
            for (let i in divisionArrayData) {
                finalDivisionArray = [...finalDivisionArray, ...divisionArrayData[i].divisions]
            }
            let payload = finalDivisionArray
            let finalDivisionPayload = {
                statusRefId: this.state.statusRefId,
                divisions: payload,
                sourceModule: this.state.sourceModule
            }
            if (this.checkDivisionEmpty(divisionArrayData)) {
                message.error(ValidationConstants.pleaseAddDivisionForMembershipProduct)
            } else {
                this.props.saveCompetitionFeesDivisionAction(finalDivisionPayload, competitionId)
                this.setState({ loading: true })
            }
        }
    }

    onChange(checkedValues) {
        // console.log("checked = ", checkedValues);
    }

    divisionTableDataOnchange(checked, record, index, keyword) {
        this.props.divisionTableDataOnchangeAction(checked, record, index, keyword)
        this.setState({ divisionState: true })
    }

    dateOnChangeFrom = (date, key) => {
        if (date !== null) {
            this.props.add_editcompetitionFeeDeatils((moment(date).format("YYYY-MM-DD")), key)
        }
    };

    ///////view for breadcrumb
    headerView = () => {
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {competitionId == null ? AppConstants.addCompetition : AppConstants.competitionDetails}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    dropdownView = () => {
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <span id={AppUniqueId.comp_year_refid} className="year-select-heading required-field">
                                    {AppConstants.year}:
                                </span>
                                <Form.Item
                                    name="yearRefId"
                                    initialValue={1}
                                    rules={[{ required: true, message: ValidationConstants.pleaseSelectYear }]}
                                >
                                    <Select className="year-select reg-filter-select-year ml-2">
                                        {this.props.appState.yearList.map(item => (
                                            <Option key={'year_' + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            let files_ = data.files[0].type.split("image/")
            let fileType = files_[1]

            if (data.files[0].size > AppConstants.logo_size) {
                message.error(AppConstants.logoImageSize);
                return
            }

            if (fileType === `jpeg` || fileType === `png` || fileType === `gif`) {
                this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]), isSetDefaul: true })
                this.props.add_editcompetitionFeeDeatils(URL.createObjectURL(data.files[0]), "competitionLogoUrl")
                this.props.add_editcompetitionFeeDeatils(false, "logoIsDefault")
            } else {
                message.error(AppConstants.logoType);
                return
            }
        }
    };

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    /// add-edit non playing dates and name
    updateNonPlayingNames(data, index, key) {
        let detailsData = this.props.competitionFeesState
        let array = detailsData.competitionDetailData.nonPlayingDates
        if (key === "name") {
            array[index].name = data
        } else {
            array[index].nonPlayingDate = data
        }
        this.props.add_editcompetitionFeeDeatils(array, "nonPlayingDates")
    }

    // Non playing dates view
    nonPlayingDateView(item, index) {
        let compDetailDisable = this.state.permissionState.compDetailDisable
        return (
            <div className="fluid-width mt-3">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            auto_complete="new-name"
                            placeholder={AppConstants.name}
                            value={item.name}
                            onChange={(e) => this.updateNonPlayingNames(e.target.value, index, "name")}
                            disabled={compDetailDisable}
                        />
                    </div>
                    <div className="col-sm">
                        <DatePicker
                            className="comp-dashboard-botton-view-mobile"
                            size="large"
                            style={{ width: "100%" }}
                            onChange={date => this.updateNonPlayingNames(date, index, "date")}
                            format="DD-MM-YYYY"
                            placeholder="dd-mm-yyyy"
                            showTime={false}
                            value={item.nonPlayingDate && moment(item.nonPlayingDate, "YYYY-MM-DD")}
                            disabled={compDetailDisable}
                        />
                    </div>
                    <div className="col-sm-2 transfer-image-view" onClick={() => !compDetailDisable ? this.props.add_editcompetitionFeeDeatils(index, "nonPlayingDataRemove") : null}>
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true" />
                            </span>
                            <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    //On selection of venue
    onSelectValues(item, detailsData) {
        this.props.add_editcompetitionFeeDeatils(item, "venues")
        this.props.clearFilter()
    }

    ///// Add Non Playing dates
    addNonPlayingDate() {
        let nonPlayingObject = {
            competitionNonPlayingDatesId: 0,
            name: "",
            nonPlayingDate: ""
        }
        this.props.add_editcompetitionFeeDeatils(nonPlayingObject, "nonPlayingObjectAdd")
    }

    /////on change logo isdefault
    logoIsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(value, key)
        this.setState({ logoSetDefault: false, isSetDefaul: false, image: null })
    }

    ////onChange save as default logo
    logoSaveAsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(false, key)
        this.setState({ logoSetDefault: value })
    }

    handleSearch = (value, data) => {
        const filteredData = data.filter(memo => {
            return memo.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
        this.props.searchVenueList(filteredData)
    };

    regCompetitionFeeNavigationView = () => {
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        let hasRegistration = this.props.competitionFeesState.competitionDetailData.hasRegistration
        let showNavigateView = !this.state.isRegClosed && hasRegistration == 1
        return (
            <div>
                {showNavigateView && (
                    <div className="formView">
                        <div className="content-view pt-3">
                            <div className="row-view-text">
                                <span className="registation-screen-nav-text">
                                    {AppConstants.toEditRegistrationDeatils}
                                </span>
                                <span
                                    className="registation-screen-nav-text-appColor"
                                    onClick={() => history.push("/registrationCompetitionFee", { id: competitionId })}
                                    style={{ marginLeft: 5, textDecoration: "underline", cursor: "pointer" }}
                                >
                                    {AppConstants.registrationArea}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    getRadioBtnIds(data, key) {
        switch (key) {
            case "competitionType":
                switch (data) {
                    case 1: return AppUniqueId.comp_type1
                    case 2: return AppUniqueId.comp_type2
                    default: break;
                }

            case "competitionFormat":
                switch (data) {
                    case 1: return AppUniqueId.comp_format1
                    case 2: return AppUniqueId.comp_format2
                    case 3: return AppUniqueId.comp_format3
                    case 4: return AppUniqueId.comp_format4
                    default: break;
                }

            default: break;
        }
    }

    ///////form content view - fee details
    contentView = () => {
        let roundsArray = this.props.competitionManagementState.fixtureTemplate;
        let appState = this.props.appState
        const { venueList, mainVenueList } = this.props.commonReducerState
        let detailsData = this.props.competitionFeesState
        let defaultCompFeesOrgLogo = detailsData.defaultCompFeesOrgLogo
        let compDetailDisable = this.state.permissionState.compDetailDisable
        return (
            <div className="content-view pt-4">
                <Form.Item
                    name='competition_name'
                    rules={[{ required: true, message: ValidationConstants.competitionNameIsRequired }]}
                >
                    <InputWithHead
                        auto_complete="new-compName"
                        required="required-field pb-0"
                        heading={AppConstants.competition_name}
                        placeholder={AppConstants.competition_name}
                        onChange={(e) => this.props.add_editcompetitionFeeDeatils(captializedString(e.target.value), "competitionName")}
                        disabled={compDetailDisable}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            'competition_name': captializedString(i.target.value)
                        })}
                    />
                </Form.Item>
                <InputWithHead required="required-field pb-0" heading={AppConstants.competitionLogo} />

                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <label>
                                    <img
                                        src={detailsData.competitionDetailData.competitionLogoUrl == null ? AppImages.circleImage : detailsData.competitionDetailData.competitionLogoUrl}
                                        alt=""
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name="image"
                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    />
                                </label>
                            </div>
                            <input
                                disabled={compDetailDisable}
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                onChange={(evt) => this.setImage(evt.target)}
                            />
                        </div>
                        <div
                            className="col-sm"
                            style={{ display: "flex", justifyContent: 'center', alignItems: 'flex-start', flexDirection: "column", }}
                        >
                            {defaultCompFeesOrgLogo !== null && (
                                <Checkbox
                                    className="single-checkbox"
                                    id={AppUniqueId.defaultComp_logo_checkbox}
                                    checked={detailsData.competitionDetailData.logoIsDefault}
                                    onChange={e =>
                                        this.logoIsDefaultOnchange(e.target.checked, "logoIsDefault")
                                    }
                                    disabled={compDetailDisable}
                                >
                                    {AppConstants.useDefault}
                                </Checkbox>
                            )}

                            {this.state.isSetDefaul && (
                                <Checkbox
                                    className="single-checkbox ml-0"
                                    checked={this.state.logoSetDefault}
                                    onChange={e =>
                                        this.logoSaveAsDefaultOnchange(e.target.checked, "logoIsDefault")
                                    }
                                    disabled={compDetailDisable}
                                >
                                    {AppConstants.useAffiliateLogo}
                                </Checkbox>
                            )}
                        </div>
                    </div>
                </div>

                <InputWithHead heading={AppConstants.description} />

                <TextArea
                    placeholder={AppConstants.addShortNotes_registering}
                    allowClear
                    value={detailsData.competitionDetailData.description}
                    onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "description")}
                    disabled={compDetailDisable}
                />

                <div style={{ marginTop: 15 }}>
                    <InputWithHead required="required-field pb-0" heading={AppConstants.venue} />
                    <Form.Item
                        name='selectedVenues'
                        rules={[{ required: true, message: ValidationConstants.pleaseSelectVenue }]}
                    >
                        <Select
                            id={AppUniqueId.select_Venues}
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={venueSelection => {
                                this.onSelectValues(venueSelection, detailsData)
                            }}
                            placeholder={AppConstants.selectVenue}
                            filterOption={false}
                            onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
                            disabled={compDetailDisable}
                        >
                            {appState.venueList.map((item) => (
                                <Option key={'venue_' + item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <NavLink
                    to={{
                        pathname: `/competitionVenueAndTimesAdd`,
                        state: {
                            key: AppConstants.dashboard,
                            id: this.props.location.state ? this.props.location.state.id : null
                        }
                    }}
                >
                    <span id={AppUniqueId.add_Venue} className="input-heading-add-another">
                        +{AppConstants.addVenue}
                    </span>
                </NavLink>

                <span className="applicable-to-heading required-field">
                    {AppConstants.typeOfCompetition}
                </span>

                <Form.Item
                    name='competitionTypeRefId'
                    rules={[{ required: true, message: ValidationConstants.pleaseSelectCompetitionType }]}
                >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                        value={detailsData.competitionTypeRefId}
                        disabled={compDetailDisable}
                    >
                        {appState.typesOfCompetition.map(item => (
                            <Radio
                                id={this.getRadioBtnIds(item.id, 'competitionType')}
                                key={'competitionType_' + item.id}
                                value={item.id}
                            >
                                {item.description}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>

                <span className="applicable-to-heading required-field">{AppConstants.competitionFormat}</span>
                <Form.Item name='competitionFormatRefId' rules={[{ required: true, message: ValidationConstants.pleaseSelectCompetitionFormat }]}>
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionFormatRefId")}
                        value={detailsData.competitionFormatRefId}
                        disabled={compDetailDisable}
                    >
                        {appState.competitionFormatTypes.map(item => (
                            <Radio
                                id={this.getRadioBtnIds(item.id, 'competitionFormat')}
                                key={'competitionFormatType_' + item.id}
                                value={item.id}
                            >
                                {item.description}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead headingId={AppUniqueId.comp_start_date} heading={AppConstants.compStartDate} required="required-field" />

                            <Form.Item name="startDate" rules={[{ required: true, message: ValidationConstants.startDateIsRequired }]}>
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.dateOnChangeFrom(date, "startDate")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    disabled={compDetailDisable}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-sm">
                            <InputWithHead headingId={AppUniqueId.comp_end_date} heading={AppConstants.compCloseDate} required="required-field" />
                            <Form.Item name="endDate" rules={[{ required: true, message: ValidationConstants.endDateIsRequired }]}>
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.dateOnChangeFrom(date, "endDate")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    disabledDate={d => !d || d.isBefore(detailsData.competitionDetailData.startDate)}
                                    disabled={compDetailDisable}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                {detailsData.competitionDetailData.competitionFormatRefId == 4 && (
                    <div>
                        <InputWithHead heading={AppConstants.numberOfRounds} required="required-field" />
                        <Form.Item name='numberOfRounds' rules={[{ required: true, message: ValidationConstants.numberOfRoundsNameIsRequired }]}>
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                placeholder={AppConstants.selectRound}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e, "noOfRounds")}
                                // value={detailsData.competitionDetailData.noOfRounds}
                                disabled={compDetailDisable}
                            >
                                {roundsArray.map(item => (
                                    <Option key={'round_' + item.noOfRounds} value={item.noOfRounds}>
                                        {item.noOfRounds}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                )}

                <InputWithHead heading={AppConstants.timeBetweenRounds} />
                <div className="fluid-width">
                    <div className="row">
                        <div id={AppUniqueId.time_rounds_days} className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                auto_complete="new-days"
                                placeholder={AppConstants.days}
                                value={detailsData.competitionDetailData.roundInDays}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInDays")}
                                disabled={compDetailDisable}
                            />
                        </div>
                        <div id={AppUniqueId.time_rounds_hrs} className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                auto_complete="new-hours"
                                placeholder={AppConstants.hours}
                                value={detailsData.competitionDetailData.roundInHours}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInHours")}
                                disabled={compDetailDisable}
                            />
                        </div>
                        <div id={AppUniqueId.time_rounds_mins} className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                auto_complete="new-mins"
                                placeholder={AppConstants.mins}
                                value={detailsData.competitionDetailData.roundInMins}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInMins")}
                                disabled={compDetailDisable}
                            />
                        </div>
                    </div>
                </div>
                <div className="inside-container-view pt-4">
                    <InputWithHead heading={AppConstants.nonPlayingDates} />
                    {detailsData.competitionDetailData.nonPlayingDates && detailsData.competitionDetailData.nonPlayingDates.map((item, index) =>
                        this.nonPlayingDateView(item, index))
                    }
                    <a>
                        <span id={AppUniqueId.add_non_playingdate_button} onClick={() => !compDetailDisable ? this.addNonPlayingDate() : null} className="input-heading-add-another">
                            + {AppConstants.addAnotherNonPlayingDate}
                        </span>
                    </a>
                </div>
                <InputWithHead heading={AppConstants.playerInEachTeam} />
                <div className="fluid-width">
                    <div className="row">
                        <div id={AppUniqueId.team_min_players} className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                auto_complete="new-minNumber"
                                placeholder={AppConstants.minNumber}
                                value={detailsData.competitionDetailData.minimunPlayers}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "minimunPlayers")}
                                disabled={compDetailDisable}
                            />
                        </div>
                        <div id={AppUniqueId.team_max_players} className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                auto_complete="new-maxNumber"
                                placeholder={AppConstants.maxNumber}
                                value={detailsData.competitionDetailData.maximumPlayers}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "maximumPlayers")}
                                disabled={compDetailDisable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //////add or remove another division in the division tab
    addRemoveDivision = (index, item, keyword) => {
        if (keyword === "add") {
            this.props.addRemoveDivisionAction(index, item, keyword);
        } else if (item.competitionDivisionId != 0 && this.state.statusRefId == 2) {
            this.setState({ deleteDivModalVisible: true, divisionIndex: index, competitionDivision: item })
        } else {
            this.props.addRemoveDivisionAction(index, this.state.competitionDivision, "removeDivision");
            this.setDivisionFormFields();
        }
    }

    handleDeleteDivision = (key) => {
        if (key === "ok") {
            let payload = {
                competitionDivisionId: this.state.competitionDivision.competitionDivisionId
            }
            this.props.addRemoveDivisionAction(this.state.divisionIndex, this.state.competitionDivision, "remove");
            this.props.removeCompetitionDivisionAction(payload);
            this.setState({ deleteLoading: true });
        }
        this.setState({ deleteDivModalVisible: false })
    }

    divisionsView = () => {
        let divisionData = this.props.competitionFeesState.competitionDivisionsData
        let divisionArray = divisionData !== null ? divisionData : []
        let divisionsDisable = this.state.permissionState.divisionsDisable
        return (
            <div className="fees-view pt-5">
                <span className="form-heading required-field">{AppConstants.divisions}</span>
                {divisionArray.length === 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                )}
                {divisionArray.map((item, index) => (
                    <div>
                        <div className="inside-container-view">
                            <span className="form-heading pt-2 pl-2">
                                {item.membershipProductName}
                            </span>
                            {item.isPlayingStatus ? (
                                <div>
                                    <div className="table-responsive">
                                        <Table
                                            className="fees-table"
                                            columns={this.state.divisionTable}
                                            dataSource={item.divisions}
                                            pagination={false}
                                            Divider="false"
                                            key={index}
                                        />
                                    </div>
                                    <a>
                                        <span
                                            className="input-heading-add-another"
                                            onClick={() =>
                                                !divisionsDisable
                                                    ? this.addRemoveDivision(index, item, 'add')
                                                    : null
                                            }
                                        >
                                            + {AppConstants.addDivision}
                                        </span>
                                    </a>
                                </div>
                            ) : (
                                <span className="applicable-to-heading pt-0 pl-2">
                                    {AppConstants.nonPlayerDivisionMessage}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.deleteDivision}
                    visible={this.state.deleteDivModalVisible}
                    onOk={() => this.handleDeleteDivision("ok")}
                    onCancel={() => this.handleDeleteDivision("cancel")}
                >
                    <p>{AppConstants.competitionDivisionValidation}</p>
                </Modal>
            </div>
        );
    };

    //////delete the membership product
    showDeleteConfirm = () => {
        let competitionId = this.props.competitionFeesState.competitionId
        let this_ = this
        confirm({
            title: 'Are you sure delete this product?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if (competitionId.length > 0) {
                    this_.deleteProduct(competitionId)
                }
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    deleteProduct = (competitionId) => {
        this.setState({ loading: true, buttonPressed: "delete" })
        this.props.regCompetitionListDeleteAction(competitionId)
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let tabKey = this.state.competitionTabKey
        let competitionId = this.props.competitionFeesState.competitionId
        let isPublished = this.state.permissionState.isPublished
        let allDisable = this.state.permissionState.allDisable
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                {competitionId && (
                                    <Tooltip
                                        style={{ height: "100%" }}
                                        onMouseEnter={() => this.setState({ tooltipVisibleDelete: isPublished })}
                                        onMouseLeave={() => this.setState({ tooltipVisibleDelete: false })}
                                        visible={this.state.tooltipVisibleDelete}
                                        title={ValidationConstants.compIsPublished}
                                    >
                                        <Button
                                            disabled={isPublished}
                                            type="cancel-button"
                                            onClick={() => this.showDeleteConfirm()}
                                        >
                                            {AppConstants.delete}
                                        </Button>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Tooltip
                                    style={{ height: "100%" }}
                                    onMouseEnter={() => this.setState({ tooltipVisibleDraft: isPublished })}
                                    onMouseLeave={() => this.setState({ tooltipVisibleDraft: false })}
                                    visible={this.state.tooltipVisibleDraft}
                                    title={ValidationConstants.compIsPublished}
                                >
                                    <Button
                                        id={AppUniqueId.compdiv_savedraft_button}
                                        className="save-draft-text"
                                        type="save-draft-text"
                                        disabled={isPublished}
                                        htmlType="submit"
                                        onClick={() => this.setState({ statusRefId: 1, buttonPressed: "save" })}
                                    >
                                        {AppConstants.saveAsDraft}
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    style={{ height: "100%" }}
                                    onMouseEnter={() => this.setState({ tooltipVisiblePublish: allDisable })}
                                    onMouseLeave={() => this.setState({ tooltipVisiblePublish: false })}
                                    visible={this.state.tooltipVisiblePublish}
                                    title={ValidationConstants.compIsPublished}
                                >
                                    <Button
                                        id={tabKey === "2" ? AppUniqueId.comp_Division_Publish_button : AppUniqueId.comp_page1_Next_button}
                                        className="publish-button" type="primary"
                                        disabled={tabKey === "1" || tabKey === "2" ? allDisable : isPublished}
                                        htmlType="submit" onClick={() => this.setState({
                                            statusRefId: tabKey == "2" ? 2 : 1,
                                            buttonPressed: tabKey == "2" ? "publish" : "next"
                                        })}
                                    >
                                        {tabKey === "2" ? AppConstants.publish : AppConstants.next}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    tabCallBack = (key) => {
        let competitionId = this.props.competitionFeesState.competitionId
        if (competitionId !== null && competitionId.length > 0) {
            this.setState({ competitionTabKey: key, divisionState: key == "2" })
        }
        this.setDetailsFieldValue()
    }

    render() {
        let competitionId = this.props.location.state ? this.props.location.state.id : null
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />
                <InnerHorizontalMenu menu="competition" compSelectedKey="1" />
                <Layout>
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.saveAPIsActionCall}
                        onFinishFailed={(err) => {
                            this.formRef.current.scrollToField(err.errorFields[0].name);
                        }}
                        initialValues={{ yearRefId: 1, competitionTypeRefId: 1, competitionFormatId: 1 }}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>
                            {this.regCompetitionFeeNavigationView()}
                            <div className="tab-view">
                                <Tabs activeKey={this.state.competitionTabKey} onChange={this.tabCallBack}>
                                    <TabPane tab={AppConstants.details} key="1">
                                        <div id={AppUniqueId.comp_details_tab} className="tab-formView mt-5">
                                            {this.contentView()}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.divisions} key="2">
                                        <div id={AppUniqueId.comp_division_tab} className="tab-formView">
                                            {this.divisionsView()}
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <Loader
                                visible={this.props.competitionFeesState.onLoad || this.state.getDataLoading || this.props.competitionFeesState.deleteDivisionLoad}
                            />
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
        competitionFeeInit,
        getVenuesTypeAction,
        getAllCompetitionFeesDeatilsAction,
        saveCompetitionFeesDetailsAction,
        getDefaultCompFeesMembershipProductTabAction,
        saveCompetitionFeesDivisionAction,
        divisionTableDataOnchangeAction,
        addRemoveDivisionAction,
        paymentFeeDeafault,
        paymentSeasonalFee,
        add_editcompetitionFeeDeatils,
        competitionDiscountTypesAction,
        getCommonDiscountTypeTypeAction,
        regCompetitionListDeleteAction,
        getDefaultCharity,
        getDefaultCompFeesLogoAction,
        getOnlyYearListAction,
        clearCompReducerDataAction,
        searchVenueList,
        venueListAction,
        clearFilter,
        CLEAR_OWN_COMPETITION_DATA,
        removeCompetitionDivisionAction,
        fixtureTemplateRoundsAction,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
        competitionManagementState: state.CompetitionManagementState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationCompetitionForm);
