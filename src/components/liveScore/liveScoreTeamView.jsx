import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Modal, message, Menu } from 'antd';
import './liveScore.css';
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTeamViewPlayerList, liveScoreDeleteTeam } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import moment from "moment";
import { liveScoreDeletePlayerAction } from "../../store/actions/LiveScoreAction/liveScorePlayerAction";

import Loader from '../../customComponents/loader'
import { isArrayNotEmpty } from '../../util/helpers'
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";

const { Content } = Layout;
const { confirm } = Modal;
const { SubMenu } = Menu;

////columns data
var _this;
const columns = [

    {
        title: 'Profile Picture',
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        sorter: (a, b) => a.photoUrl.length - b.photoUrl.length,
        render: photoUrl =>
            photoUrl ?
                <img className="user-image" src={photoUrl} alt="" height="70" width="70" />
                :
                <span>{'No Image'}</span>
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        render: (name, record) => {
            return (
                // <NavLink to={{
                //     pathname: '/liveScorePlayerView',
                //     state: { tableRecord: record }
                // }}>
                <span style={{ color: '#ff8237', cursor: "pointer" }}
                    onClick={() => _this.checkUserId(record)}
                >{(record.firstName && record.lastName) && record.firstName + ' ' + record.lastName}</span>
                // </NavLink>)
            )
        }
    },
    {
        title: 'DOB',
        dataIndex: 'dob',
        key: 'dob',
        sorter: (a, b) => a.dob.length - b.dob.length,
        render: (dob, record) => <span>{record.dateOfBirth ? moment(record.dateOfBirth).format('DD/MM/YYYY') : '    '}</span>
    },
    {
        title: 'Contact No.',
        dataIndex: 'number',
        key: 'number',
        sorter: (a, b) => a.number.length - b.number.length,
        render: (dob, record) => <span>{record.phoneNumber ? record.phoneNumber : ''}</span>
    },
    {
        title: "Action",
        render: (data, record, playerId) => <Menu
            className="action-triple-dot-submenu"
            theme="light"
            mode="horizontal"
            style={{ lineHeight: '25px' }}
        >
            <Menu.SubMenu
                key="sub1"
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item key={'1'}>
                    <NavLink to={{ pathname: "/liveScoreAddPlayer", state: { isEdit: true, playerData: record } }} >
                        <span>Edit</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => {
                    _this.showDeleteConfirmPlayer(record.id, record.competitionId);

                }}>

                    <span>Delete</span>
                </Menu.Item>

            </Menu.SubMenu>
        </Menu>
    }
];


