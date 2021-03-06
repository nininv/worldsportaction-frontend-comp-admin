import React, { Component } from 'react';
import { Layout, Button, Table, Pagination, Tabs } from 'antd';
import './liveScore.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import AppImages from '../../themes/appImages';
import { liveScore_formateDate } from '../../themes/dateformate';
import history from '../../util/history';
import { getLiveScoreCompetiton } from '../../util/sessionStorage';

const { Content } = Layout;
const { TabPane } = Tabs;

////activity columns data
const activity_Columns = [
  {
    title: AppConstants.tableMatchID,
    dataIndex: 'matchId',
    key: 'matchId',
    sorter: (a, b) => a.matchId.length - b.matchId.length,
  },
  {
    title: AppConstants.home,
    dataIndex: 'home',
    key: 'home',
    sorter: (a, b) => a.home.length - b.home.length,
  },
  {
    title: AppConstants.away,
    dataIndex: 'away',
    key: 'away',
    sorter: (a, b) => a.away.length - b.away.length,
  },
  {
    title: AppConstants.period,
    dataIndex: 'period',
    key: 'period',
    sorter: (a, b) => a.period.length - b.period.length,
  },
  {
    title: AppConstants.timestamp,
    dataIndex: 'timestamp',
    key: 'timestamp',
    sorter: (a, b) => a.timestamp.length - b.timestamp.length,
  },
  {
    title: AppConstants.status,
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.length - b.status.length,
  },
  {
    title: AppConstants.position,
    dataIndex: 'positionName',
    key: 'positionName',
    sorter: (a, b) => a.positionName.length - b.positionName.length,
  },
];

////activity columns data
const shhoting_Columns = [
  {
    title: AppConstants.tableMatchID,
    dataIndex: 'matchId',
    key: 'matchId',
    sorter: (a, b) => a.matchId.length - b.matchId.length,
  },
  {
    title: AppConstants.home,
    dataIndex: 'home',
    key: 'home',
    sorter: (a, b) => a.home.length - b.home.length,
  },
  {
    title: AppConstants.away,
    dataIndex: 'away',
    key: 'away',
    sorter: (a, b) => a.away.length - b.away.length,
  },
  {
    title: AppConstants.position,
    dataIndex: 'position',
    key: 'position',
    sorter: (a, b) => a.position.length - b.position.length,
  },
  {
    title: AppConstants.attempts,
    dataIndex: 'attempts',
    key: 'attempts',
    sorter: (a, b) => a.attempts.length - b.attempts.length,
  },
  {
    title: AppConstants.goals,
    dataIndex: 'goals',
    key: 'goals',
    sorter: (a, b) => a.goals.length - b.goals.length,
  },
  {
    title: AppConstants.goalPercent,
    dataIndex: 'goalsPercent',
    key: 'goalsPercent',
    sorter: (a, b) => a.goalsPercent.length - b.goalsPercent.length,
  },
  {
    title: AppConstants.missedPenalties,
    dataIndex: 'penalty',
    key: 'penalty',
    sorter: (a, b) => a.penalty.length - b.penalty.length,
  },
];

////array data
const activity_data = [
  // {
  //     key: '1',
  //     matchId: '1739',
  //     team_1: 'WSA9',
  //     team_2: 'WSA10',
  //     period: '1',
  //     timestamp: '04/12/19 16:19',
  //     status: 'Played',
  //     positionName: 'Wing Attack  '
  // }
];

const shhoting_data = [];

class LiveScorePlayerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerTabKey: 1,
      data: props.location.state
        ? props.location.state.tableRecord
          ? props.location.state.tableRecord
          : null
        : null,
      screenName: props.location.state
        ? props.location.state.screenName
          ? props.location.state.screenName
          : null
        : null,
    };
  }

  componentDidMount() {
    let playerData = this.props.location.state
      ? this.props.location.state.tableRecord
        ? this.props.location.state.tableRecord
        : null
      : null;

    if (getLiveScoreCompetiton()) {
      if (!playerData) {
        history.push('/matchDayGoalsList');
      }
    } else {
      history.push('/matchDayCompetitions');
    }
  }

  ////view for profile image
  profileImageView = () => {
    let data = this.state.data;

    return (
      <div className="fluid-width mt-2">
        <div className="profile-image-view mr-5">
          <span className="user-contact-heading">{AppConstants.playerProfile}</span>

          {data && data.profilePicture ? (
            <img className="user-image" src={data.profilePicture} alt="" height="80" width="80" />
          ) : (
            <span className="user-contact-heading">{AppConstants.noImage}</span>
          )}
          <span className="user-contact-heading">
            {data && data.firstName + ' ' + data.lastName}
          </span>
          <span className="year-select-heading pt-0">{data && '#' + data.playerId}</span>
        </div>

        <div className="profile-img-view-style">
          <div className="live-score-side-desc-view">
            <div className="live-score-title-icon-view">
              <div className="live-score-icon-view">
                <img src={AppImages.calendar} alt="" height="16" width="16" />
              </div>
              <span className="year-select-heading ml-3">{AppConstants.dateOfBirth}</span>
            </div>
            <span className="desc-text-style side-bar-profile-data">
              {data &&
                (liveScore_formateDate(data.dob) == 'Invalid date'
                  ? ''
                  : liveScore_formateDate(data.dob))}
            </span>
          </div>
          <div className="live-score-side-desc-view">
            <div className="live-score-title-icon-view">
              <div className="live-score-icon-view">
                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
              </div>
              <span className="year-select-heading ml-3">{AppConstants.contactNumber}</span>
            </div>
            <span className="desc-text-style side-bar-profile-data">
              {data && data.phoneNumber}
            </span>
          </div>
          <div className="live-score-side-desc-view">
            <div className="live-score-title-icon-view">
              <div className="live-score-icon-view">
                <img src={AppImages.group} height="16" width="16" alt="" />
              </div>
              <span className="year-select-heading ml-3">{AppConstants.team}</span>
            </div>
            <span className="desc-text-style side-bar-profile-data">
              {data && (data.team ? data.team.name : data.teamName)}
            </span>
          </div>
          <div className="live-score-side-desc-view">
            <div className="live-score-title-icon-view">
              <div className="live-score-icon-view">
                <img src={AppImages.circleOutline} alt="" height="16" width="16" />
              </div>
              <span className="year-select-heading ml-3">{AppConstants.division}</span>
            </div>
            <span className="desc-text-style side-bar-profile-data">
              {data && (data.division ? data.division.name : '')}
            </span>
          </div>
          <div className="live-score-side-desc-view">
            <div className="live-score-title-icon-view">
              <div className="live-score-icon-view">
                <img src={AppImages.circleOutline} alt="" height="16" width="16" />
              </div>
              <span className="year-select-heading ml-3">{AppConstants.competition}</span>
            </div>
            <span className="desc-text-style side-bar-profile-data">{'TWSA'}</span>
          </div>
        </div>
      </div>
    );
  };

  tabCallBack = key => {
    this.setState({ playerTabKey: key });
  };

  btnView = () => {
    return (
      <div className="col-sm mt-5 d-flex justify-content-end">
        <div className="comp-dashboard-botton-view-mobile">
          <NavLink
            to={{
              pathname: '/matchDayAddPlayer',
              state: { isEdit: true, playerData: this.state.data },
            }}
          >
            <Button className="primary-add-comp-form mr-5" type="primary">
              + {AppConstants.edit}
            </Button>
          </NavLink>
        </div>
        <div className="comp-dashboard-botton-view-mobile">
          <Button className="primary-add-comp-form" type="primary">
            {AppConstants.delete}
          </Button>
        </div>
      </div>
    );
  };

  //////// tableView
  activityView = () => {
    return (
      <div>
        <div className="comp-dash-table-view p-0">
          <div className="table-responsive home-dash-table-view">
            <Table
              className="home-dashboard-table"
              columns={activity_Columns}
              dataSource={activity_data}
              pagination={false}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Pagination
            className="antd-pagination"
            defaultCurrent={1}
            showSizeChanger={false}
            total={8}
          />
        </div>
      </div>
    );
  };

  //////// tableView
  shootingStateView = () => {
    return (
      <div>
        <div className="comp-dash-table-view p-0">
          <div className="table-responsive home-dash-table-view ">
            <Table
              className="home-dashboard-table"
              columns={shhoting_Columns}
              dataSource={shhoting_data}
              pagination={false}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Pagination
            className="antd-pagination"
            defaultCurrent={1}
            showSizeChanger={false}
            total={8}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout
          menuHeading={AppConstants.matchDay}
          menuName={AppConstants.liveScores}
          onMenuHeadingClick={() => history.push('./matchDayCompetitions')}
        />
        <InnerHorizontalMenu
          menu="liveScore"
          liveScoreSelectedKey={
            this.state.screenName === 'dashboard'
              ? '1'
              : this.state.screenName === 'incident'
              ? '17'
              : '7'
          }
        />
        <Layout className="live-score-player-profile-layout">
          <Content className="live-score-player-profile-content">
            <div className="fluid-width">
              <div className="row">
                <div className="col-sm-3" style={{ marginBottom: '7%' }}>
                  {this.profileImageView()}
                </div>
                <div className="col-sm-9 default-bg">
                  {this.btnView()}
                  <div className="inside-table-view mt-4">
                    <Tabs defaultActiveKey="1" onChange={this.tabCallBack}>
                      <TabPane tab={AppConstants.activity} key="1">
                        {this.activityView()}
                      </TabPane>
                      <TabPane tab={AppConstants.shootingState} key="2">
                        {this.shootingStateView()}
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default LiveScorePlayerView;
