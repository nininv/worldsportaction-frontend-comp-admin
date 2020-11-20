import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Form
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import AppImages from "../../themes/appImages";
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import {
    liveScoreUpdatePlayerDataAction,
    liveScoreAddEditPlayerAction
} from '../../store/actions/LiveScoreAction/liveScorePlayerAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
import history from '../../util/history'
import Loader from '../../customComponents/loader'
import { getLiveScoreCompetiton, getUmpireCompetitonData } from '../../util/sessionStorage'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { isArrayNotEmpty, captializedString, regexNumberExpression } from '../../util/helpers';
import ImageLoader from '../../customComponents/ImageLoader'

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LiveScoreAddPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: AppImages.circleImage,
            teamSelection: "",
            playerId: '',
            firstName: '',
            lastName: '',
            contactNo: '',
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            loading: false,
            playerData: props.location.state ? props.location.state.playerData : null,
            temaViewPlayer: props.location.state ? props.location.state.temaViewPlayer ? props.location.state.temaViewPlayer : null : null,
            screenName: props.location.state ? props.location.state.screenName : null,
            teamId: props.location.state ? props.location.state.tableRecord ? props.location.state.tableRecord.id : null : null,
            timeout: null,
            screenKey: this.props.location.state ? this.props.location.state.screenKey : null,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        const { screenKey } = this.state

        if (screenKey == 'umpire') {
            if (getUmpireCompetitonData()) {
                const { id } = JSON.parse(getUmpireCompetitonData())
                this.props.getliveScoreTeams(id)

                if (this.state.isEdit) {
                    if (this.props.location.state.screen === 'editTeam') {
                        this.props.liveScoreUpdatePlayerDataAction({
                            playerId: this.state.playerData.mnbPlayerId,
                            firstName: this.state.playerData.firstName,
                            lastName: this.state.playerData.lastName,
                            profilePicture: this.state.playerData.photoUrl,
                            phoneNumber: this.state.playerData.phoneNumber,
                            dob: this.state.playerData.dateOfBirth,
                            team: this.state.playerData.teamId,
                            division: { id: 1 }
                        }, 'editplayerScreen')
                    } else {
                        this.props.liveScoreUpdatePlayerDataAction(this.state.playerData, 'editplayerScreen')
                    }

                    this.setInitalFiledValue()
                } else {
                    this.props.liveScoreUpdatePlayerDataAction('', 'addplayerScreen')
                    let teamsId = this.state.teamId ? this.state.teamId : this.props.location.state ? this.props.location.state.teamId : null
                    const { playerData } = this.props.liveScorePlayerState

                    playerData.phoneNumber = ""
                    playerData.dateOfBirth = ""

                    if (teamsId) {
                        this.formRef.current.setFieldsValue({
                            team: teamsId
                        })
                    }
                }
            } else {
                history.push('/')
            }
        } else {
            if (getLiveScoreCompetiton()) {
                const { id } = JSON.parse(getLiveScoreCompetiton())
                this.props.getliveScoreTeams(id)

                if (this.state.isEdit) {
                    if (this.props.location.state.screen === 'editTeam') {
                        this.props.liveScoreUpdatePlayerDataAction({
                            playerId: this.state.playerData.mnbPlayerId,
                            firstName: this.state.playerData.firstName,
                            lastName: this.state.playerData.lastName,
                            profilePicture: this.state.playerData.photoUrl,
                            phoneNumber: this.state.playerData.phoneNumber,
                            dob: this.state.playerData.dateOfBirth,
                            team: this.state.playerData.teamId,
                            division: { id: 1 }
                        }, 'editplayerScreen')
                    } else {
                        this.props.liveScoreUpdatePlayerDataAction(this.state.playerData, 'editplayerScreen')
                    }

                    this.setInitalFiledValue()
                } else {
                    this.props.liveScoreUpdatePlayerDataAction('', 'addplayerScreen')
                    let teamsId = this.state.teamId ? this.state.teamId : this.props.location.state ? this.props.location.state.teamId : null
                    const { playerData } = this.props.liveScorePlayerState

                    playerData.phoneNumber = ""
                    playerData.dateOfBirth = ""

                    if (teamsId) {
                        this.formRef.current.setFieldsValue({
                            team: teamsId
                        })
                    }
                }
            } else {
                history.push('/liveScoreCompetitions')
            }
        }


    }

    setInitalFiledValue() {
        const { playerData } = this.props.liveScorePlayerState
        this.formRef.current.setFieldsValue({
            'firstName': playerData.firstName,
            'lastName': playerData.lastName,
            team: playerData.teamId ? playerData.teamId : this.state.teamId
        })
    }

    ////method to setimage
    setImage = (data) => {
        const { playerData } = this.props.liveScorePlayerState

        if (data.files[0] !== undefined) {
            this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]) })
            if (this.state.isEdit) {
                playerData.photoUrl = null
            }
        }

        // this.props.liveScoreUpdatePlayerDataAction(this.state.image, "photoUrl")
    };

    ///method to open file to select image
    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    ///////view for breadcrumb
    headerView = () => {
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
                            {this.state.isEdit ? AppConstants.editPlayer : AppConstants.addPlayer}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    contentView = () => {
        // let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
        const { playerData, teamResult } = this.props.liveScorePlayerState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []

        return (
            <div className="content-view pt-0">
                {/* First and Last name row */}
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name='firstName' rules={[{ required: true, message: ValidationConstants.nameField[0] }]}>
                            <InputWithHead
                                auto_complete='new-password'
                                type='text'
                                required="required-field pb-0"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.enterFirstName}
                                onChange={(firstName) => this.props.liveScoreUpdatePlayerDataAction(captializedString(firstName.target.value), 'firstName')}
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'firstName': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item name='lastName' rules={[{ required: true, message: ValidationConstants.nameField[1] }]}>
                            <InputWithHead
                                auto_complete="off"
                                required="required-field pb-0"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.enterLastName}
                                onChange={(lastName) => this.props.liveScoreUpdatePlayerDataAction(captializedString(lastName.target.value), 'lastName')}
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'lastName': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* DOB and Contact No. row */}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dOB} />
                        <DatePicker
                            size="large"
                            style={{ width: '100%' }}
                            onChange={(dateOfBirth) => dateOfBirth && this.props.liveScoreUpdatePlayerDataAction(moment(dateOfBirth).format('DD-MM-YYYY'), 'dateOfBirth')}
                            format="DD-MM-YYYY"
                            placeholder="dd-mm-yyyy"
                            showTime={false}
                            name={'date'}
                            value={playerData.dateOfBirth && moment(playerData.dateOfBirth, "DD-MM-YYYY")}
                        // value={playerData.dateOfBirth}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            auto_complete='new-contact'
                            heading={AppConstants.contactNO}
                            placeholder={AppConstants.enterContactNo}
                            maxLength={10}
                            onChange={(phoneNumber) => this.props.liveScoreUpdatePlayerDataAction(phoneNumber.target.value, 'phoneNumber')}
                            value={playerData.phoneNumber}
                        />
                    </div>
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            auto_complete='new-mnbId'
                            heading={AppConstants.playerId}
                            placeholder={AppConstants.enterPlayerID}
                            onChange={(mnbPlayerId) => this.props.liveScoreUpdatePlayerDataAction(mnbPlayerId.target.value, 'mnbPlayerId')}
                            value={playerData.mnbPlayerId}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead required="required-field" heading={AppConstants.team} />
                        <Form.Item name='team' rules={[{ required: true, message: ValidationConstants.teamName }]}>
                            <Select
                                loading={this.props.liveScoreState.onLoad && true}
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                onChange={(teamId) => this.props.liveScoreUpdatePlayerDataAction(teamId, 'teamId')}
                                value={playerData.teamId}
                                placeholder={AppConstants.selectTeam}
                            >
                                {isArrayNotEmpty(teamData) && teamData.map((item) => (
                                    <Option key={'team_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                {/* Profile Selection and check box row */}

                <InputWithHead heading={AppConstants.profilePic} required="mb-1" />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <ImageLoader
                                    timeout={this.state.timeout}
                                    src={playerData.photoUrl ? playerData.photoUrl : this.state.profileImage}
                                />
                            </div>
                            <input
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                onChange={(evt) => {
                                    this.setImage(evt.target)
                                    this.setState({ timeout: 2000 })
                                    setTimeout(() => {
                                        this.setState({ timeout: null })
                                    }, 2000);
                                }}
                            />
                            <span className="form-err">{this.state.imageError}</span>
                        </div>
                        {/* <div
                            className="col-sm"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <Checkbox
                                className="single-checkbox"
                                defaultChecked
                                // onChange={e => this.onChange(e)}
                            >
                                {AppConstants.useDefault}
                            </Checkbox>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    };

    ////Api call after on save click
    onSaveClick = (e) => {
        const {
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            mnbPlayerId,
            teamId,
            competitionId,
            photoUrl
        } = this.props.liveScorePlayerState.playerData

        let playerId = this.state.playerData ? this.state.playerData.playerId ? this.state.playerData.playerId : this.state.playerData.id ? this.state.playerData.id : '' : ''
        let compId = null
        if (this.state.screenKey == 'umpire') {
            const { id } = JSON.parse(getUmpireCompetitonData())
            compId = id
        } else {
            let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetition'))
            compId = id
        }

        let selectedTeamId = teamId ? teamId : this.state.teamId ? this.state.teamId : this.props.location.state ? this.props.location.state.teamId : null

        let body = new FormData();
        body.append('id', playerId ? playerId : 0)
        body.append('firstName', firstName)
        body.append('lastName', lastName);
        body.append("dateOfBirth", dateOfBirth);
        body.append("phoneNumber", regexNumberExpression(phoneNumber));
        body.append("mnbPlayerId", mnbPlayerId);
        body.append("teamId", selectedTeamId);
        body.append("competitionId", compId)

        if (this.state.image) {
            body.append("photo", this.state.image) //// this.props.location.state ? this.props.location.state.teamId
        }

        this.props.liveScoreAddEditPlayerAction(body, playerId, {
            teamId: selectedTeamId,
            screen: this.props.location.state ? this.props.location.state.screen : null,
            screenName: this.state.screenName
        })

        // this.props.liveScoreAddEditPlayerAction(playerData, playerId, this.state.image, this.state.temaViewPlayer, { teamId: playerData.teamId, screen: this.props.location.state ? this.props.location.state.screen : null, screenName: this.state.screenName })
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm" style={{ paddingLeft: 10 }}>
                            <div className="reg-add-save-button">
                                <Button
                                    className="cancelBtnWidth"
                                    onClick={() => history.push(this.state.temaViewPlayer ? 'liveScoreTeamView' : '/liveScorePlayerList', { ...this.props.location.state })}
                                    type="cancel-button"
                                >
                                    {AppConstants.cancel}
                                </Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Form.Item>
                                    <Button
                                        className="publish-button save-draft-text mr-0"
                                        type="primary"
                                        htmlType="submit"
                                        disabled={isSubmitting}
                                    >
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
        const { screenKey } = this.state
        return (
            <div className="fluid-width default-bg">
                {
                    screenKey == 'umpire' ?
                        <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                        :
                        <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                }

                {
                    screenKey == 'umpire' ?
                        <InnerHorizontalMenu menu={"user"} userSelectedKey={"1"} />
                        :
                        <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={this.state.screenName == 'fromTeamList' ? '3' : this.state.screenName == 'fromMatchList' ? '2' : "7"} />
                }
                <Loader visible={this.props.liveScorePlayerState.onLoad} />
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
        getliveScoreDivisions,
        liveScoreUpdatePlayerDataAction,
        liveScoreAddEditPlayerAction,
        getliveScoreTeams
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
        liveScorePlayerState: state.LiveScorePlayerState,
        liveScoreTeamState: state.LiveScoreTeamState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreAddPlayer);
