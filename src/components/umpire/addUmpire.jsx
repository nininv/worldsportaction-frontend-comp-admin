import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Select, Radio, Spin, AutoComplete, Checkbox, message } from 'antd';
import './umpire.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUmpireCompetiton, getUmpireCompetitonData, getOrganisationData } from '../../util/sessionStorage'
import { isArrayNotEmpty, captializedString, regexNumberExpression } from "../../util/helpers";
import Loader from '../../customComponents/loader'
import { isEqual } from 'lodash';
import {
    umpireListAction,
    updateAddUmpireData,
    addUmpireAction,
    getUmpireAffiliateList,
    umpireSearchAction,
    umpireClear
} from '../../store/actions/umpireAction/umpireAction'
import { getUmpireTeams } from '../../store/actions/umpireAction/umpireEditForm'
import { entityTypes } from '../../util/entityTypes'
import { refRoleTypes } from '../../util/refRoles'

const { Footer, Content, Header } = Layout;
const { Option } = Select;

const OPTIONS = [];

class AddUmpire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            load: false,
            tableRecord: this.props.location.state ? this.props.location.state.tableRecord : null,
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            loader: false,
            showOption: false,
            competition_id: null,
            teamLoad: false,
            affiliateLoader: false,
            screenName: (props.location && props.location.state && props.location.state.screenName) ? props.location.state.screenName : null,
            isUserNotFound: false,
            exsitingValue: '',
            isUmpireCoach: false,
            isUmpire: false,
            isUmpireAffiliate: false,
            existingUmpireCoach_CheckBox: false,
            existingUmpireCheckBox: false,
            isCompParent: false,
        }
        this.formRef = React.createRef();
    }

    async componentDidMount() {
        let compId = null

        if (getUmpireCompetiton()) {
            compId = JSON.parse(getUmpireCompetiton())
            let compData = JSON.parse(getUmpireCompetitonData())
            let orgItem = await getOrganisationData();
            let userOrganisationId = orgItem ? orgItem.organisationId : 0;
            let compOrgId = compData ? compData.organisationId : 0
            let isCompParent = userOrganisationId === compOrgId
            this.setState({ isCompParent });
            this.props.umpireListAction({ refRoleId: JSON.stringify([5]), entityTypes: 1, compId: compId, offset: 0 })
            if (compId !== null) {
                this.props.getUmpireAffiliateList({ id: compId })
                this.setState({ isUmpireAffiliate: true })
            }
            const teamsBody = { competitionId: compId, organisationId: userOrganisationId };
            if (this.state.tableRecord) teamsBody.umpireId = this.state.tableRecord.id;
            await this.props.getUmpireTeams(teamsBody);
            this.setInitialFieldValue()
        }
    }

    componentDidUpdate(nextProps) {
        if (isEqual(this.props.umpireState.affilateList, nextProps.umpireState.affilateList)) {
            if (this.state.isUmpireAffiliate === true && this.props.umpireState.onAffiliateLoad === false) {
                let compId = JSON.parse(getUmpireCompetiton())
                if (this.state.isEdit === true) {
                    this.props.updateAddUmpireData(this.state.tableRecord, 'isEditUmpire')
                    this.setState({ loader: true })
                } else {
                    this.props.updateAddUmpireData('', 'isAddUmpire')
                }
                this.setState({ load: true, competition_id: compId, isUmpireAffiliate: false })
            }
        }

        if (this.props.umpireState.umpireList !== nextProps.umpireState.umpireList) {
            if (this.state.loader === true && this.props.umpireState.onLoad === false) {
                this.filterUmpireList()
                if (this.state.isEdit === true) {
                    this.setInitialFieldValue()
                    this.setState({
                        existingUmpireCoach_CheckBox: this.props.umpireState.umpireCoachCheckBox,
                        isUmpireCoach: this.props.umpireState.umpireCoachCheckBox,
                        isUmpire: this.props.umpireState.umpireCheckbox,
                        existingUmpireCheckBox: this.props.umpireState.umpireCheckbox,
                    })
                }
                this.setState({ load: false, loader: false })
            }
        }

        if (this.props.umpireState.umpireData.affiliates !== nextProps.umpireState.umpireData.affiliates) {
            if (this.state.affiliateLoader === true) {
                const { umpireData } = this.props.umpireState
                this.setSelectedAffiliateValue(umpireData.affiliates)
                this.setState({ affiliateLoader: false })
                this.setInitialFieldValue()
            }
        }
    }

    setSelectedAffiliateValue = (affiliateIds) => {
        this.formRef.current.setFieldsValue({
            'umpireAffiliateName': affiliateIds,
        })
    }

    setInitialFieldValue = () => {
        const { umpireData } = this.props.umpireState
        const compData = JSON.parse(getUmpireCompetitonData())
        const competitionOrgId = compData.competitionOrganisation ? compData.competitionOrganisation.id : null
        const affiliates = umpireData.affiliates.map(affiliate => affiliate.id)
        const umpireNewAffiliateName = !this.state.isCompParent ? competitionOrgId : affiliates

        if (this.state.isEdit) {
            this.formRef.current.setFieldsValue({
                'First Name': umpireData.firstName,
                'Last Name': umpireData.lastName,
                'Email Address': umpireData.email,
                'Contact no': umpireData.mobileNumber,
                umpireNewAffiliateName,
                'teamsNames': umpireData.teamId
            })
        } else {
            if (!this.state.isCompParent) {
                this.props.updateAddUmpireData([umpireNewAffiliateName], 'partcipateAffiliateId')
            }
            if (umpireNewAffiliateName) {
                this.formRef.current.setFieldsValue({
                    umpireNewAffiliateName,
                })
            }
        }
    }

    filterUmpireList = () => {
        const { umpireListResult } = this.props.umpireState
        let umpireList = isArrayNotEmpty(umpireListResult) ? umpireListResult : []
        for (let i in umpireList) {
            OPTIONS.push(umpireList[i].firstName + " " + umpireList[i].lastName)
        }
    }

    ///change mobile number
    onChangeNumber = (number) => {
        if (number.length === 10) {
            this.setState({
                hasError: false
            })
            this.props.updateAddUmpireData(regexNumberExpression(number), 'mobileNumber')
        } else if (number.length < 10) {
            this.props.updateAddUmpireData(regexNumberExpression(number), 'mobileNumber')
            this.setState({
                hasError: true
            })
        }
        setTimeout(() => {
            this.setInitialFieldValue()
        }, 300);
    }

    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
        return (
            <div className="header-view">
                <Header className="form-header-view bg-transparent d-flex align-items-center">
                    <div className="row">
                        <div className="col-sm d-flex align-content-center">
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{isEdit === true ? AppConstants.editUmpire : AppConstants.addUmpire}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        )
    }

    umpireExistingRadioButton = () => {
        const {
            umpireListResult, onLoadSearch, affilateList,
            onAffiliateLoad, umpireListData,
            umpireOwnTeam, teamsList,
        } = this.props.umpireState
        let umpireList = isArrayNotEmpty(umpireListResult) ? umpireListResult : []
        let affilateData = isArrayNotEmpty(affilateList) ? affilateList : []

        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            required="required-field pb-3 pt-3"
                            heading={AppConstants.umpireSearch}
                        />
                        <Form.Item name={AppConstants.team} rules={[{ required: true, message: ValidationConstants.umpireSearch }]}>
                            <AutoComplete
                                // loading
                                style={{ width: '100%', height: '44px' }}
                                placeholder="Select User"
                                onSelect={(item, option) => {
                                    let umpire = option.key.split('_')
                                    let umpireId = umpire[1]
                                    this.props.umpireClear()
                                    this.props.updateAddUmpireData(umpireId, 'umnpireSearch')
                                    this.setState({ affiliateLoader: true, isUserNotFound: false })
                                }}
                                notFoundContent={onLoadSearch === true ? <Spin size="small" /> : null}
                                onSearch={(value) => {
                                    this.setState({ isUserNotFound: false, exsitingValue: value })
                                    // value
                                    //     ? this.props.umpireSearchAction({ refRoleId: JSON.stringify([refRoleTypes('member')]), entityTypes: entityTypes('COMPETITION'), compId: this.state.competition_id, userName: value, offset: 0 })
                                    //     : this.props.umpireListAction({ refRoleId: JSON.stringify([refRoleTypes('member')]), entityTypes: entityTypes('COMPETITION'), compId: this.state.competition_id, offset: 0 })

                                    value && value.length > 2
                                        ? this.props.umpireSearchAction({ refRoleId: JSON.stringify(refRoleTypes('member')), entityTypes: entityTypes('COMPETITION'), compId: this.state.competition_id, userName: value })
                                        : this.props.umpireClear()
                                }}
                            >
                                {this.state.exsitingValue && (
                                    umpireList.map((item) => (
                                        <Option key={'umpire_' + item.id} value={item.firstName + " " + item.lastName}>
                                            {item.firstName + " " + item.lastName}
                                        </Option>
                                    ))
                                )}
                            </AutoComplete>
                        </Form.Item>
                        <span style={{ color: 'red' }}>
                            {(this.state.exsitingValue.length > 2 && (this.state.isUserNotFound || umpireListData.length === 0)) && ValidationConstants.userNotFound}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            required="required-field pb-3 pt-3"
                            heading={AppConstants.organisation}
                        />
                        <Form.Item
                            className="slct-in-add-manager-livescore"
                            name="umpireAffiliateName"
                            rules={[{ required: true, message: ValidationConstants.organisationField }]}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder={AppConstants.selectOrganisation}
                                className="w-100"
                                onChange={(affiliateIds) => this.props.updateAddUmpireData(affiliateIds, 'affiliates')}
                                notFoundContent={onAffiliateLoad === true ? <Spin size="small" /> : null}
                                optionFilterProp="children"
                            >
                                {affilateData.map((item) => (
                                    <Option key={'organisation_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                { umpireOwnTeam && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead required="pb-3 pt-3" heading={AppConstants.team} />
                            <Form.Item
                                name="teamsNames"
                                rules={[{ required: false, message: ValidationConstants.teamName }]}
                                className="slct-in-add-manager-livescore"
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder={AppConstants.selectTeam}
                                    className="w-100"
                                    onChange={(teamId) => this.props.updateAddUmpireData(teamId, 'teamId')}
                                    optionFilterProp="children"
                                >
                                    {teamsList.map((item) => (
                                        <Option key={'team_' + item.id} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                )}

                <Checkbox
                    className="single-checkbox pt-3"
                    checked={this.state.existingUmpireCheckBox}
                    onChange={(e) => this.setState({ existingUmpireCheckBox: e.target.checked })}
                >
                    {AppConstants.umpire}
                </Checkbox>

                <Checkbox
                    className="single-checkbox pt-3"
                    checked={this.state.existingUmpireCoach_CheckBox}
                    onChange={(e) => this.setState({ existingUmpireCoach_CheckBox: e.target.checked })}
                >
                    {AppConstants.umpireCoach}
                </Checkbox>
            </div>
        )
    }

    umpireNewRadioBtnView = () => {
        const { affilateList, umpireOwnTeam, teamsList } = this.props.umpireState
        const { hasError } = this.state
        const affiliateListResult = isArrayNotEmpty(affilateList) ? affilateList : []
        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name={AppConstants.firstName} rules={[{ required: true, message: ValidationConstants.nameField[0] }]}>
                            <InputWithHead
                                auto_complete='new-firstName'
                                required="required-field pb-3 pt-3"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                onChange={(firstName) => this.props.updateAddUmpireData(captializedString(firstName.target.value), 'firstName')}
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'First Name': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item name={AppConstants.lastName} rules={[{ required: true, message: ValidationConstants.nameField[1] }]}>
                            <InputWithHead
                                auto_complete="off"
                                required="required-field pb-3 pt-3"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                onChange={(lastName) => this.props.updateAddUmpireData(captializedString(lastName.target.value), 'lastName')}
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'Last Name': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <Form.Item
                            name={AppConstants.emailAdd}
                            rules={[
                                {
                                    required: true,
                                    message: ValidationConstants.emailField[0]
                                },
                                {
                                    type: "email",
                                    pattern: new RegExp(AppConstants.emailExp),
                                    message: ValidationConstants.email_validation
                                }
                            ]}
                        >
                            <InputWithHead
                                auto_complete='new-email'
                                required="required-field pb-3 pt-3"
                                heading={AppConstants.emailAdd}
                                placeholder={AppConstants.enterEmail}
                                onChange={(email) => this.props.updateAddUmpireData(email.target.value, 'email')}
                                // value={umpireData.email}
                                disabled={this.state.isEdit === true && true}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item
                            name={AppConstants.contactNO}
                            rules={[{ required: true, message: ValidationConstants.contactField }]}
                            help={hasError && ValidationConstants.mobileLength}
                            validateStatus={hasError ? "error" : 'validating'}
                        >
                            <InputWithHead
                                auto_complete='new-contact'
                                required="required-field pb-3 pt-3"
                                heading={AppConstants.contactNO}
                                placeholder={AppConstants.enterContactNo}
                                maxLength={10}
                                onChange={(mobileNumber) => this.onChangeNumber(mobileNumber.target.value)}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            required="required-field pb-3 pt-3"
                            heading={AppConstants.organisation}
                        />
                        <Form.Item
                            className="slct-in-add-manager-livescore"
                            name="umpireNewAffiliateName"
                            rules={[{ required: true, message: ValidationConstants.organisationField }]}
                        >
                            <Select
                                mode="multiple"
                                disabled={!this.state.isCompParent}
                                showSearch
                                placeholder={AppConstants.selectOrganisation}
                                className="w-100"
                                onChange={(affiliateIds) => this.props.updateAddUmpireData(affiliateIds, 'affiliates')}
                                optionFilterProp="children"
                                // onSearch={(name) => this.props.getUmpireAffiliateList({ id: this.state.competition_id, name: name })}
                                // notFoundContent={onAffiliateLoad ? <Spin size="small" /> : null}
                            >
                                {affiliateListResult.map((item) => (
                                    <Option key={'organisation_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                { umpireOwnTeam && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead required="pb-3 pt-3" heading={AppConstants.team} />
                            <Form.Item
                                name="teamsNames"
                                rules={[{ required: false, message: ValidationConstants.teamName }]}
                                className="slct-in-add-manager-livescore"
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder={AppConstants.selectTeam}
                                    className="w-100"
                                    onChange={(teamIds) => this.props.updateAddUmpireData(teamIds, 'teamId')}
                                    optionFilterProp="children"
                                >
                                    {teamsList.map((item) => (
                                        <Option key={'team_' + item.id} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                )}

                <Checkbox
                    className="single-checkbox pt-3"
                    checked={this.state.isUmpire}
                    onChange={(e) => this.setState({ isUmpire: e.target.checked })}
                >
                    {AppConstants.umpire}
                </Checkbox>

                <Checkbox
                    className="single-checkbox pt-3"
                    checked={this.state.isUmpireCoach}
                    onChange={(e) => this.setState({ isUmpireCoach: e.target.checked })}
                >
                    {AppConstants.umpireCoach}
                </Checkbox>

            </div>
        )
    }

    onButtonChange = (e) => {
        this.setState({ loader: true })
        this.props.updateAddUmpireData(e.target.value, 'umpireRadioBtn')
        this.formRef.current.setFieldsValue({
            umpireAffiliateName: []
        })
    }

    radioBtnContainer = () => {
        const { umpireRadioBtn } = this.props.umpireState
        return (
            <div className="content-view pb-0 pt-4 row">
                <span className="applicable-to-heading ml-4">{AppConstants.umpire}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={this.onButtonChange}
                    value={umpireRadioBtn}
                >
                    {/* radio button without tooltip */}
                    <div className="row ml-2" style={{ marginTop: 18 }}>
                        <Radio value="new">{AppConstants.new}</Radio>
                        <Radio value="existing">{AppConstants.existing} </Radio>
                    </div>
                </Radio.Group>
            </div>
        )
    }

    contentViewForAddUmpire = () => {
        const { umpireRadioBtn } = this.props.umpireState
        return (
            <div>
                {this.radioBtnContainer()}
                {umpireRadioBtn === 'new' ? this.umpireNewRadioBtnView() : this.umpireExistingRadioButton()}
            </div>
        )
    }

    contentViewForEditUmpire = () => (
        <div>
            {this.umpireNewRadioBtnView()}
        </div>
    )

    footerView = (isSubmitting) => (
        <div className="fluid-width">
            <div className="footer-view umpire-space">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <NavLink to="/umpire">
                                <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.cancel}</Button>
                            </NavLink>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="publish-button save-draft-text mr-0" type="primary" htmlType="submit" disabled={isSubmitting}>
                                {AppConstants.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    onSaveClick = () => {
        const {
            umpireData,
            affiliateId,
            umpireRadioBtn,
            exsitingUmpireId,
            umpireListData,
        } = this.props.umpireState

        if (umpireRadioBtn === 'new') {
            if (umpireData.mobileNumber.length !== 10) {
                this.setState({
                    hasError: true
                })
            } else if (this.state.isUmpire === false && this.state.isUmpireCoach === false) {
                message.config({ maxCount: 1, duration: 0.9 })
                message.error(ValidationConstants.pleaseSelectBetweenUmpireAndCoach)
            } else {
                const teamsIds = umpireData.teams.map(team => ({ id: team.id }));
                const body = {
                    firstName: umpireData.firstName,
                    lastName: umpireData.lastName,
                    mobileNumber: regexNumberExpression(umpireData.mobileNumber),
                    email: umpireData.email,
                    affiliates: umpireData.affiliates,
                    teams: teamsIds
                }
                if (this.state.isEdit === true) body.id = umpireData.id;

                this.props.addUmpireAction(
                    body,
                    affiliateId,
                    exsitingUmpireId,
                    {
                        screenName: this.state.screenName,
                        isEdit: this.state.isEdit
                    },
                    this.state.isUmpire,
                    this.state.isUmpireCoach
                );
            }
        }
        else if (umpireRadioBtn === 'existing') {
            const { existingUmpireCheckBox, existingUmpireCoach_CheckBox } = this.state;

            if (umpireListData.length === 0) {
                this.setState({ isUserNotFound: true })
            } else if (!existingUmpireCheckBox && existingUmpireCoach_CheckBox) {
                message.config({ maxCount: 1, duration: 0.9 })
                message.error(ValidationConstants.pleaseSelectBetweenUmpireAndCoach)
            } else {
                const getUmpireObjectIndex = umpireListData.findIndex((x) => x.id == exsitingUmpireId)
                const getUmpireObject = getUmpireObjectIndex < 0 ? null : umpireListData[getUmpireObjectIndex]
                const teamsIds = umpireData.teams.map(team => ({ id: team.id }));
                if (getUmpireObject !== null) {
                    const body = {
                        id: getUmpireObject.id,
                        firstName: getUmpireObject.firstName ? getUmpireObject.firstName : "",
                        lastName: getUmpireObject.lastName ? getUmpireObject.lastName : "",
                        mobileNumber: getUmpireObject.mobileNumber ? getUmpireObject.mobileNumber : "",
                        email: getUmpireObject.email ? getUmpireObject.email : "",
                        affiliates: umpireData.affiliates,
                        teams: teamsIds
                    }

                    this.setState({ isUserNotFound: false })
                    this.props.addUmpireAction(
                        body,
                        affiliateId,
                        exsitingUmpireId,
                        { screenName: this.state.screenName },
                        this.state.existingUmpireCheckBox,
                        this.state.existingUmpireCoach_CheckBox
                    )
                }
                else {
                    this.setState({ isUserNotFound: true })
                }
            }
        }
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <Loader visible={this.props.umpireState.onSaveLoad} />
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey={this.state.screenName === "umpireDashboard" ? "1" : "2"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onSaveClick}
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView">
                                {this.state.isEdit === true ? this.contentViewForEditUmpire() : this.contentViewForAddUmpire()}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireListAction,
        updateAddUmpireData,
        addUmpireAction,
        getUmpireAffiliateList,
        umpireSearchAction,
        umpireClear,
        getUmpireTeams,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireState: state.UmpireState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUmpire);
