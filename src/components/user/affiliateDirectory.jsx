import React, { Component } from "react";
import {
  Layout,
  Breadcrumb,
  Button,
  Table,
  Select,
  Menu,
  Pagination,
  Modal,
  Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./user.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from "react-redux";
import {
  getAffiliateDirectoryAction,
  exportAffiliateDirectoryAction,
} from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from "../../store/actions/appAction";
import { bindActionCreators } from "redux";
import AppImages from "../../themes/appImages";
import { getOrganisationData } from "../../util/sessionStorage";
import Loader from "../../customComponents/loader";

const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null;

const listeners = (key) => ({
  onClick: () => tableSort(key),
});

/////function to sort table column
function tableSort(key) {
  let sortBy = key;
  let sortOrder = null;
  if (this_Obj.state.sortBy !== key) {
    sortOrder = "ASC";
  } else if (
    this_Obj.state.sortBy === key &&
    this_Obj.state.sortOrder === "ASC"
  ) {
    sortOrder = "DESC";
  } else if (
    this_Obj.state.sortBy === key &&
    this_Obj.state.sortOrder === "DESC"
  ) {
    sortBy = sortOrder = null;
  }

  let filterData = {
    organisationUniqueKey: this_Obj.state.organisationId,
    yearRefId: this_Obj.state.yearRefId,
    organisationTypeRefId: this_Obj.state.organisationTypeRefId,
    searchText: this_Obj.state.searchText,
    paging: {
      limit: 10,
      offset: this_Obj.state.pageNo ? 10 * (this_Obj.state.pageNo - 1) : 0,
    },
  };

  this_Obj.setState({ sortBy, sortOrder });
  this_Obj.props.getAffiliateDirectoryAction(filterData, sortBy, sortOrder);
}
const columns = [
  {
    title: "Affiliate Name",
    dataIndex: "affiliateName",
    key: "affiliateName",
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
  },
  {
    title: "Organisation Type",
    dataIndex: "organisationTypeName",
    key: "organisationTypeName",
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners("organisationType"),
  },
  {
    title: "Affiliated To",
    dataIndex: "affiliatedToName",
    key: "affiliatedToName",
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners("affiliatedTo"),
  },
  {
    title: "Competition",
    dataIndex: "competitions",
    key: "competitions",
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners("competition"),
    render: (competition, record, index) => {
      return (
        <div>
          {(competition || []).map((item, index) => (
            <div key={item.competitionId}>{item.competitionName}</div>
          ))}
        </div>
      );
    },
  },
  {
    title: "Suburb",
    dataIndex: "suburb",
    key: "suburb",
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
  },
  {
    title: "Postcode",
    dataIndex: "postalCode",
    key: "postalCode",
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners("postcode"),
  },
  {
    title: "Action",
    dataIndex: "isUsed",
    key: "isUsed",
    render: (isUsed, e) => (
      <Menu
        className="action-triple-dot-submenu"
        theme="light"
        mode="horizontal"
        style={{ lineHeight: "25px" }}
      >
        <SubMenu
          key="sub1"
          title={
            <img
              className="dot-image"
              src={AppImages.moreTripleDot}
              alt=""
              width="16"
              height="16"
            />
          }
        >
          <Menu.Item key="1">
            <NavLink
              to={{
                pathname: `/userOurOrganisation`,
                state: {
                  affiliateOrgId: e.affiliateOrgId,
                  orgTypeRefId: e.organisationTypeRefId,
                  isEditable: e.isEditable == 1,
                  sourcePage: "DIR",
                  organisationTypeRefId: e.organisationTypeRefId,
                },
              }}
            >
              <span>View</span>
            </NavLink>
          </Menu.Item>
        </SubMenu>
      </Menu>
    ),
  },
];

class AffiliateDirectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearRefId: -1,
      organisationId: getOrganisationData().organisationUniqueKey,
      organisationTypeRefId: -1,
      deleteLoading: false,
      searchText: "",
      pageNo: 1,
      offsetData: 0,
      sortBy: null,
      sortOrder: null
    };
    this_Obj = this;
    // this.props.getUreAction();
    this.referenceCalls(this.state.organisationId);
  }

  async componentDidMount() {
    const { affiliateDirListAction } = this.props.userState
    let page = 1
    let sortBy = this.state.sortBy
    let sortOrder = this.state.sortOrder
    if (affiliateDirListAction) {
      let offsetData = affiliateDirListAction.payload.paging.offset
      sortBy = affiliateDirListAction.sortBy
      sortOrder = affiliateDirListAction.sortOrder
      let searchText = affiliateDirListAction.payload.searchText
      let yearRefId = affiliateDirListAction.payload.yearRefId
      let organisationTypeRefId = affiliateDirListAction.payload.organisationTypeRefId

      await this.setState({ offsetData, sortBy, sortOrder, searchText, yearRefId, organisationTypeRefId })
      page = Math.floor(offsetData / 10) + 1;
    }
    this.handleAffiliateTableList(page);
  }

  componentDidUpdate(nextProps) {
    let userState = this.props.userState;
    if (userState.onLoad === false && this.state.loading === true) {
      if (!userState.error) {
        this.setState({
          loading: false,
        });
      }
    }
  }

  referenceCalls = () => {
    this.props.getOnlyYearListAction();
  };

  handleAffiliateTableList = (page) => {
    this.setState({
      pageNo: page,
    });
    let filter = {
      organisationUniqueKey: this.state.organisationId,
      yearRefId: this.state.yearRefId,
      organisationTypeRefId: this.state.organisationTypeRefId,
      searchText: this.state.searchText,
      paging: {
        limit: 10,
        offset: page ? 10 * (page - 1) : this.state.offsetData,
      },
    };
    this.props.getAffiliateDirectoryAction(filter, this.state.sortBy, this.state.sortOrder);
  };

  navigateToAffiliate = (e) => {
    this.props.history.push("/userEditAffiliates", {
      affiliateOrgId: e.affiliateOrgId,
      orgTypeRefId: e.organisationTypeRefId,
    });
  };

  onChangeDropDownValue = async (value, key) => {
    if (key === "yearRefId") {
      await this.setState({ yearRefId: value });
      this.handleAffiliateTableList(1);
    } else if (key === "organisationTypeRefId") {
      await this.setState({ organisationTypeRefId: value });
      this.handleAffiliateTableList(1);
    } else if (key === "searchText") {
      await this.setState({ searchText: value });
      if (value == null || value == "") {
        this.handleAffiliateTableList(1);
      }
    }
  };

  onKeyEnterSearchText = (e) => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      //13 is the enter keycode
      this.handleAffiliateTableList(1);
    }
  };

  onClickSearchIcon = () => {
    this.handleAffiliateTableList(1);
  };

  exportAffiliateDirectory = () => {
    let filter = {
      organisationUniqueKey: this.state.organisationId,
      yearRefId: this.state.yearRefId,
      organisationTypeRefId: this.state.organisationTypeRefId,
      searchText: this.state.searchText,
    };

    this.props.exportAffiliateDirectoryAction(filter);
  };

  headerView = () => {
    return (
      <div className="comp-player-grades-header-view-design">
        <div className="row">
          <div
            className="col-sm"
            style={{ display: "flex", alignContent: "center" }}
          >
            <Breadcrumb separator=" > ">
              {/* <Breadcrumb.Item className="breadcrumb-product">User</Breadcrumb.Item> */}
              <Breadcrumb.Item className="breadcrumb-add">
                {AppConstants.affiliateDirectory}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div
            className="col-sm"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              marginRight: "3.0%",
            }}
          >
            <div className="row">
              <div className="col-sm">
                <div className="comp-dashboard-botton-view-mobile">
                  <Button
                    className="primary-add-comp-form"
                    type="primary"
                    onClick={() => this.exportAffiliateDirectory()}
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  ///dropdown view containing all the dropdown of header
  dropdownView = () => {
    let { organisationTypes } = this.props.userState;

    return (
      <div className="comp-player-grades-header-drop-down-view mt-1">
        <div className="fluid-width">
          <div className="row user-filter-row">
            <div className="user-col">
              <div className="user-filter-col-cont">
                <div className="year-select-heading" style={{ width: "65px" }}>
                  {AppConstants.year}
                </div>
                <Select
                  name="yearRefId"
                  className="year-select user-filter-select"
                  onChange={(yearRefId) =>
                    this.onChangeDropDownValue(yearRefId, "yearRefId")
                  }
                  value={this.state.yearRefId}
                >
                  <Option key={-1} value={-1}>
                    {AppConstants.all}
                  </Option>
                  {this.props.appState.yearList.map((item) => {
                    return (
                      <Option key={"yearRefId" + item.id} value={item.id}>
                        {item.description}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="user-col">
              <div className="user-filter-col-cont">
                <div className="year-select-heading" style={{ width: "150px" }}>
                  {AppConstants.organisationType}
                </div>
                <Select
                  name={"organisationTypeRefId"}
                  className="year-select user-filter-select"
                  onChange={(e) =>
                    this.onChangeDropDownValue(e, "organisationTypeRefId")
                  }
                  value={this.state.organisationTypeRefId}
                >
                  <Option key={-1} value={-1}>
                    {AppConstants.all}
                  </Option>
                  {(organisationTypes || []).map((org, index) => (
                    <Option key={org.id} value={org.id}>
                      {org.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="user-col affiliate-dir-srch">
              <div>
                <button
                  className="dashboard-lay-search-button"
                  onClick={() => this.onClickSearchIcon()}
                >
                  <img
                    src={AppImages.searchIcon}
                    height="15"
                    width="15"
                    alt=""
                  />
                </button>
                <div className="reg-product-search-inp-width">
                  <Input
                    className="product-reg-search-input"
                    onChange={(e) =>
                      this.onChangeDropDownValue(e.target.value, "searchText")
                    }
                    placeholder="Search..."
                    onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                    value={this.state.searchText}
                    prefix={
                      <SearchOutlined
                        style={{
                          color: "rgba(0,0,0,.25)",
                          height: 16,
                          width: 16,
                        }}
                      />
                    }
                    allowClear
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  ////////form content view
  contentView = () => {
    let userState = this.props.userState;
    let affiliates = userState.affiliateDirectoryList;
    let total = userState.affiliateDirectoryTotalCount;
    return (
      <div className="comp-dash-table-view mt-2">
        <div className="table-responsive home-dash-table-view">
          <Table
            className="home-dashboard-table"
            columns={columns}
            dataSource={affiliates}
            pagination={false}
            loading={this.props.userState.onAffiliateDirLoad === true && true}
          />
        </div>
        <div className="d-flex justify-content-end">
          <Pagination
            className="antd-pagination"
            current={userState.affiliateDirectoryPage}
            total={total}
            onChange={(page) => this.handleAffiliateTableList(page)}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
        <DashboardLayout
          menuHeading={AppConstants.user}
          menuName={AppConstants.user}
        />
        <InnerHorizontalMenu menu="user" userSelectedKey="4" />
        <Layout>
          {this.headerView()}
          <Content>
            {this.dropdownView()}
            {this.contentView()}
            <Loader visible={this.props.userState.onExpAffiliateDirLoad} />
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOnlyYearListAction,
      getAffiliateDirectoryAction,
      exportAffiliateDirectoryAction,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    userState: state.UserState,
    appState: state.AppState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateDirectory);
