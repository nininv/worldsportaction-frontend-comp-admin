import React, { Component } from "react";
import { Layout, Button, Table, Select, Spin } from 'antd';
import './home.css';
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUreAction, getRoleAction } from '../../store/actions/userAction/userAction'
import { getUserCount, clearHomeDashboardData, setHomeDashboardYear } from "../../store/actions/homeAction/homeAction"
import { getOnlyYearListAction } from '../../store/actions/appAction'
import Loader from '../../customComponents/loader';
import history from "../../util/history";

const { Footer, Content } = Layout;
const { Option } = Select;

const columnsInbox = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => (
            <span className="inbox-name-text">{name}</span>
        )
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',

    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        width: "25%",
        render: time => (
            <span className="inbox-time-text">{time}</span>
        )
    },

]

const dataInbox = [
    {
        key: '1',
        name: "Netball QLD",
        description: "Re: Action required! Netball Australia has released NetSetGo",
        time: "Thu 22/08/2019, 5.43pm",


    },
    {
        key: '2',
        name: "Netball QLD",
        description: "Payment Reconciliation",
        time: "Wed 21/08/2019, 11.23am",

    },
]



const columnsOwned = [
    {
        title: <div className="home-dash-name-table-title">Name</div>,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
    },
    {
        title: 'Division/Age',
        dataIndex: 'divisionAge',
        key: 'divisionAge',
        sorter: (a, b) => a.divisionAge.length - b.divisionAge.length,


    },

    {
        title: 'Teams',
        dataIndex: 'teams',
        key: 'teams',
        sorter: (a, b) => a.teams.length - b.teams.length,

    },
    {
        title: 'Players',
        dataIndex: 'players',
        key: 'players',
        sorter: (a, b) => a.players.length - b.players.length,

    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.players.length - b.players.length,

    },
    {
        title: AppConstants.edit,
        dataIndex: 'more',
        key: 'more',
        render: () => <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}><img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" /></span>,

    },



];

const dataOwned = [
    {
        key: '1',
        name: "2019 Winter",
        divisionAge: "AR1, AR2, 16, 15, 14, 13, 12, 11, 10, NetSetGo",
        teams: "200",
        players: "2,009",
        status: "PTR",


    },
    {
        key: '2',
        name: "2019 Summer",
        divisionAge: "AR1, AR2, AR3, 16, 14, 12, 11, 10",
        teams: "120",
        players: "12,00",
        status: "TGF",
    },
    {
        key: '3',
        name: "2019 Spring",
        divisionAge: "AR1, AR2, 16, 15, 14, 13, 12, 11, 10",
        teams: "100",
        players: "1,003",
        status: "PTR",
    },
];

const columnsParticipate = [
    {
        title: <div className="home-dash-name-table-title">Name</div>,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,

    },
    {
        title: 'Division/Age',
        dataIndex: 'divisionAge',
        key: 'divisionAge',
        sorter: (a, b) => a.divisionAge.length - b.divisionAge.length,

    },
    {
        title: 'Teams',
        dataIndex: 'teams',
        key: 'teams',
        sorter: (a, b) => a.teams.length - b.teams.length,

    },
    {
        title: 'Players',
        dataIndex: 'players',
        key: 'players',
        sorter: (a, b) => a.players.length - b.players.length,

    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.length - b.status.length,

    },
    {
        title: AppConstants.edit,
        dataIndex: 'more',
        key: 'more',
        render: () => <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}><img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" /></span>,

    },

];

const dataParticipate = [
    {
        key: '1',
        name: "2019 Winter",
        divisionAge: "AR1, AR2, 16, 15, 14, 13, 12, 11, 10, NetSetGo",
        teams: "200",
        players: "2,009",
        status: "PTR",


    },
    {
        key: '2',
        name: "2019 Summer",
        divisionAge: "AR1, AR2, AR3, 16, 14, 12, 11, 10",
        teams: "120",
        players: "12,00",
        status: "TGF",
    },
    {
        key: '3',
        name: "2019 Spring",
        divisionAge: "AR1, AR2, 16, 15, 14, 13, 12, 11, 10",
        teams: "100",
        players: "1,003",
        status: "PTR",
    },

];


class HomeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: null,
            loading: true,
            userCountLoading: false
        }

    }


    componentDidMount() {
        this.props.getRoleAction()
        this.props.getUreAction()
        // this.props.getOnlyYearListAction(this.props.appState.yearList)
        // this.props.getUserCount(1)
    }

    componentDidUpdate(nextProps) {
        const { yearList } = this.props.appState
        let userOrganisation = this.props.userState.getUserOrganisation
        if (this.state.userCountLoading == true && this.props.appState.onLoad == false) {
            if (yearList.length > 0) {
                let yearRefId = yearList[0].id

                if (this.props.homeDashboardState.userCount == null) {
                    this.props.getUserCount(yearRefId)
                    this.props.setHomeDashboardYear(yearRefId)
                }
                this.setState({ userCountLoading: false })
            }
        }
        if (this.state.loading == true && this.props.userState.onOrgLoad == false) {
            if (nextProps.userOrganisation !== userOrganisation) {
                if (userOrganisation.length > 0) {
                    if (this.props.appState.yearList == 0) {
                        this.props.getOnlyYearListAction(this.props.appState.yearList)
                        this.setState({ userCountLoading: true, loading: false })
                    }

                    else {
                        let yearRefId = yearList[0].id
                        if (this.props.homeDashboardState.userCount == null) {
                            this.props.getUserCount(yearRefId)
                            this.setState({ loading: false })
                        }
                    }
                }
            }
        }
    }

    onYearChange = (yearRefId) => {
        this.props.setHomeDashboardYear(yearRefId)
        // this.setState({ yearRefId: yearRefId, })
        this.props.clearHomeDashboardData("yearChange")
        this.props.getUserCount(yearRefId)
    }


    inboxHeadingView = () => {
        return (
            <div className="row text-view mt-5 pt-2">
                <div className="col-sm" >
                    <span className='home-dash-left-text'>{AppConstants.inbox}</span>
                </div>
                {/* <div className="col-sm text-right" >
                    <span className='home-dash-right-text'>{AppConstants.viewAll}</span>
                </div> */}
            </div>
        )
    }

    //////inboxView for table
    inboxView = () => {
        return (
            <div>
                {this.inboxHeadingView()}
                {/* <div className="home-table-view" > */}
                {/* <div className="table-responsive"> */}
                {/* <Table className="home-inbox-table" columns={columnsInbox} dataSource={dataInbox} pagination={false}
                            showHeader={false}
                        /> */}
                <span className='input-heading'>{"This feature is not implemented yet"}</span>
                {/* </div> */}
                {/* </div> */}
            </div>
        )
    }






    compOverviewHeading = () => {
        const { yearRefId } = this.props.homeDashboardState
        return (
            <div className="row text-view">
                <div className="col-sm" style={{ display: 'flex', alignItems: 'center' }} >
                    <span className='home-dash-left-text' >{AppConstants.competitionsOverview}</span>
                </div>
                <div className="col-sm text-right" >
                    <div style={{
                        width: "100%", display: "flex",
                        flexDirection: "row",
                        alignItems: "center", marginLeft: 7,
                        justifyContent: "flex-end"
                    }} >
                        <span className='year-select-heading'>{AppConstants.year}:</span>
                        <Select
                            name={"yearRefId"}
                            className="year-select"
                            onChange={yearRefId => this.onYearChange(yearRefId)}
                            value={yearRefId}
                        >
                            {this.props.appState.yearList.map(item => {
                                return (
                                    <Option key={"yearRefId" + item.id} value={item.id}>
                                        {item.description}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
            </div >
        )
    }


    /////competition Overview 
    compOverview = () => {
        const { userCount, registrationCount, liveScoreCompetitionCount, registrationCompetitionCount } = this.props.homeDashboardState
        return (
            <div>
                {this.compOverviewHeading()}
                <div className="row" >
                    <div className="col-sm pt-5">
                        <div className="home-dash-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">

                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <Spin size="small"
                                        spinning={this.props.homeDashboardState.onLoad} />
                                    {this.props.homeDashboardState.onLoad == false &&
                                        <span className="reg-payment-price-text">{(userCount !== null && userCount !== "") ? userCount : "-"}</span>
                                    }
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">{AppConstants.totalUsers}</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                                    onClick={() => history.push("/userGraphicalDashboard")}    >
                                    <a className="view-more-btn"><i className="fa fa-angle-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-sm pt-5" >
                        <div className="home-dash-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">

                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <Spin size="small"
                                        spinning={this.props.homeDashboardState.onLoad} />
                                    {this.props.homeDashboardState.onLoad == false &&
                                        <span className="reg-payment-price-text">{(registrationCount !== null && registrationCount !== "")
                                            ? registrationCount : "-"}</span>
                                    }
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">{AppConstants.totalRegistrations}</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                                    onClick={() => history.push("/registration")}  >

                                    <a className="view-more-btn" ><i className="fa fa-angle-right" aria-hidden="true"></i></a>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row " >
                    <div className="col-sm pt-5">
                        <div className="home-dash-white-box-view" >
                            <div className="row " >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">
                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <Spin size="small"
                                        spinning={this.props.homeDashboardState.onLoad} />
                                    {this.props.homeDashboardState.onLoad == false &&
                                        <span className="reg-payment-price-text">{(registrationCompetitionCount !== null && registrationCompetitionCount !== "") ? registrationCompetitionCount : "-"}</span>
                                    }
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">{AppConstants.totalCompetitions}</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                                    onClick={() => history.push("/competitionDashboard")}  >
                                    <a className="view-more-btn"><i className="fa fa-angle-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-sm pt-5" >
                        <div className="home-dash-white-box-view" >
                            <div className="row" >
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                                    <div className="reg-payment-regist-view">

                                        <img src={AppImages.activeRegist} alt="" height="25" width="25" />
                                    </div>
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <Spin size="small"
                                        spinning={this.props.homeDashboardState.onLoad} />
                                    {this.props.homeDashboardState.onLoad == false &&
                                        <span className="reg-payment-price-text">{(liveScoreCompetitionCount !== null && liveScoreCompetitionCount !== "") ? liveScoreCompetitionCount : "-"}</span>
                                    }
                                </div>
                                <div className="col-sm-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                                    <span className="reg-payment-paid-reg-text">{AppConstants.livescoreCompetitions}</span>
                                </div>
                                <div className="col-sm-2" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                                    onClick={() => history.push("/liveScoreCompetitions")}  >

                                    <a className="view-more-btn" ><i className="fa fa-angle-right" aria-hidden="true"></i></a>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    ownedHeadingView = () => {
        return (
            <div className="row text-view">
                <div className="col-sm" >
                    <span className='home-dash-left-text'>{AppConstants.ownedCompetitions}</span>
                </div>
                <div className="col-sm text-right" >
                    <NavLink to="/registrationCompetitionForm" >
                        <Button className='primary-add-comp-form' type='primary'>+ {AppConstants.addNew}</Button>
                    </NavLink>
                </div>
            </div>
        )
    }

    ////////ownedView view for competition
    ownedView = () => {
        return (
            <div>
                {this.ownedHeadingView()}
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table" columns={columnsOwned} dataSource={dataOwned} pagination={false}
                    />
                </div>
            </div>
        )
    }

    participatedHeadingView = () => {
        return (
            <div className="row text-view">
                <div className="col-sm mb-3" >
                    <span className='home-dash-left-text'>{AppConstants.participatingInCompetitions}</span>
                </div>
            </div>
        )
    }

    ////////participatedView view for competition
    participatedView = () => {
        return (
            <div>
                {this.participatedHeadingView()}
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table" columns={columnsParticipate} dataSource={dataParticipate} pagination={false}
                    />
                </div>
            </div>
        )
    }




    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.home} menuName={AppConstants.home} />
                <InnerHorizontalMenu menu={"home"} userSelectedKey={"1"} />
                <Layout>
                    {/* <Content className="container"> */}
                    <Content className="comp-dash-table-view">
                        {this.inboxView()}
                        {this.compOverview()}
                        {/* {this.ownedView()}
                        {this.participatedView()} */}
                    </Content>
                    <Loader
                        visible={this.props.appState.onLoad} />
                    <Footer></Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getRoleAction,
        getUreAction,
        getUserCount,
        getOnlyYearListAction,
        clearHomeDashboardData,
        setHomeDashboardYear
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        homeDashboardState: state.HomeDashboardState,
        userState: state.UserState

    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((HomeDashboard));
