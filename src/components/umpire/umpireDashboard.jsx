import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Layout,
  Button,
  Table,
  Select,
  Menu,
  Pagination,
  // message,
} from 'antd';
import moment from 'moment';

import AppColor from 'themes/appColor';
import AppConstants from 'themes/appConstants';
import AppImages from 'themes/appImages';
// import ValidationConstants from "themes/validationConstant";
import { isArrayNotEmpty } from 'util/helpers';
import history from 'util/history';
import {
  getUmpireCompetitionId,
  setUmpireCompetitionId,
  getOrganisationData,
  setUmpireCompetitionData,
  getUmpireCompetitionData,
  getLiveScoreUmpireCompition,
  getLiveScoreUmpireCompitionData,
  setLiveScoreUmpireCompition,
  setLiveScoreUmpireCompitionData,
  getPrevUrl,
} from 'util/sessionStorage';
import { exportFilesAction } from 'store/actions/appAction';
import {
  getUmpireDashboardList,
  getUmpireDashboardVenueList,
  getUmpireDashboardDivisionList,
  umpireRoundListAction,
  umpireDashboardUpdate,
  setPageSizeAction,
  setPageNumberAction,
} from 'store/actions/umpireAction/umpireDashboardAction';
import { umpireCompetitionListAction } from 'store/actions/umpireAction/umpireCompetetionAction';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';
import { isEqual } from 'lodash';

import './umpire.css';

let this_obj = null;

const { Content } = Layout;
// const { SubMenu } = Menu;
const { Option } = Select;

function tableSort(key) {
  let sortBy = key;
  let sortOrder = null;
  if (this_obj.state.sortBy !== key) {
    sortOrder = 'ASC';
  } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
    sortOrder = 'DESC';
  } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
    sortBy = sortOrder = null;
  }
  const { pageSize = 10 } = this_obj.props.umpireDashboardState;
  const body = {
    paging: {
      limit: pageSize,
      offset: this_obj.state.offsetData,
    },
  };
  this_obj.setState({ sortBy, sortOrder });
  if (this_obj.state.selectedComp && this_obj.state.org_Id) {
    this_obj.props.getUmpireDashboardList({
      compId: this_obj.state.selectedComp,
      divisionId: this_obj.state.division === 'All' ? '' : this_obj.state.division,
      venueId: this_obj.state.venue === 'All' ? '' : this_obj.state.venue,
      orgId: this_obj.state.org_Id,
      roundId:
        this_obj.state.round === 'All'
          ? ''
          : Array.isArray(this_obj.state.round)
          ? this_obj.state.round
          : [this_obj.state.round],
      pageData: body,
      sortBy,
      sortOrder,
    });
  }
}

const listeners = key => ({
  onClick: () => tableSort(key),
});

function validateColor(data) {
  if (data.verifiedBy !== null || data.status === 'YES') {
    return AppColor.umpireTextGreen;
  } else if (data.status === 'NO') {
    return AppColor.umpireTextRed;
  } else {
    return AppColor.standardTxtColor;
  }
}

function validateUmpireColor(data) {
  if (data.status === 'YES') {
    return AppColor.umpireTextGreen;
  } else if (data.status === 'NO') {
    return AppColor.umpireTextRed;
  } else {
    return AppColor.standardTxtColor;
  }
}

function checkUmpireType(umpireArray, key) {
  let object = null;
  for (let i in umpireArray) {
    if (umpireArray[i].sequence === key) {
      object = umpireArray[i];
    }
  }
  return object;
}

function checkUmpireReserve(reserveArray, key) {
  let object = null;
  for (let i in reserveArray) {
    if (reserveArray[i].roleId === key) {
      object = reserveArray[i];
      break;
    }
  }
  return object;
}

