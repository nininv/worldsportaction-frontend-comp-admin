import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal, DatePicker } from "antd";
import './user.css';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getOrganisationData } from "../../util/sessionStorage";
import {getUserFriendAction} from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction'

const { Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;

const columns = [

    {
        title: 'Registered User',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Affiliate Name',
        dataIndex: 'affiliateName',
        key: 'affiliateName',
        sorter: (a, b) => a.affiliateName.localeCompare(b.affiliateName),
    },
    {
        title: 'Competition Name',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
    },
    {
        title: 'Friend Name',
        dataIndex: 'friendName',
        key: 'friendName',
        sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
        title: 'Friend Status',
        dataIndex: 'friendStatus',
        key: 'friendStatus',
        sorter: (a, b) => a.friendStatus.localeCompare(b.friendStatus),
    },
    {
        title: 'Competition Name',
        dataIndex: 'friendCompetitionName',
        key: 'friendCompetitionName',
        sorter: (a, b) => a.friendCompetitionName.localeCompare(b.friendCompetitionName),
    },
    {
        title: 'Division',
        dataIndex: 'friendCompDivision',
        key: 'friendCompDivision',
        sorter: (a, b) => a.friendCompDivision.localeCompare(b.friendCompDivision),
    },
    

];

class PlayWithFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
        }
    }

    componentDidMount(){
        this.referenceCalls();
        this.handleFriendTableList(1);
    }
    componentDidUpdate(nextProps){

    }

    handleFriendTableList = (page) => {
        let filter =
        {
            organisationUniqueKey: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getUserFriendAction(filter);
    }

    referenceCalls = () => {
        this.props.getOnlyYearListAction();
    }

    onChangeDropDownValue = async (value, key) => {
        if(key == "yearRefId")
          await this.setState({yearRefId: value});

        this.handleFriendTableList(1);
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.playWithAFriend}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-2" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ maxWidth: 80 }}
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
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
                    </div>
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let userState = this.props.userState;
        let friendList = userState.friendList;
        let total = userState.friendTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
            <div className="table-responsive home-dash-table-view">
                <Table className="home-dashboard-table"
                    columns={columns}
                    dataSource={friendList}
                    pagination={false}
                    loading={this.props.onLoad === true && true}
                />
            </div>
            <div className="d-flex justify-content-end">
                <Pagination
                    className="antd-pagination"
                    current={userState.friendPage}
                    total={total}
                    onChange={(page) => this.handleFriendTableList(page)}
                />
            </div>
        </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu  menu={"user"} userSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserFriendAction,
        getOnlyYearListAction
    }, dispatch);
}

function mapStatetoProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((PlayWithFriend));
