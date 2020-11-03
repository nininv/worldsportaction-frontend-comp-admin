import React, { Component, createRef } from "react";
import { Layout, Breadcrumb, Button, Form, Select, Radio, Spin, AutoComplete } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty, captializedString, regexNumberExpression } from "../../util/helpers";
import Loader from '../../customComponents/loader'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import {
    liveScoreUpdateCoach,
    liveScoreAddEditCoach,
    liveScoreCoachListAction,
    liveScoreClear
} from '../../store/actions/LiveScoreAction/liveScoreCoachAction'
import { liveScoreManagerSearch } from '../../store/actions/LiveScoreAction/liveScoreManagerAction'

const { Footer, Content, Header } = Layout;
const { Option } = Select;

class LiveScoreAddEditCoach extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conpetitionId: null,
            searchText: "",
            loader: false,
            tableRecord: this.props.location.state ? this.props.location.state.tableRecord : null,
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            teamLoad: false,
        }
        this.formRef = createRef();
    }

    componentDidMount() {
        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.setState({ conpetitionId: id })
            if (id !== null) {
                this.props.getliveScoreTeams(id)
            }
            if (this.state.isEdit === true) {
                this.props.liveScoreUpdateCoach(this.state.tableRecord, 'isEditCoach')
                this.setState({ loader: true })
            } else {
                this.props.liveScoreUpdateCoach('', 'isAddCoach')
            }
            if (this.state.isEdit === true) {
                this.setInitalFiledValue()
            }
        } else {
            history.push('/liveScoreCompetitions')
        }
    }

    componentDidUpdate(nextProps) {
        if (this.state.loader && nextProps.liveScoreCoachState.onLoad == false) {
            this.setInitalFiledValue()
            this.setState({ loader: false })
        }
        if (this.props.liveScoreCoachState !== nextProps.liveScoreCoachState) {
            if (this.state.teamLoad) {
                const { teamId } = this.props.liveScoreCoachState
                this.setSelectedTeamValue(teamId)
                this.setState({ teamLoad: false })
            }
        }
    }

    setInitalFiledValue() {
        const { coachdata, teamId } = this.props.liveScoreCoachState
        let data = this.state.tableRecord
        this.formRef.current.setFieldsValue({
            'First Name': coachdata.firstName,
            'Last Name': coachdata.lastName,
            'Email Address': coachdata.email,
            'Contact no': coachdata.mobileNumber,
            'Select Team': teamId
        })
    }

    setSelectedTeamValue(teamId) {
        this.formRef.current.setFieldsValue({
            'coachTeamName': teamId
        })
    }

    getNumber = (number) => {
        if (number.length === 10) {
            this.setState({
                hasError: false
            })
            this.props.liveScoreUpdateCoach(regexNumberExpression(number), 'mobileNumber')
        } else if (number.length < 10) {
            this.props.liveScoreUpdateCoach(regexNumberExpression(number), 'mobileNumber')
            this.setState({
                hasError: true
            })
        }
        setTimeout(() => {
            this.setInitalFiledValue()
        }, 300);
    }

    ///////view for breadcrumb
    headerView = () => {
        let isEdit = this.props.location ? this.props.location.state ? this.props.location.state.isEdit : null : null
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div className="row">
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">
                                    {isEdit ? AppConstants.editCoach : AppConstants.addCoach}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        )
    }

    ////form view
    contentViewForAddCoach = () => {
        const { coachRadioBtn } = this.props.liveScoreCoachState
        return (
            <div>
                {this.radioBtnContainer()}
                {coachRadioBtn == 'new' ? this.coachNewRadioBtnView() : this.coachExistingRadioButton()}
            </div>
        )
    }

    contentViewForEditCoach = () => {
        const { coachRadioBtn } = this.props.liveScoreCoachState
        return (
            <div>
                {this.coachNewRadioBtnView()}
            </div>
        )
    }

    radioBtnContainer() {
        const { coachRadioBtn } = this.props.liveScoreCoachState
        return (
            <div className="content-view pb-0 pt-4 row">
                <span className="applicable-to-heading ml-4">{AppConstants.coach}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onButtonChage(e)}
                    value={coachRadioBtn}
                >
                    <div className="row ml-2" style={{ marginTop: 18 }}>
                        <Radio value="new">{AppConstants.new}</Radio>
                        <Radio value="existing">{AppConstants.existing} </Radio>
                    </div>
                </Radio.Group>
            </div>
        )
    }

    onButtonChage(e) {
        this.setState({ loader: true })
        this.props.liveScoreUpdateCoach(e.target.value, 'coachRadioBtn')
    }

    coachNewRadioBtnView() {
        let hasError = this.state.hasError
        const { coachdata, teamId, teamResult } = this.props.liveScoreCoachState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []
        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name={AppConstants.firstName} rules={[{ required: true, message: ValidationConstants.nameField[0] }]}>
                            <InputWithHead
                                auto_complete="new-password"
                                type="text"
                                required="required-field pb-3 pt-3"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                onChange={(firstName) => this.props.liveScoreUpdateCoach(captializedString(firstName.target.value), 'firstName')}
                                // value={coachdata.firstName}
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
                                onChange={(lastName) => this.props.liveScoreUpdateCoach(captializedString(lastName.target.value), 'lastName')}
                                // value={coachdata.lastName}
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
                                auto_complete="new-email"
                                type="email"
                                required="required-field pb-3 pt-3"
                                heading={AppConstants.emailAdd}
                                placeholder={AppConstants.enterEmail}
                                onChange={(email) => this.props.liveScoreUpdateCoach(email.target.value, 'email')}
                                // value={coachdata.email}
                                disabled={this.state.isEdit && true}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item
                            name={AppConstants.contactNO}
                            rules={[{
                                required: true,
                                message: ValidationConstants.contactField,
                            }]}
                            help={hasError && ValidationConstants.mobileLength}
                            validateStatus={hasError ? 'error' : 'validating'}
                        >
                            <InputWithHead
                                auto_complete="new-contact"
                                required="required-field pb-3 pt-3"
                                heading={AppConstants.contact_No}
                                placeholder={AppConstants.enterContactNo}
                                value={AppConstants.contactNO}
                                maxLength={10}
                                onChange={(mobileNumber) => this.getNumber(mobileNumber.target.value)}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.team} required="required-field pb-3 pt-3" />
                        <Form.Item
                            name={AppConstants.selectTeam}
                            rules={[{ required: true, message: ValidationConstants.teamName }]}
                            className="slct-in-add-manager-livescore"
                        >
                            <Select
                                // loading={this.props.liveScoreState.onLoad && true}
                                mode="multiple"
                                placeholder={AppConstants.selectTeam}
                                style={{ width: "100%" }}
                                onChange={(teamId) => this.props.liveScoreUpdateCoach(teamId, 'teamId')}
                                // value={[741, 738]}
                                showSearch
                                optionFilterProp="children"
                            >
                                {teamData.map((item) => (
                                    <Option key={'team_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </div>
        )
    }

    coachExistingRadioButton() {
        const { coachdata, teamId, teamResult, coachesResult, onLoadSearch } = this.props.liveScoreCoachState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []
        let coachList = isArrayNotEmpty(coachesResult) ? coachesResult : []
        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            required="required-field pb-3 pt-3"
                            heading={AppConstants.coachSearch}
                        />
                        <Form.Item name={AppConstants.team} rules={[{ required: true, message: ValidationConstants.searchCoach }]}>

                            <AutoComplete
                                loading
                                style={{ width: "100%", height: '44px' }}
                                placeholder="Select User"
                                onSelect={(item, option) => {
                                    const ManagerId = option.key
                                    // this.props.liveScoreClear()
                                    this.props.liveScoreUpdateCoach(ManagerId, 'coachSearch')
                                    this.setState({ teamLoad: true })
                                }}
                                notFoundContent={onLoadSearch ? <Spin size="small" /> : null}
                                onSearch={(value) => {
                                    // value
                                    //     ? this.props.liveScoreManagerSearch(value, this.state.conpetitionId)
                                    //     : this.props.liveScoreCoachListAction(3, 1, this.state.conpetitionId)
                                    this.props.liveScoreCoachListAction(3, 1, this.state.conpetitionId, value)
                                }}
                            >
                                {coachList.map((item) => (
                                    <Option key={'coach_' + item.id} value={item.firstName + " " + item.lastName}>
                                        {item.firstName + " " + item.lastName}
                                    </Option>
                                ))}
                            </AutoComplete>
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            required="required-field pb-3 pt-3"
                            heading={AppConstants.team}
                        />
                        <Form.Item
                            name="coachTeamName"
                            rules={[{ required: true, message: ValidationConstants.teamName }]}
                            className="slct-in-add-manager-livescore"
                        >

                            <Select
                                // loading={this.props.liveScoreState.onLoad && true}
                                mode="multiple"
                                showSearch
                                placeholder={AppConstants.selectTeam}
                                style={{ width: "100%", }}
                                onChange={(teamId) => this.props.liveScoreUpdateCoach(teamId, 'teamId')}
                                // value={teamId}
                                optionFilterProp="children"
                            >
                                {teamData.map((item) => (
                                    <Option key={'team_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </div>
        )
    }

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                <NavLink to="/liveScoreCoaches">
                                    <Button className="cancelBtnWidth" type="cancel-button">
                                        {AppConstants.cancel}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button
                                    className="publish-button save-draft-text mr-0"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={isSubmitting}
                                >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onSaveClick = values => {
        const { coachdata, teamId, coachRadioBtn, exsitingManagerId } = this.props.liveScoreCoachState
        if (coachRadioBtn == 'new') {
            if (coachdata.mobileNumber.length !== 10) {
                this.setState({
                    hasError: true
                })
            } else {
                let body = ''
                if (coachRadioBtn == 'new') {
                    if (this.state.isEdit) {
                        body = {
                            id: coachdata.id,
                            firstName: coachdata.firstName,
                            lastName: coachdata.lastName,
                            mobileNumber: regexNumberExpression(coachdata.mobileNumber),
                            email: coachdata.email,
                            teams: coachdata.teams
                        }
                    } else {
                        body = {
                            firstName: coachdata.firstName,
                            lastName: coachdata.lastName,
                            mobileNumber: regexNumberExpression(coachdata.mobileNumber),
                            email: coachdata.email,
                            teams: coachdata.teams
                        }
                    }
                    this.props.liveScoreAddEditCoach(body, teamId, exsitingManagerId)
                } else if (coachRadioBtn == 'existing') {
                    body = {
                        id: exsitingManagerId,
                        teams: coachdata.teams
                    }
                    this.props.liveScoreAddEditCoach(body, teamId, exsitingManagerId)
                }
            }
        } else {
            let body = ''
            if (coachRadioBtn == 'new') {
                if (this.state.isEdit) {
                    body = {
                        id: coachdata.id,
                        firstName: coachdata.firstName,
                        lastName: coachdata.lastName,
                        mobileNumber: regexNumberExpression(coachdata.mobileNumber),
                        email: coachdata.email,
                        teams: coachdata.teams
                    }
                } else {
                    body = {
                        firstName: coachdata.firstName,
                        lastName: coachdata.lastName,
                        mobileNumber: regexNumberExpression(coachdata.mobileNumber),
                        email: coachdata.email,
                        teams: coachdata.teams
                    }
                }
                this.props.liveScoreAddEditCoach(body, teamId, exsitingManagerId)
            } else if (coachRadioBtn == 'existing') {
                body = {
                    id: exsitingManagerId,
                    teams: coachdata.teams
                }
                this.props.liveScoreAddEditCoach(body, teamId, exsitingManagerId)
            }
        }
    };

    /////// render function
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />

                <Loader visible={this.props.liveScoreCoachState.loading} />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="23" />

                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onSaveClick}
                        className="login-form"
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView">
                                {this.state.isEdit ? this.contentViewForEditCoach() : this.contentViewForAddCoach()}
                                {/* {this.coachView(getFieldDecorator)} */}
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
        getliveScoreTeams,
        liveScoreUpdateCoach,
        liveScoreAddEditCoach,
        liveScoreCoachListAction,
        liveScoreManagerSearch,
        liveScoreClear
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState,
        liveScoreCoachState: state.LiveScoreCoachState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreAddEditCoach);