const columnsInvite = [
  {
    title: AppConstants.tableMatchID,
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: id => (
      <NavLink
        to={{
          pathname: '/matchDayMatchDetails',
          state: { matchId: id, umpireKey: 'umpire', screenName: 'umpireDashboard' },
        }}
      >
        <span className="input-heading-add-another pt-0">{id}</span>
      </NavLink>
    ),
  },
  {
    title: AppConstants.startTime,
    dataIndex: 'startTime',
    key: 'startTime',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: startTime => <span>{moment(startTime).format('DD/MM/YYYY HH:mm')}</span>,
  },
  {
    title: 'Home',
    dataIndex: 'team1',
    key: 'team1',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: team1 => <span>{team1.name}</span>,
  },
  {
    title: 'Away',
    dataIndex: 'team2',
    key: 'team2',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: team2 => <span>{team2.name}</span>,
  },
  {
    title: AppConstants.round,
    dataIndex: 'round',
    key: 'round',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: round => <span>{round.name}</span>,
  },
  {
    title: 'Umpire 1',
    dataIndex: 'umpires',
    key: 'umpires_1',
    sorter: true,
    onHeaderCell: () => listeners('umpire1'),
    render: umpires => {
      let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : [];
      return (
        <span
          className="pointer"
          style={{ color: validateColor(umpire1) }}
          onClick={() => this_obj.checkUserIdUmpire(umpire1)}
        >
          {umpire1.umpireName}
        </span>
      );
    },
  },
  {
    title: 'Umpire 1 Organisation',
    dataIndex: 'umpires',
    key: 'umpires1_Org',
    sorter: false,
    // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: umpires => {
      let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : [];
      return (
        <>
          {isArrayNotEmpty(umpire1.competitionOrganisations) &&
            umpire1.competitionOrganisations.map((item, index) => (
              <span
                key={index}
                className="multi-column-text-aligned"
                style={{ color: validateColor(umpire1) }}
              >
                {item.name}
              </span>
            ))}
        </>
      );
    },
  },
  {
    title: 'Umpire 2',
    dataIndex: 'umpires',
    key: 'umpires_2',
    sorter: true,
    onHeaderCell: () => listeners('umpire2'),
    render: umpires => {
      let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : [];
      return (
        <span
          className="pointer"
          style={{ color: validateColor(umpire2) }}
          onClick={() => this_obj.checkUserIdUmpire(umpire2)}
        >
          {umpire2.umpireName}
        </span>
      );
    },
  },
  {
    title: 'Umpire 2 Organisation',
    dataIndex: 'umpires',
    key: 'umpires2_Org',
    sorter: false,
    // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: umpires => {
      let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : [];
      return (
        <>
          {isArrayNotEmpty(umpire2.competitionOrganisations) &&
            umpire2.competitionOrganisations.map((item, index) => (
              <span
                key={index}
                className="multi-column-text-aligned"
                style={{ color: validateColor(umpire2) }}
              >
                {item.name}
              </span>
            ))}
        </>
      );
    },
  },
  {
    title: 'Verified By',
    dataIndex: 'umpires',
    key: 'umpires',
    sorter: true,
    onHeaderCell: () => listeners('verifiedBy'),
    render: (umpires, record) => (
      <span className="multi-column-text-aligned">
        {isArrayNotEmpty(record.umpires) ? record.umpires[0].verifiedBy : ''}
      </span>
    ),
  },
  {
    title: AppConstants.umpireReservePref,
    dataIndex: 'umpireReserves',
    key: 'umpireReserves',
    sorter: false,
    render: (umpireReserves, record) => {
      let umpireReserve = checkUmpireReserve(umpireReserves, 19)
        ? checkUmpireReserve(umpireReserves, 19)
        : [];
      return (
        <span
          style={{ color: validateUmpireColor(umpireReserve) }}
          onClick={() => this_obj.checkUserIdUmpire(umpireReserve)}
          className="multi-column-text-aligned pointer"
        >
          {umpireReserve.umpireFirstName
            ? umpireReserve.umpireFirstName + ' ' + umpireReserve.umpireLastName
            : ''}
        </span>
      );
    },
  },
  {
    title: AppConstants.umpireCoach,
    dataIndex: 'umpireCoaches',
    key: 'umpireCoaches',
    sorter: false,
    render: (umpireCoaches, record) => {
      let umpireCoach = checkUmpireReserve(umpireCoaches, 20)
        ? checkUmpireReserve(umpireCoaches, 20)
        : [];
      return (
        <span
          style={{ color: validateUmpireColor(umpireCoach) }}
          onClick={() => this_obj.checkUserIdUmpire(umpireCoach)}
          className="multi-column-text-aligned pointer"
        >
          {umpireCoach.umpireFirstName
            ? umpireCoach.umpireFirstName + ' ' + umpireCoach.umpireLastName
            : ''}
        </span>
      );
    },
  },
  {
    title: AppConstants.action,
    dataIndex: 'action',
    key: 'action',
    render: (umpires, record) => (
      <Menu
        className="action-triple-dot-submenu"
        theme="light"
        mode="horizontal"
        style={{ lineHeight: '25px' }}
      >
        <Menu.SubMenu
          key="sub1"
          style={{ borderBottomStyle: 'solid', borderBottom: 0 }}
          title={
            <img
              className="dot-image"
              src={AppImages.moreTripleDot}
              width="16"
              height="16"
              alt=""
            />
          }
        >
          <Menu.Item key="3">
            <NavLink
              to={{
                pathname: './addUmpire',
                state: { record, screenName: 'umpireDashboard' },
              }}
            >
              <span>Invite</span>
            </NavLink>
          </Menu.Item>

          {umpires ? (
            umpires[0] &&
            umpires[0].verifiedBy === null && (
              <Menu.Item key="1">
                <NavLink
                  to={{
                    pathname: '/matchDayAddMatch',
                    state: {
                      matchId: record.id,
                      umpireKey: 'umpire',
                      isEdit: true,
                      screenName: 'umpireDashboard',
                    },
                  }}
                >
                  <span>Edit</span>
                </NavLink>
              </Menu.Item>
            )
          ) : (
            <Menu.Item key="2">
              <NavLink
                to={{
                  pathname: '/matchDayAddMatch',
                  state: {
                    matchId: record.id,
                    umpireKey: 'umpire',
                    isEdit: true,
                    screenName: 'umpireDashboard',
                  },
                }}
              >
                <span>Edit</span>
              </NavLink>
            </Menu.Item>
          )}
        </Menu.SubMenu>
      </Menu>
    ),
  },
];