class LiveScoreTeamView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.location.state ? props.location.state.tableRecord ? props.location.state.tableRecord : null : null,
            // teamId: props.location.state ? props.location.state.teamId : null,
            teamId: props.location ? props.location.state ? props.location.state.tableRecord ? props.location.state.tableRecord.teamId ? props.location.state.tableRecord.teamId : props.location ? props.location.state ? props.location.state.tableRecord ? props.location.state.tableRecord.id ? props.location.state.tableRecord.id : props.location ? props.location.state ? props.location.state.tableRecord ? props.location.state.tableRecord.team ? props.location.state.tableRecord.team.id : null : null : null : null : null : null : null : null : null : null,
            screenName: this.props.location.state ? this.props.location.state.screenName : null,
            key: props.location.state ? props.location.state.key ? props.location.state.key : null : null,
            // teamId: null
        }
        _this = this
    }

    checkUserId(record) {
        if (record.userId == null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.playerMessage)
        }
        else {
            history.push("/userPersonal", { userId: record.userId, screenKey: "livescore", screen: "/liveScorePlayerList" })
        }
    }
    componentDidMount() {
        // const { teamId } = this.props.location ? this.props.location.state : null
        let teamId = this.props.location ? this.props.location.state ? this.props.location.state.teamId : null : null

        let teamIds = this.state.teamId ? this.state.teamId : teamId
        if (teamIds) {
            this.props.getTeamViewPlayerList(teamIds)
        } else {
            history.push("/liveScoreCompetitions")
        }
    }
    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreTeamState != this.props.liveScoreTeamState) {

        }
    }

    // Delete Player
    deletePlayer = (playerId, competitionId) => {
        this.props.liveScoreDeletePlayerAction(playerId, competitionId, 0, "team")

    }

    showDeleteConfirmPlayer = (playerId, competitionId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this player?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deletePlayer(playerId, competitionId)

            },
            onCancel() {
            },
        });
    }


    ////view for profile image
    profileImageView = () => {
        // let data = this.state.data 
        let data = this.props.location ? this.props.location.state ? this.props.location.state.tableRecord ? this.props.location.state.tableRecord : null : null : null
        const { teamData, managerData, managerList } = this.props.liveScoreTeamState
        const { name, logoUrl } = teamData ? teamData : ''
        const { mobileNumber, email } = managerData ? managerData : ''

        let managerDataList = isArrayNotEmpty(managerList) ? managerList : []
        let coachData = isArrayNotEmpty(data && data.coaches) ? data.coaches : []
        return (
            <div className="fluid-width mt-2">

                <div className='profile-image-view mr-5' >

                    {
                        this.props.liveScoreTeamState && this.props.liveScoreTeamState.teamData ?
                            <img className="user-image" src={logoUrl ? logoUrl : ''} alt="" height="80" width="80" />
                            :
                            <span className="user-contact-heading">{'No Image'}</span>
                    }


                    <span className="user-contact-heading">{name ? name : ''}</span>
                </div>

                <div className="profile-img-view-style">
                    <span className="user-contact-heading">{AppConstants.manager}</span>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.name}</span>
                        </div>

                        {managerDataList.map((item) => (
                            <span className="desc-text-style side-bar-profile-data">{(item.firstName || item.lastName) && item.firstName + " " + item.lastName}</span>
                        ))
                        }
                    </div>

                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.email}</span>
                        </div>
                        {managerDataList.map((item) => (
                            <span className="desc-text-style side-bar-profile-data">{item.email}</span>
                        ))
                        }
                    </div>

                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.contactNumber}</span>
                        </div>
                        {managerDataList.map((item) => (
                            <span className="desc-text-style side-bar-profile-data">{item.mobileNumber}</span>
                        ))
                        }
                    </div>

                    {/* coaches View */}
                    <div>
                        <span className="user-contact-heading">{AppConstants.coach}</span>

                        <div className="live-score-side-desc-view">
                            <div className="live-score-title-icon-view">
                                <div className="live-score-icon-view">
                                    <img src={AppImages.group} height="16" width="16" alt="" />
                                </div>
                                <span className='year-select-heading ml-3'>{AppConstants.name}</span>
                            </div>

                            {coachData.map((item) => (
                                <span className="desc-text-style side-bar-profile-data">{item.name && item.name}</span>
                            ))
                            }
                        </div>

                        <div className="live-score-side-desc-view">
                            <div className="live-score-title-icon-view">
                                <div className="live-score-icon-view">
                                    <img src={AppImages.group} height="16" width="16" alt="" />
                                </div>
                                <span className='year-select-heading ml-3'>{AppConstants.email}</span>
                            </div>
                            {coachData.map((item) => (
                                <span className="desc-text-style side-bar-profile-data">{item.email}</span>
                            ))
                            }
                        </div>

                        <div className="live-score-side-desc-view">
                            <div className="live-score-title-icon-view">
                                <div className="live-score-icon-view">
                                    <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                                </div>
                                <span className='year-select-heading ml-3'>{AppConstants.contactNumber}</span>
                            </div>
                            {coachData.map((item) => (
                                <span className="desc-text-style side-bar-profile-data">{item.mobileNumber}</span>
                            ))
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    addPlayerView() {
        const { teamData, managerData, } = this.props.liveScoreTeamState
        const { name, logoUrl, id } = teamData ? teamData : ''
        const { mobileNumber, email } = managerData ? managerData : ''
        return (
            <div className="row ">
                <div className="col-sm" >
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.players}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end", }}>
                    <div
                        className="comp-dashboard-botton-view-mobile"
                    >
                        <NavLink to={{
                            pathname: '/liveScoreAddPlayer',
                            state: { ...this.props.location.state, screenName: this.state.screenName }
                        }}>
                            <Button className="primary-add-comp-form" type="primary">
                                + {AppConstants.addPlayer}
                            </Button>
                        </NavLink>
                    </div>


                </div>
            </div>
        )
    }

    deleteTeam = (teamId) => {
        this.props.liveScoreDeleteTeam(teamId)
        // this.setState({ deleteLoading: true })
    }

    showDeleteConfirm = (teamId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this team?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deleteTeam(teamId)
            },
            onCancel() {
            },
        });
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="row mt-5">

                <div className="col-sm" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                    <div className="row">
                        <div className="col-sm">
                            <div
                                className="comp-dashboard-botton-view-mobile"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <NavLink to={{
                                    pathname: "/liveScoreAddTeam",
                                    state: { isEdit: true, teamId: this.state.teamId ? this.state.teamId : this.props.location ? this.props.location.state ? this.props.location.state.teamId : null : null, key: this.state.key }
                                }}>
                                    <Button className="primary-add-comp-form" type="primary">
                                        + {AppConstants.edit}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div
                                className="comp-dashboard-botton-view-mobile"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-end"
                                }}
                            >

                                <Button onClick={() => this.showDeleteConfirm(this.state.teamId)} className="primary-add-comp-form" type="primary">
                                    {AppConstants.delete}
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            // </div>
        )
    }

    //////// tableView 
    tableView = () => {
        const { playerList } = this.props.liveScoreTeamState
        return (
            <div >
                <div className="inside-table-view mt-4" >
                    {this.addPlayerView()}

                    <div className="table-responsive home-dash-table-view mt-3">
                        <Table
                            //  loading={this.props.liveScoreTeamState.onLoad} 
                            className="home-dashboard-table" columns={columns}
                            dataSource={playerList} pagination={false} />
                    </div>

                </div>
            </div >
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={this.state.screenName === 'fromMatchList' ? '2' : this.state.screenName === 'liveScoreDashboard' ? "1" : this.state.screenName === 'fromPlayerList' ? '7' : '3'} />
                <Loader visible={this.props.liveScoreTeamState.onLoad} />
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width" >
                            <div className="row" >
                                <div className="col-sm-3" style={{ marginBottom: "6%" }} >
                                    {this.profileImageView()}
                                </div>
                                <div className="col-sm-9" style={{ backgroundColor: "#f7fafc", }}>
                                    {this.headerView()}
                                    {this.tableView()}
                                </div>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div >
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getTeamViewPlayerList, liveScoreDeleteTeam, liveScoreDeletePlayerAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreTeamView));

