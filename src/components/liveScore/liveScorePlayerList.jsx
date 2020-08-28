import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Layout, Button, Table, Pagination, Spin, message, Menu } from "antd";

import "./liveScore.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { playerListWithPagginationAction } from "../../store/actions/LiveScoreAction/liveScorePlayerAction";
import { liveScore_formateDate } from "../../themes/dateformate";
import history from "../../util/history";
import { getLiveScoreCompetiton } from "../../util/sessionStorage";
import { exportFilesAction } from "../../store/actions/appAction";
import ValidationConstants from "../../themes/validationConstant";
import { teamListData } from "../../util/helpers";

const { Content } = Layout;
const { SubMenu } = Menu;

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
        _this.props.playerListWithPagginationAction(_this.state.competitionId, 0, 10, undefined, sortBy, sortOrder);
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
        title: 'Player Id',
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
            //     pathname: '/liveScorePlayerView',
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
            //     pathname: '/liveScorePlayerView',
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
                    pathname: "/liveScoreTeamView",
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
        render: (data, record) => (
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
                    <Menu.Item key={'1'}>
                        <NavLink to={{ pathname: "/liveScoreAddPlayer", state: { isEdit: true, playerData: record } }}>
                            <span>Edit</span>
                        </NavLink>
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
            searchText: ""
        }
        _this = this;
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ competitionId: id })
        if (id !== null) {
            this.props.playerListWithPagginationAction(id, 0, 10)
        } else {
            history.push('/')
        }
    }

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;
        this.props.playerListWithPagginationAction(this.state.competitionId, offset, 10)
    }

    ////////form content view
    contentView = () => {
        let { result, totalCount } = this.props.liveScorePlayerState

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScorePlayerState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={result}
                        pagination={false}
                        rowKey={(record) => record.playerId}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
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
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            defaultCurrent={1}
                            total={totalCount}
                            onChange={(page) => this.handlePageChnage(page)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value === "") {
            this.props.playerListWithPagginationAction(this.state.competitionId, 0, 10, e.target.value)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.props.playerListWithPagginationAction(this.state.competitionId, 0, 10, this.state.searchText)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        if (this.state.searchText == null || this.state.searchText === "") {
        } else {
            this.props.playerListWithPagginationAction(this.state.competitionId, 0, 10, this.state.searchText)
        }
    }

    onExport() {
        let url = AppConstants.exportUrl + `competitionId=${this.state.competitionId}`
        this.props.exportFilesAction(url)
    }

    checkUserId(record) {
        if (record.userId == null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.playerMessage)
        } else {
            history.push("/userPersonal", {
                userId: record.userId,
                screenKey: "livescore",
                screen: "/liveScorePlayerList"
            })
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.playerList}
                            </span>
                        </div>

                        <div
                            className="col-sm-8"
                            style={{
                                display: "flex",
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "flex-end",
                                width: "100%"
                            }}
                        >
                            <div className="row">
                                <div className="col-sm pt-1">
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
                                        <NavLink to={`/liveScoreAddPlayer`} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addPlayer}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="col-sm pt-1">
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
                                        <Button
                                            onClick={() => this.onExport()}
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
                                        <NavLink to={`/liveScorerPlayerImport`} className="text-decoration-none">
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
                    <div className="mt-5" style={{ display: "flex", justifyContent: 'flex-end' }}>
                        <div className="comp-product-search-inp-width">
                            <Input
                                className="product-reg-search-input"
                                onChange={(e) => this.onChangeSearchText(e)}
                                placeholder="Search..."
                                onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                prefix={
                                    <Icon
                                        type="search"
                                        style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                        onClick={() => this.onClickSearchIcon()}
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

    loaderView() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="small" tip="Loading..." />
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"7"}/>
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ playerListWithPagginationAction, exportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScorePlayerState: state.LiveScorePlayerState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScorePlayerList);
