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
import { getUserReferFriendAction } from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction'

const { Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

/////function to sort table column
function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }

    let filterData = {
        organisationUniqueKey: this_Obj.state.organisationId,
        yearRefId: this_Obj.state.yearRefId,
        paging: {
            limit: 10,
            offset: (this_Obj.state.pageNo ? (10 * (this_Obj.state.pageNo - 1)) : 0)
        }
    }

    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.getUserReferFriendAction(filterData, sortBy, sortOrder);
}

const columns = [
    {
        title: 'Registered User',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("registeredUser"),
        render: (name, record) => (
            <NavLink to={{ pathname: "/userPersonal", state: { userId: record.userId } }}>
                <span className="input-heading-add-another pt-0">{name}</span>
            </NavLink>
        ),
    },
    {
        title: 'Affiliate Name',
        dataIndex: 'affiliateName',
        key: 'affiliateName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("affiliateName"),
    },
    {
        title: 'Competition Name',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("division"),
    },
    {
        title: 'Friend Name',
        dataIndex: 'friendName',
        key: 'friendName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Friend Email',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("friendEmail"),
    },
    {
        title: 'Friend Phone',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("friendPhone"),
    },
    {
        title: 'Friend Status',
        dataIndex: 'friendStatus',
        key: 'friendStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
];

class ReferFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            pageNo: 1,
            sortBy: null,
            sortOrder: null
        }
        this_Obj = this
    }

    async componentDidMount() {

        const { userReferFriendListAction } = this.props.userState

        this.referenceCalls();

        let pageNo = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (userReferFriendListAction) {
            let offset = userReferFriendListAction.payload.paging.offset
            sortBy = userReferFriendListAction.sortBy
            sortOrder = userReferFriendListAction.sortOrder
            let yearRefId = userReferFriendListAction.payload.yearRefId

            pageNo = Math.floor(offset / 10) + 1;
            await this.setState({ offset, sortBy, sortOrder, yearRefId, pageNo })

            this.handleFriendTableList(pageNo);
        } else {
            this.handleFriendTableList(1);
        }
    }
    componentDidUpdate(nextProps) {

    }

    handleFriendTableList = (page) => {
        this.setState({
            pageNo: page
        })
        let filter =
        {
            organisationUniqueKey: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getUserReferFriendAction(filter, this.state.sortBy, this.state.sortOrder);
    }

    referenceCalls = () => {
        this.props.getOnlyYearListAction();
    }

    onChangeDropDownValue = async (value, key) => {
        if (key === "yearRefId")
            await this.setState({ yearRefId: value });

        this.handleFriendTableList(1);
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.referaFriend}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-2">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    name="yearRefId"
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ maxWidth: 80 }}
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map(item => (
                                        <Option key={'year_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        let userState = this.props.userState;
        let friendList = userState.referFriendList;
        let total = userState.referFriendTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={friendList}
                        pagination={false}
                        loading={this.props.userState.onLoad}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.referFriendPage}
                        total={total}
                        onChange={(page) => this.handleFriendTableList(page)}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu="user" userSelectedKey="6" />
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
        getUserReferFriendAction,
        getOnlyYearListAction
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((ReferFriend));