const columns = [
  {
    title: AppConstants.tableMatchID,
    dataIndex: 'id',
    key: '_id',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: id => (
      <NavLink
        to={{
          pathname: '/matchDayMatchDetails',
          state: { matchId: id, umpireKey: 'umpire', screenName: 'umpireDashboard' },
        }}
      >
        <span className="input-heading-add-another pt-0">{id}</span>
      </NavLink>
    ),
  },
  {
    title: AppConstants.startTime,
    dataIndex: 'startTime',
    key: '_startTime',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: startTime => <span>{moment(startTime).format('DD/MM/YYYY HH:mm')}</span>,
  },
  {
    title: 'Home',
    dataIndex: 'team1',
    key: '_team1',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: team1 => <span>{team1.name}</span>,
  },
  {
    title: 'Away',
    dataIndex: 'team2',
    key: '_team2',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: team2 => <span>{team2.name}</span>,
  },
  {
    title: AppConstants.round,
    dataIndex: 'round',
    key: '_round',
    sorter: true,
    onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: round => <span>{round.name}</span>,
  },
  {
    title: 'Umpire 1',
    dataIndex: 'umpires',
    key: '_umpires_1',
    sorter: true,
    onHeaderCell: () => listeners('umpire1'),
    render: umpires => {
      let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : [];
      return (
        <span
          style={{ color: validateColor(umpire1) }}
          onClick={() => this_obj.checkUserIdUmpire(umpire1)}
        >
          {umpire1.umpireName}
        </span>
      );
    },
  },
  {
    title: 'Umpire 1 Organisation',
    dataIndex: 'umpires',
    key: '_umpires1_Org',
    sorter: false,
    // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: umpires => {
      let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : [];
      return (
        <>
          {isArrayNotEmpty(umpire1.competitionOrganisations) &&
            umpire1.competitionOrganisations.map((item, index) => (
              <span
                key={index}
                className="multi-column-text-aligned"
                style={{ color: validateColor(umpire1) }}
              >
                {item.name}
              </span>
            ))}
        </>
      );
    },
  },
  {
    title: 'Umpire 2',
    dataIndex: 'umpires',
    key: '_umpires_2',
    sorter: true,
    onHeaderCell: () => listeners('umpire2'),
    render: umpires => {
      let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : [];
      return (
        <span
          style={{ color: validateColor(umpire2) }}
          onClick={() => this_obj.checkUserIdUmpire(umpire2)}
        >
          {umpire2.umpireName}
        </span>
      );
    },
  },
  {
    title: 'Umpire 2 Organisation',
    dataIndex: 'umpires',
    key: '_umpires2_Org',
    sorter: false,
    // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    render: umpires => {
      let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : [];
      return (
        <>
          {isArrayNotEmpty(umpire2.competitionOrganisations) &&
            umpire2.competitionOrganisations.map((item, index) => (
              <span
                key={index}
                className="multi-column-text-aligned"
                style={{ color: validateColor(umpire2) }}
              >
                {item.name}
              </span>
            ))}
        </>
      );
    },
  },
  {
    title: 'Verified By',
    dataIndex: 'umpires',
    key: 'umpires',
    sorter: true,
    onHeaderCell: () => listeners('verifiedBy'),
    render: (umpires, record) => (
      <span className="multi-column-text-aligned">
        {isArrayNotEmpty(record.umpires) ? record.umpires[0].verifiedBy : ''}
      </span>
    ),
  },
  {
    title: AppConstants.umpireReservePref,
    dataIndex: 'umpireReserves',
    key: 'umpireReserves',
    sorter: false,
    render: (umpireReserves, record) => {
      let umpireReserve = checkUmpireReserve(umpireReserves, 19)
        ? checkUmpireReserve(umpireReserves, 19)
        : [];
      return (
        <span
          style={{ color: validateUmpireColor(umpireReserve) }}
          className="multi-column-text-aligned pointer"
          onClick={() => this_obj.checkUserIdUmpire(umpireReserve)}
        >
          {umpireReserve.umpireFirstName
            ? umpireReserve.umpireFirstName + ' ' + umpireReserve.umpireLastName
            : ''}
        </span>
      );
    },
  },
  {
    title: AppConstants.umpireCoach,
    dataIndex: 'umpireCoaches',
    key: 'umpireCoaches',
    sorter: false,
    render: (umpireCoaches, record) => {
      let umpireCoach = checkUmpireReserve(umpireCoaches, 20)
        ? checkUmpireReserve(umpireCoaches, 20)
        : [];
      return (
        <span
          style={{ color: validateUmpireColor(umpireCoach) }}
          onClick={() => this_obj.checkUserIdUmpire(umpireCoach)}
          className="multi-column-text-aligned pointer"
        >
          {umpireCoach.umpireFirstName
            ? umpireCoach.umpireFirstName + ' ' + umpireCoach.umpireLastName
            : ''}
        </span>
      );
    },
  },
  {
    title: AppConstants.action,
    dataIndex: 'action',
    key: '_action',
    render: (umpires, record) => (
      <Menu
        className="action-triple-dot-submenu"
        theme="light"
        mode="horizontal"
        style={{ lineHeight: '25px' }}
      >
        <Menu.SubMenu
          key="sub1"
          style={{ borderBottomStyle: 'solid', borderBottom: 0 }}
          title={
            <img
              className="dot-image"
              src={AppImages.moreTripleDot}
              width="16"
              height="16"
              alt=""
            />
          }
        >
          {umpires ? (
            umpires[0] &&
            umpires[0].verifiedBy === null && (
              <Menu.Item key="1">
                <NavLink
                  to={{
                    pathname: '/matchDayAddMatch',
                    state: {
                      matchId: record.id,
                      umpireKey: 'umpire',
                      isEdit: true,
                      screenName: 'umpireDashboard',
                    },
                  }}
                >
                  <span>Edit</span>
                </NavLink>
              </Menu.Item>
            )
          ) : (
            <Menu.Item key="2">
              <NavLink
                to={{
                  pathname: '/matchDayAddMatch',
                  state: {
                    matchId: record.id,
                    umpireKey: 'umpire',
                    isEdit: true,
                    screenName: 'umpireDashboard',
                  },
                }}
              >
                <span>Edit</span>
              </NavLink>
            </Menu.Item>
          )}
        </Menu.SubMenu>
      </Menu>
    ),
  },
];

class UmpireDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedComp: null,
      loading: false,
      competitionUniqueKey: null,
      venue: 'All',
      venueLoad: false,
      division: 'All',
      divisionLoad: false,
      orgId: null,
      compArray: [],
      competitionObj: null,
      liveScoreUmpire:
        props.location && props.location.state && props.location.state.liveScoreUmpire
          ? props.location.state.liveScoreUmpire
          : null,
      isParticipateInCompetition:
        props.location && props.location.state && props.location.state.isParticipate
          ? props.location.state.isParticipate
          : false,
      round: 'All',
      offsetData: 0,
      sortBy: null,
      sortOrder: null,
      org_Id: null,
    };
    this_obj = this;
  }

  async componentDidMount() {
    const prevUrl = getPrevUrl();
    const { umpireDashboardListActionObject } = this.props.umpireDashboardState;
    // let offsetData = this.state.offsetData
    let sortBy = this.state.sortBy;
    let sortOrder = this.state.sortOrder;
    if (umpireDashboardListActionObject) {
      let offsetData = umpireDashboardListActionObject.pageData.paging.offset;
      sortBy = umpireDashboardListActionObject.sortBy;
      sortOrder = umpireDashboardListActionObject.sortOrder;
      let division =
        umpireDashboardListActionObject.divisionId === ''
          ? 'All'
          : umpireDashboardListActionObject.divisionId;
      let round =
        umpireDashboardListActionObject.roundId === ''
          ? 'All'
          : umpireDashboardListActionObject.roundId;
      let venue =
        umpireDashboardListActionObject.venueId === ''
          ? 'All'
          : umpireDashboardListActionObject.venueId;
      await this.setState({ division, round, venue, offsetData, sortBy, sortOrder });
      // page = Math.floor(offset / 10) + 1;
    }

    if (
      !prevUrl ||
      !(history.location.pathname === prevUrl.pathname && history.location.key === prevUrl.key)
    ) {
      const organisationData = localStorage.getItem('setOrganisationData');
      const parsedData = organisationData ? JSON.parse(organisationData) : {};
      let organisationId = parsedData && parsedData.organisationId ? parsedData.organisationId : 0;
      const orgData = getOrganisationData();
      let orgId = orgData && orgData.organisationId ? orgData.organisationId : null;
      this.setState({ loading: true, orgId });
      if (organisationId)
        this.props.umpireCompetitionListAction(
          null,
          null,
          organisationId,
          null,
          null,
          null,
          true,
          this.state.isParticipateInCompetition,
        );
    } else {
      history.push('/');
    }
  }

  componentDidUpdate(nextProps) {
    let { sortBy, sortOrder } = this.state;
    if (!isEqual(nextProps.umpireCompetitionState, this.props.umpireCompetitionState)) {
      if (this.state.loading && !this.props.umpireCompetitionState.onLoad) {
        let compList =
          this.props.umpireCompetitionState.umpireComptitionList &&
          isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)
            ? this.props.umpireCompetitionState.umpireComptitionList
            : [];
        let firstComp = compList && compList.length ? compList[0].id : null;
        let compData = compList && compList.length ? compList[0] : null;
        let tempJson;
        const unparsed = getUmpireCompetitionId();
        const umpireCompetition = unparsed ? JSON.parse(unparsed) : null;
        if (umpireCompetition) {
          if (this.state.liveScoreUmpire === 'liveScoreUmpire') {
            this.setState({ org_Id: compData?.organisationId });
            tempJson = getLiveScoreUmpireCompition();
            firstComp = tempJson ? JSON.parse(tempJson) : null;
            tempJson = getLiveScoreUmpireCompitionData();
            compData = tempJson ? JSON.parse(tempJson) : null;
            if (firstComp) setUmpireCompetitionId(firstComp);
            if (compData) setUmpireCompetitionData(JSON.stringify(compData));
          } else {
            firstComp = umpireCompetition;
            tempJson = getUmpireCompetitionData();
            compData = tempJson ? JSON.parse(tempJson) : null;
            this.setState({ org_Id: compData?.organisationId });
          }
        } else {
          if (firstComp) setUmpireCompetitionId(firstComp);
          if (compData) setUmpireCompetitionData(JSON.stringify(compData));
          this.setState({ org_Id: compData?.organisationId });
        }

        if (!!firstComp) {
          if (this.state.liveScoreUmpire === 'liveScoreUmpire') {
            let liveScoreUmpireCompetition = getLiveScoreUmpireCompition();
            let compId = liveScoreUmpireCompetition ? JSON.parse(liveScoreUmpireCompetition) : null;
            if (compId) this.props.getUmpireDashboardVenueList(compId);
            liveScoreUmpireCompetition = getLiveScoreUmpireCompitionData();
            let compObjData = liveScoreUmpireCompetition
              ? JSON.parse(liveScoreUmpireCompetition)
              : null;
            const { uniqueKey, organisationId } = compObjData;

            this.setState({
              selectedComp: compId,
              loading: false,
              competitionUniqueKey: uniqueKey,
              compArray: compList,
              venueLoad: true,
              competitionObj: compObjData,
              org_Id: organisationId,
            });
          } else {
            if (firstComp) this.props.getUmpireDashboardVenueList(firstComp);
            let compKey =
              compList && compList.length && compList[0].competitionUniqueKey
                ? compList[0].competitionUniqueKey
                : 0;
            this.setState({
              selectedComp: firstComp,
              loading: false,
              competitionUniqueKey: compKey,
              compArray: compList,
              venueLoad: true,
              competitionObj: compData,
            });
          }
        } else {
          this.setState({ loading: false });
        }
      }
    }

    if (!isEqual(nextProps.umpireDashboardState, this.props.umpireDashboardState)) {
      if (this.props.umpireDashboardState.onVenueLoad === false && this.state.venueLoad === true) {
        if (this.state.selectedComp)
          this.props.getUmpireDashboardDivisionList(this.state.selectedComp);
        this.setState({ venueLoad: false, divisionLoad: true });
      }
    }

    if (!isEqual(nextProps.umpireDashboardState, this.props.umpireDashboardState)) {
      if (
        this.props.umpireDashboardState.onDivisionLoad === false &&
        this.state.divisionLoad === true
      ) {
        const { pageSize = 10 } = this_obj.props.umpireDashboardState;
        const body = {
          paging: {
            limit: pageSize,
            offset: this.state.offsetData,
          },
        };
        this.setState({ divisionLoad: false });
        if (this.state.selectedComp && this.state.org_Id)
          this.props.getUmpireDashboardList({
            compId: this.state.selectedComp,
            divisionId: this.state.division === 'All' ? '' : this.state.division,
            venueId: this.state.venue === 'All' ? '' : this.state.venue,
            orgId: this.state.org_Id,
            roundId:
              this.state.round === 'All'
                ? ''
                : Array.isArray(this.state.round)
                ? this.state.round
                : [this.state.round],
            pageData: body,
            sortBy,
            sortOrder,
          });

        if (this.state.selectedComp)
          this.props.umpireRoundListAction(
            this.state.selectedComp,
            this.state.division === 'All' ? '' : this.state.division,
          );
      }
    }
  }

  checkUserIdUmpire = record => {
    if (record.userId) {
      history.push('/userPersonal', {
        userId: record.userId,
        screenKey: 'umpire',
        screen: '/umpireDashboard',
      });
      // } else if (record.matchUmpiresId) {
      //     history.push("/userPersonal", {
      //         userId: record.matchUmpiresId,
      //         screenKey: "umpire",
      //         screen: "/umpireDashboard",
      //     });
    } else {
      // message.config({ duration: 1.5, maxCount: 1 });
      // message.warn(ValidationConstants.umpireMessage);
    }
  };

  handleShowSizeChange = async (page, pageSize) => {
    await this.props.setPageSizeAction(pageSize);
    this.handlePageChange(page);
  };

  handlePageChange = async page => {
    await this.props.setPageNumberAction(page);
    let { sortBy, sortOrder } = this.state;
    const { pageSize = 10 } = this.props.umpireDashboardState;
    let offsetData = page ? pageSize * (page - 1) : 0;
    this.setState({ offsetData });

    const body = {
      paging: {
        limit: pageSize,
        offset: offsetData,
      },
    };

    if (this.state.selectedComp && this.state.org_Id)
      this.props.getUmpireDashboardList({
        compId: this.state.selectedComp,
        divisionId: this.state.division === 'All' ? '' : this.state.division,
        venueId: this.state.venue === 'All' ? '' : this.state.venue,
        orgId: this.state.org_Id,
        roundId:
          this.state.round === 'All'
            ? ''
            : Array.isArray(this.state.round)
            ? this.state.round
            : [this.state.round],
        pageData: body,
        sortBy,
        sortOrder,
      });
  };

  contentView = () => {
    const {
      umpireDashboardList,
      totalPages,
      currentPage,
      pageSize,
    } = this.props.umpireDashboardState;
    let umpireListResult =
      umpireDashboardList && isArrayNotEmpty(umpireDashboardList) ? umpireDashboardList : [];
    let umpireType =
      this.state.compititionObj && this.state.compititionObj.recordUmpireType
        ? this.state.compititionObj.recordUmpireType
        : '';
    return (
      <div className="comp-dash-table-view mt-4">
        <div className="table-responsive home-dash-table-view">
          <Table
            loading={
              this.props.umpireDashboardState.onLoad || this.props.umpireCompetitionState.onLoad
            }
            className="home-dashboard-table"
            columns={umpireType === 'USERS' ? columnsInvite : columns}
            // columns={columnsInvite}
            dataSource={
              this.props.umpireDashboardState.onLoad || this.props.umpireCompetitionState.onLoad
                ? []
                : umpireListResult
            }
            pagination={false}
            rowKey={record => 'umpireListResult' + record.id}
          />
        </div>

        <div className="comp-dashboard-botton-view-mobile">
          <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end"></div>

          <div className="d-flex justify-content-end">
            <Pagination
              className="antd-pagination"
              showSizeChanger
              total={totalPages}
              current={currentPage}
              defaultCurrent={currentPage}
              defaultPageSize={pageSize}
              onChange={this.handlePageChange}
              onShowSizeChange={this.handleShowSizeChange}
            />
          </div>
        </div>
      </div>
    );
  };

  onChangeComp = compID => {
    let selectedComp = compID && compID.comp ? compID.comp : null;
    let compKey = compID && compID.competitionUniqueKey ? compID.competitionUniqueKey : null;

    if (selectedComp) {
      this.props.getUmpireDashboardVenueList(selectedComp);
      this.props.getUmpireDashboardDivisionList(selectedComp);
    }

    const compObj = this.state.compArray.find(comp => comp?.id === compID?.comp) || null;

    if (selectedComp) {
      setUmpireCompetitionId(selectedComp);
      setLiveScoreUmpireCompition(selectedComp);
    }
    if (compObj) {
      setUmpireCompetitionData(JSON.stringify(compObj));
      setLiveScoreUmpireCompitionData(JSON.stringify(compObj));
    }

    this.setState({
      selectedComp,
      competitionUniqueKey: compKey,
      venueLoad: true,
      divisionLoad: true,
      venue: 'All',
      division: 'All',
      competitionObj: compObj,
      round: 'All',
      sortBy: '',
      sortOrder: '',
      offsetData: 0,
    });
  };

  onVenueChange = venueId => {
    let { sortBy, sortOrder } = this.state;
    const { pageSize = 10 } = this.props.umpireDashboardState;
    const body = {
      paging: {
        limit: pageSize,
        offset: 0,
      },
    };

    if (this.state.selectedComp && this.state.org_Id)
      this.props.getUmpireDashboardList({
        compId: this.state.selectedComp,
        divisionId: this.state.division === 'All' ? '' : this.state.division,
        venueId: venueId === 'All' ? '' : venueId,
        orgId: this.state.org_Id,
        roundId:
          this.state.round === 'All'
            ? ''
            : Array.isArray(this.state.round)
            ? this.state.round
            : [this.state.round],
        pageData: body,
        sortBy,
        sortOrder,
      });

    this.setState({ venue: venueId });
  };

  onDivisionChange = divisionId => {
    this.setState({ division: divisionId, round: 'All' });
    let { sortBy, sortOrder } = this.state;
    const { pageSize = 10 } = this.props.umpireDashboardState;
    const body = {
      paging: {
        limit: pageSize,
        offset: 0,
      },
    };

    setTimeout(() => {
      if (this.state.selectedComp && this.state.org_Id)
        this.props.getUmpireDashboardList({
          compId: this.state.selectedComp,
          divisionId: divisionId === 'All' ? '' : divisionId,
          venueId: this.state.venue === 'All' ? '' : this.state.venue,
          orgId: this.state.org_Id,
          roundId:
            this.state.round === 'All'
              ? ''
              : Array.isArray(this.state.round)
              ? this.state.round
              : [this.state.round],
          pageData: body,
          sortBy,
          sortOrder,
        });
    }, 100);

    if (this.state.selectedComp)
      this.props.umpireRoundListAction(
        this.state.selectedComp,
        divisionId === 'All' ? '' : divisionId,
      );

    this.setState({ division: divisionId, round: 'All' });
  };

  onRoundChange = roundId => {
    if (roundId !== 'All') {
      this.props.umpireDashboardUpdate(roundId);
    }
    let { sortBy, sortOrder } = this.state;
    const { pageSize = 10 } = this.props.umpireDashboardState;
    const body = {
      paging: {
        limit: pageSize,
        offset: 0,
      },
    };
    const { allRoundIds } = this.props.umpireDashboardState;
    if (this.state.selectedComp && this.state.org_Id)
      this.props.getUmpireDashboardList({
        compId: this.state.selectedComp,
        divisionId: this.state.division === 'All' ? '' : this.state.division,
        venueId: this.state.venue === 'All' ? '' : this.state.venue,
        orgId: this.state.org_Id,
        roundId: roundId === 'All' ? '' : allRoundIds,
        pageData: body,
        sortBy,
        sortOrder,
      });

    this.setState({ round: roundId === 'All' ? 'All' : allRoundIds });
  };

  onExport = () => {
    if (this.state.orgId && this.state.selectedComp) {
      let url =
        AppConstants.umpireDashboardExport +
        `competitionId=${this.state.selectedComp}&organisationId=${this.state.orgId}`;
      this.props.exportFilesAction(url);
    }
  };

  headerView = () => {
    let isCompetitionAvailable = this.state.selectedComp ? false : true;
    return (
      <div className="comp-player-grades-header-drop-down-view mt-4">
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm pt-1 d-flex align-content-center">
              <span className="form-heading">{AppConstants.dashboard}</span>
            </div>

            <div className="col-sm-8 w-100 d-flex flex-row align-items-center justify-content-end">
              <div className="row">
                {/*
                                    <div className="col-sm pt-1">
                                        <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                            <NavLink to="/addUmpire" className="text-decoration-none">
                                                <Button className="primary-add-comp-form" type="primary">
                                                    + {AppConstants.addUmpire}
                                                </Button>
                                            </NavLink>
                                        </div>
                                    </div>
                                    */}

                <div className="col-sm pt-1">
                  <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                    <Button
                      type="primary"
                      disabled={isCompetitionAvailable}
                      className="primary-add-comp-form"
                      onClick={this.onExport}
                    >
                      <div className="row">
                        <div className="col-sm">
                          <img className="export-image" src={AppImages.export} alt="" />
                          {AppConstants.export}
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="col-sm pt-1">
                  <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                    <NavLink
                      className="text-decoration-none"
                      to={{
                        pathname: '/umpireImport',
                        state: { screenName: 'umpireDashboard' },
                      }}
                    >
                      <Button
                        disabled={isCompetitionAvailable}
                        className="primary-add-comp-form"
                        type="primary"
                      >
                        <div className="row">
                          <div className="col-sm">
                            <img className="export-image" src={AppImages.import} alt="" />
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
        </div>
      </div>
    );
  };

  dropdownView = () => {
    let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)
      ? this.props.umpireCompetitionState.umpireComptitionList
      : [];
    const {
      umpireVenueList,
      umpireDivisionList,
      umpireRoundList,
    } = this.props.umpireDashboardState;
    let venueList = isArrayNotEmpty(umpireVenueList) ? umpireVenueList : [];
    let divisionList = isArrayNotEmpty(umpireDivisionList) ? umpireDivisionList : [];
    let roundList = isArrayNotEmpty(umpireRoundList) ? umpireRoundList : [];
    let umpireType = this.state.competitionObj ? this.state.competitionObj?.recordUmpireType : null;
    return (
      <div className="comp-player-grades-header-drop-down-view mt-1">
        <div className="fluid-width">
          <div className="row reg-filter-row">
            <div className="reg-col">
              <div className="reg-filter-col-cont">
                <div className="year-select-heading" style={{ width: '145px' }}>
                  {AppConstants.competition} :
                </div>

                <Select
                  // showSearch
                  // optionFilterProp="children"
                  className="year-select reg-filter-select1"
                  style={{ minWidth: 200 }}
                  onChange={comp => this.onChangeComp({ comp })}
                  value={this.state.selectedComp || ''}
                  loading={this.props.umpireCompetitionState.onLoad}
                >
                  {competition.map(item => (
                    <Option key={'competition_' + item.id} value={item.id}>
                      {item.longName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="reg-col1 ml-5">
              <div className="reg-filter-col-cont">
                <div className="year-select-heading" style={{ width: '133px' }}>
                  {AppConstants.venue} :
                </div>
                <Select
                  className="year-select reg-filter-select1"
                  onChange={this.onVenueChange}
                  value={this.state.venue}
                >
                  <Option value="All">All</Option>
                  {venueList.map(item => (
                    <Option key={'venue_' + item.venueId} value={item.venueId}>
                      {item.venueName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="reg-col1 ml-5">
              <div className="reg-filter-col-cont">
                <div className="year-select-heading" style={{ width: '147px' }}>
                  {AppConstants.division} :
                </div>
                <Select
                  className="year-select reg-filter-select1"
                  onChange={this.onDivisionChange}
                  value={this.state.division}
                >
                  <Option value="All">All</Option>
                  {divisionList.map(item => (
                    <Option key={'division_' + item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="reg-col1 ml-5">
              <div className="reg-filter-col-cont">
                <div className="year-select-heading" style={{ width: '128px' }}>
                  {AppConstants.round} :
                </div>
                <Select
                  className="year-select reg-filter-select1"
                  onChange={this.onRoundChange}
                  value={this.state.round}
                >
                  <Option value="All">All</Option>
                  {roundList.map(item => (
                    <Option key={'round_' + item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {umpireType && umpireType !== 'USERS' && (
            <div>
              <NavLink
                to={{
                  pathname: '/matchDaySettingsView',
                  state: {
                    selectedComp: this.state.selectedComp,
                    screenName: 'umpireDashboard',
                    edit: 'edit',
                  },
                }}
              >
                <span className="input-heading-add-another pt-0">
                  {AppConstants.competitionEnabled}
                </span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    );
  };

  countView = () => {
    // let userRegistrationState = this.props.userRegistrationState;
    // let userRegDashboardList = userRegistrationState.userRegDashboardListData;
    // let total = userRegistrationState.userRegDashboardListTotalCount;
    return (
      <div className="comp-dash-table-view mt-2">
        <div>
          <div className="row">
            <div className="col-sm">
              <div className="registration-count">
                <div className="reg-payment-paid-reg-text">No. of umpires</div>
                <div className="reg-payment-price-text">{0}</div>
              </div>
            </div>
            <div className="col-sm">
              <div className="registration-count">
                <div className="reg-payment-paid-reg-text">No. of registered umpires</div>
                <div className="reg-payment-price-text">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />

        <InnerHorizontalMenu menu="umpire" umpireSelectedKey="1" />

        <Layout>
          {this.headerView()}

          <Content>
            {this.dropdownView()}
            {/* {this.countView()} */}
            {this.contentView()}
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      umpireCompetitionListAction,
      getUmpireDashboardVenueList,
      getUmpireDashboardDivisionList,
      getUmpireDashboardList,
      exportFilesAction,
      umpireRoundListAction,
      umpireDashboardUpdate,
      setPageSizeAction,
      setPageNumberAction,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    umpireDashboardState: state.UmpireDashboardState,
    umpireCompetitionState: state.UmpireCompetitionState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireDashboard);
