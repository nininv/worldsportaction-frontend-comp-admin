import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Layout, Button, Table, Pagination, Spin, message, Menu, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "./liveScore.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import {
    playerListWithPaginationAction,
    liveScoreDeletePlayerAction
} from "../../store/actions/LiveScoreAction/liveScorePlayerAction";
import { liveScore_formateDate } from "../../themes/dateformate";
import history from "../../util/history";
import { getLiveScoreCompetiton } from "../../util/sessionStorage";
import { exportFilesAction } from "../../store/actions/appAction";
import ValidationConstants from "../../themes/validationConstant";
import { teamListData } from "../../util/helpers";

const { Content } = Layout;
const { SubMenu } = Menu;
const { confirm } = Modal;

let _this = null;

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;

    if (_this.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (_this.state.sortBy === key && _this.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    _this.setState({ sortBy, sortOrder });
    if (_this.state.competitionId) {
        _this.props.playerListWithPaginationAction(_this.state.competitionId, _this.state.offset, 10, _this.state.searchText, sortBy, sortOrder);
    }
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: 'Profile Picture',
        dataIndex: 'profilePicture',
        key: 'profilePicture',
        render: (profilePicture) => {
            return (
                profilePicture ? (
                    <img className="user-image" src={profilePicture} alt="" height="70" width="70" />
                ) : (
                    <span>{AppConstants.noImage}</span>
                )
            )
        }
    },
    {
        title: 'Player ID',
        dataIndex: 'playerId',
        key: 'playerId',
        sorter: true,
        onHeaderCell: () => listeners('id'),
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstsName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) =>
            // <NavLink to={{
            //     pathname: '/matchDayPlayerView',
            //     state: { tableRecord: record }
            // }}>
            <span
                className="input-heading-add-another pt-0"
                onClick={() => _this.checkUserId(record)}
            >
                {firstName}
            </span>
        // </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) =>
            // <NavLink to={{
            //     pathname: '/matchDayPlayerView',
            //     state: { tableRecord: record }
            // }}>
            <span
                className="input-heading-add-another pt-0"
                onClick={() => _this.checkUserId(record)}
            >
                {lastName}
            </span>
        // </NavLink>
    },
    {
        title: 'DOB',
        dataIndex: 'dob',
        key: 'dob',
        sorter: true,
        onHeaderCell: () => listeners('dateOfBirth'),
        render: (dob) => (
            <span>{dob ? liveScore_formateDate(dob) : ""}</span>
        )
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (division) => (
            <span>{division.name}</span>
        )
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team, record) => teamListData(team.id) ? (
            <NavLink
                to={{
                    pathname: "/matchDayTeamView",
                    state: { tableRecord: record, screenName: 'fromPlayerList' }
                }}
            >
                <span className="input-heading-add-another pt-0">{team.name}</span>
            </NavLink>
        ) : (
            <span>{team.name}</span>
        )
    },
    {
        title: 'Contact No',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Action",
        key: 'action',
        render: (data, record, playerId) => (
            <Menu
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
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: "/matchDayAddPlayer", state: { isEdit: true, playerData: record } }}>
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => {
                        _this.showDeleteConfirm(record.playerId);
                    }}>
                        <span>Delete</span>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        )
    }
];

class LiveScorePlayerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionId: null,
            searchText: "",
            offset: 0,
            sortBy: null,
            sortOrder: null,
        }
        _this = this;
    }

    componentDidMount() {
        let { playerListActionObject } = this.props.liveScorePlayerState
        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.setState({ competitionId: id })
            if (id !== null) {
                if (playerListActionObject) {
                    let offset = playerListActionObject.offset
                    let searchText = playerListActionObject.search
                    let sortBy = playerListActionObject.sortBy
                    let sortOrder = playerListActionObject.sortOrder
                    this.setState({ offset, searchText, sortBy, sortOrder })
                    this.props.playerListWithPaginationAction(id, offset, 10, searchText, sortBy, sortOrder);
                } else {
                    this.props.playerListWithPaginationAction(id, 0, 10)
                }
            } else {
                history.push('/matchDayCompetitions')
            }
        } else {
            history.push('/matchDayCompetitions')
        }
    }

    // Delete player
    deletePlayer = (playerId) => {
        this.props.liveScoreDeletePlayerAction(playerId, this.state.competitionId, this.state.offset)
    }

    showDeleteConfirm = (playerId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this player?',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                this_.deletePlayer(playerId)
            },
            onCancel() {
            },
        });
    }

    /// Handle Page change
    handlePageChange = (page) => {
        let offset = page ? 10 * (page - 1) : 0;
        let { sortBy, sortOrder } = this.state
        this.setState({
            offset
        })
        this.props.playerListWithPaginationAction(this.state.competitionId, offset, 10, this.state.searchText, sortBy, sortOrder)
    }

    contentView = () => {
        let { result, totalCount, currentPage } = this.props.liveScorePlayerState

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScorePlayerState.onLoad && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={result}
                        pagination={false}
                        rowKey={(record) => record.playerId}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            current={currentPage}
                            total={totalCount}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // on change search text
    onChangeSearchText = (e) => {
        let { sortBy, sortOrder, competitionId } = this.state
        this.setState({ searchText: e.target.value, offset: 0 })
        if (e.target.value == null || e.target.value === "") {
            this.props.playerListWithPaginationAction(competitionId, 0, 10, e.target.value, sortBy, sortOrder)
        }
    }

    // search key
    onKeyEnterSearchText = (e) => {
        let { sortBy, sortOrder, searchText, competitionId } = this.state
        this.setState({ offset: 0 })
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.props.playerListWithPaginationAction(competitionId, 0, 10, searchText, sortBy, sortOrder)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        let { sortBy, sortOrder, searchText, competitionId } = this.state
        this.setState({ offset: 0 })
        if (this.state.searchText == null || this.state.searchText === "") {
        } else {
            this.props.playerListWithPaginationAction(competitionId, 0, 10, searchText, sortBy, sortOrder)
        }
    }

    onExport = () => {
        let url = AppConstants.exportUrl + `competitionId=${this.state.competitionId}`
        this.props.exportFilesAction(url)
    }

    checkUserId = (record) => {
        if (record.userId == null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.playerMessage)
        } else {
            history.push("/userPersonal", {
                userId: record.userId,
                screenKey: "livescore",
                screen: "/matchDayPlayerList"
            })
        }
    }

    headerView = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1 d-flex align-content-center">
                            <span className="form-heading">
                                {AppConstants.playerList}
                            </span>
                        </div>

                        <div className="col-sm-8 w-100 d-flex flex-row align-items-center justify-content-end">
                            <div className="row">
                                <div className="col-sm pt-1">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <NavLink to="/matchDayAddPlayer" className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addPlayer}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="col-sm pt-1">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <Button
                                            onClick={this.onExport}
                                            className="primary-add-comp-form"
                                            type="primary"
                                        >
                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        src={AppImages.export}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.export}
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-sm pt-1">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <NavLink to="/matchDayPlayerImport" className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                <div className="row">
                                                    <div className="col-sm">
                                                        <img
                                                            src={AppImages.import}
                                                            alt=""
                                                            className="export-image"
                                                        />
                                                        {AppConstants.import}
                                                    </div>
                                                </div>
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 d-flex justify-content-end">
                        <div className="comp-product-search-inp-width">
                            <Input
                                className="product-reg-search-input"
                                onChange={this.onChangeSearchText}
                                placeholder="Search..."
                                value={this.state.searchText}
                                onKeyPress={this.onKeyEnterSearchText}
                                prefix={
                                    <SearchOutlined
                                        style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                        onClick={this.onClickSearchIcon}
                                    />
                                }
                                allowClear
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    loaderView = () => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <Spin size="small" tip="Loading..." />
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.matchDay}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./matchDayCompetitions")}
                />
                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="7" />
                <Layout>
                    {getLiveScoreCompetiton() && this.headerView()}
                    <Content>
                        {getLiveScoreCompetiton() && this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ playerListWithPaginationAction, exportFilesAction, liveScoreDeletePlayerAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScorePlayerState: state.LiveScorePlayerState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScorePlayerList);
