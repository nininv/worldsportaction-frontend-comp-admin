import React, { Component, createRef } from 'react';
import {
  Layout,
  Breadcrumb,
  Button,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Input,
  message,
} from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import ValidationConstants from '../../themes/validationConstant';
import moment from 'moment';
import InputWithHead from '../../customComponents/InputWithHead';
import AppImages from '../../themes/appImages';
import {
  liveScoreUpdateIncidentData,
  liveScoreAddEditIncident,
  liveScoreIncidentTypeAction,
} from '../../store/actions/LiveScoreAction/liveScoreIncidentAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import history from '../../util/history';
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction';
import {
  isArrayNotEmpty,
  captializedString,
  isImageFormatValid,
  isImageSizeValid,
} from '../../util/helpers';
import { getLiveScoreCompetiton, getUmpireCompetitionData } from '../../util/sessionStorage';
import { liveScorePlayerListAction } from '../../store/actions/LiveScoreAction/liveScorePlayerAction';
import Loader from '../../customComponents/loader';
import ImageLoader from '../../customComponents/ImageLoader';

const { Footer, Content, Header } = Layout;
const { Option } = Select;
const { TextArea } = Input;

class LiveScoreAddIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyData: '',
      image: null,
      media: null,
      video: null,
      imageSelection: AppImages.circleImage,
      videoSelection: AppImages.circleImage,
      incidentImage: '',
      incidentVideo: '',
      editorData: '',
      imageTimeout: null,
      videoTimeout: null,
      isEdit: this.props.location.state
        ? this.props.location.state.isEdit
          ? this.props.location.state.isEdit
          : false
        : false,
      tableRecord: this.props.location.state
        ? this.props.location.state.tableRecord
          ? this.props.location.state.tableRecord
          : false
        : false,
      load: false,
      incidentId: null,
      matchId: this.props.location.state ? this.props.location.state.matchId : null,
      matchDetails: this.props.location.state ? this.props.location.state.matchDetails : null,
      crossImageIcon: false,
      crossVideoIcon: false,
      umpireKey: this.props.location
        ? this.props.location.state
          ? this.props.location.state.umpireKey
          : null
        : null,
      screenName: props.location.state
        ? props.location.state.screenName
          ? props.location.state.screenName
          : null
        : null,
    };
    this.formRef = createRef();
  }

  componentDidMount() {
    if (this.state.umpireKey === 'umpire') {
      if (getUmpireCompetitionData()) {
        const { id, competitionOrganisation, competitionOrganisationId } = JSON.parse(
          getUmpireCompetitionData(),
        );
        let compOrgId = competitionOrganisation
          ? competitionOrganisation.id
          : competitionOrganisationId
          ? competitionOrganisationId
          : 0;
        const { incidentData } = this.props.liveScoreIncidentState;
        this.props.liveScoreIncidentTypeAction();
        if (id !== null) {
          this.props.getliveScoreTeams(id, null, compOrgId);
        }

        if (this.state.isEdit === true) {
          this.props.liveScoreUpdateIncidentData(this.state.tableRecord, 'isEdit');
          this.setInitialFieldValue();
          if (id !== null) {
            this.props.liveScorePlayerListAction(id, incidentData.teamId);
          }
        } else {
          this.props.liveScoreUpdateIncidentData(this.state.tableRecord, 'isAdd');
        }
      } else {
        history.push('/umpireDashboard');
      }
    } else {
      if (getLiveScoreCompetiton()) {
        const { id, competitionOrganisation, competitionOrganisationId } = JSON.parse(
          getLiveScoreCompetiton(),
        );
        let compOrgId = competitionOrganisation
          ? competitionOrganisation.id
          : competitionOrganisationId
          ? competitionOrganisationId
          : 0;
        const { incidentData } = this.props.liveScoreIncidentState;
        this.props.liveScoreIncidentTypeAction();
        if (id !== null) {
          this.props.getliveScoreTeams(id, null, compOrgId);
        }

        if (this.state.isEdit === true) {
          this.props.liveScoreUpdateIncidentData(this.state.tableRecord, 'isEdit');
          this.setInitialFieldValue();
          if (id !== null) {
            this.props.liveScorePlayerListAction(id, incidentData.teamId);
          }
        } else {
          this.props.liveScoreUpdateIncidentData(this.state.tableRecord, 'isAdd');
        }
      } else {
        history.push('/matchDayCompetitions');
      }
    }
  }

  ////set initial value for all validated fields
  setInitialFieldValue() {
    const { incidentData } = this.props.liveScoreIncidentState;
    this.formRef.current.setFieldsValue({
      incidentTeamName: incidentData.teamId,
      incidentPlayerName: incidentData.playerIds,
      incidentName: incidentData.injury,
      mnbMatchId: incidentData.mnbMatchId,
    });
  }

  //Select Image
  selectImage() {
    const fileInput = document.getElementById('user-pic');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/*');
    if (!!fileInput) {
      fileInput.click();
    }
  }

  //select video
  selectVideo() {
    const fileInput = document.getElementById('user-vdo');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'video/*');
    if (!!fileInput) {
      fileInput.click();
    }
  }

  setImage_1 = data => {
    if (data.files[0] !== undefined) {
      if (this.state.isEdit === true) {
      }
      this.setState({ image: data.files[0], imageSelection: URL.createObjectURL(data.files[0]) });
    }
    // this.props.liveScoreUpdateIncidentData(null, "clearImage")
  };

  setImage = data => {
    if (data.files[0] !== undefined) {
      let file = data.files[0];
      let extension = file.name.split('.').pop().toLowerCase();
      let imageSizeValid = isImageSizeValid(file.size);
      let isSuccess = isImageFormatValid(extension);
      if (!isSuccess) {
        message.error(AppConstants.logo_Image_Format);
        return;
      }
      if (!imageSizeValid) {
        message.error(AppConstants.logo_Image_Size);
        return;
      }
      this.setState({
        image: data.files[0],
        imageSelection: URL.createObjectURL(data.files[0]),
        imageTimeout: 2000,
        crossImageIcon: false,
      });
      setTimeout(() => {
        this.setState({ imageTimeout: null, crossImageIcon: true });
      }, 2000);
    }
  };

  ////method to setVideo
  setVideo = data => {
    if (data.files[0] !== undefined) {
      if (data.files[0].size > AppConstants.video_size) {
        message.error(AppConstants.videoSize);
        // return;
      } else {
        this.setState({
          videoTimeout: 2000,
          crossVideoIcon: false,
          video: data.files[0],
          videoSelection: URL.createObjectURL(data.files[0]),
        });

        setTimeout(() => {
          this.setState({ videoTimeout: null, crossVideoIcon: true });
        }, 2000);
      }
      // this.setState({ video: data.files[0], videoSelection: URL.createObjectURL(data.files[0]) })

      // this.props.liveScoreUpdateIncidentData(null, "clearVideo")
    }
  };

  headerView = () => {
    return (
      <div className="header-view">
        <Header className="form-header-view bg-transparent d-flex align-items-center">
          <div className="row">
            <div className="col-sm d-flex align-content-center">
              <Breadcrumb separator=" > ">
                <Breadcrumb.Item className="breadcrumb-add">
                  {this.state.isEdit === true
                    ? AppConstants.editIncident
                    : AppConstants.addIncident}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        </Header>
      </div>
    );
  };

  Capitalize(str) {
    let text = str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
    return text;
    // return str.charAt(0).toUpperCase() + str.slice(1);
  }

  deleteImage() {
    const { incidentMediaList } = this.props.liveScoreIncidentState;
    // this.setState({ image: null, imageSelection: '', crossImageIcon: false })
    this.setState({ image: null, crossImageIcon: false, imageSelection: AppImages.circleImage });
    if (incidentMediaList) {
      this.props.liveScoreUpdateIncidentData(null, 'incidentImage');
    }
  }

  deleteVideo() {
    const { incidentMediaList } = this.props.liveScoreIncidentState;
    this.setState({ video: null, videoSelection: '', crossVideoIcon: false });
    if (incidentMediaList) {
      this.props.liveScoreUpdateIncidentData(null, 'incidentVideo');
    }
  }

  setTeamId(teamId) {
    if (this.state.umpireKey) {
      if (getUmpireCompetitionData()) {
        const { id } = JSON.parse(getUmpireCompetitionData());
        this.props.liveScorePlayerListAction(id, teamId);
        this.props.liveScoreUpdateIncidentData(null, 'clearPyarIds');
        this.props.liveScoreUpdateIncidentData(teamId, 'teamId');
        this.setInitialFieldValue();
      }
    } else {
      if (getLiveScoreCompetiton()) {
        const { id } = JSON.parse(getLiveScoreCompetiton());
        this.props.liveScorePlayerListAction(id, teamId);
        this.props.liveScoreUpdateIncidentData(null, 'clearPyarIds');
        this.props.liveScoreUpdateIncidentData(teamId, 'teamId');
        this.setInitialFieldValue();
      }
    }
  }

  //// Form View
  contentView = () => {
    const {
      incidentData,
      playerResult,
      incidentTypeResult,
      playerIds,
      team1_Name,
      team2_Name,
      team1Id,
      team2Id,
    } = this.props.liveScoreIncidentState;
    let team_1 = this.state.matchDetails
      ? isArrayNotEmpty(this.state.matchDetails.match)
        ? this.state.matchDetails.match[0].team1.name
        : null
      : null;
    let team1_Id = this.state.matchDetails
      ? isArrayNotEmpty(this.state.matchDetails.match)
        ? this.state.matchDetails.match[0].team1.id
        : null
      : null;
    let team_2 = this.state.matchDetails
      ? isArrayNotEmpty(this.state.matchDetails.match)
        ? this.state.matchDetails.match[0].team2.name
        : null
      : null;
    let team2_Id = this.state.matchDetails
      ? isArrayNotEmpty(this.state.matchDetails.match)
        ? this.state.matchDetails.match[0].team2.id
        : null
      : null;
    let date = this.state.matchDetails
      ? moment(this.state.matchDetails.match[0].startTime).format('DD-MM-YYYY')
      : null;
    let startDate = date ? moment(date, 'DD-MM-YYYY') : null;
    let time_formate = this.state.matchDetails
      ? moment(this.state.matchDetails.match[0].startTime).format('HH:mm')
      : null;
    let startTime = time_formate ? moment(time_formate, 'HH:mm') : null;
    return (
      <div className="content-view pt-4">
        <div className="row">
          <div className="col-sm">
            <InputWithHead heading={AppConstants.date} />

            <DatePicker
              // size="large"
              className="w-100"
              onChange={date => {
                this.props.liveScoreUpdateIncidentData(moment(date).format('MM/DD/YYYY'), 'date');
              }}
              format="DD-MM-YYYY"
              showTime={false}
              name="registrationOepn"
              placeholder="dd-mm-yyyy"
              value={incidentData && incidentData.date ? moment(incidentData.date) : startDate}
            />
          </div>
          <div className="col-sm">
            <InputWithHead heading={AppConstants.time} />

            <TimePicker
              className="comp-venue-time-timepicker w-100"
              onChange={time => this.props.liveScoreUpdateIncidentData(time, 'time')}
              onBlur={e =>
                this.props.liveScoreUpdateIncidentData(
                  e.target.value && moment(e.target.value, 'HH:mm'),
                  'time',
                )
              }
              format="HH:mm"
              placeholder="Select Time"
              defaultValue={moment('00:00', 'HH:mm')}
              use12Hours={false}
              value={
                incidentData
                  ? incidentData.time
                    ? moment(incidentData.time)
                    : startTime
                  : startTime
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm">
            <InputWithHead required="required-field" heading={AppConstants.team} />
            {this.state.isEdit ? (
              <Form.Item
                name="incidentTeamName"
                rules={[{ required: true, message: ValidationConstants.teamName }]}
                className="slct-in-add-manager-livescore livefirst"
              >
                <Select
                  className="reg-form-multiple-select w-100"
                  placeholder="Select Home Team"
                  onChange={teamId => this.setTeamId(teamId)}
                  // value={incidentData.teamId ? incidentData.teamId : ''}
                  optionFilterProp="children"
                >
                  {/* {isArrayNotEmpty(teamResult) && teamResult.map((item) => (
                                        <Option key={'team_' + item.id} value={item.id}>{item.name}</Option>
                                    ))} */}
                  <Option key={team1Id} value={team1Id}>
                    {team1_Name}
                  </Option>
                  <Option key={team2Id} value={team2Id}>
                    {team2_Name}
                  </Option>
                </Select>
              </Form.Item>
            ) : (
              <Form.Item
                name="incidentTeamName"
                rules={[{ required: true, message: ValidationConstants.teamName }]}
                className="slct-in-add-manager-livescore livefirst"
              >
                <Select
                  className="reg-form-multiple-select w-100"
                  placeholder="Select Home Team"
                  onChange={teamId => this.setTeamId(teamId)}
                  // value={incidentData.teamId ? incidentData.teamId : ''}
                  optionFilterProp="children"
                >
                  <Option key={team1_Id} value={team1_Id}>
                    {team_1}
                  </Option>
                  <Option key={team2_Id} value={team2_Id}>
                    {team_2}
                  </Option>
                </Select>
              </Form.Item>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            {/*
                        <Form.Item
                            name="incidentPlayerName"
                            rules={[{ required: true, message: ValidationConstants.incidentPlayer }]}
                            className="slct-in-add-manager-livescore"
                        >
                        */}
            <InputWithHead required="pb-0 pt-4.5" heading={AppConstants.players} />
            <Select
              loading={this.props.liveScoreState.onLoad === true && true}
              mode="multiple"
              showSearch
              placeholder={AppConstants.selectPlayer}
              className="w-100"
              onChange={playerId => this.props.liveScoreUpdateIncidentData(playerId, 'playerId')}
              value={playerIds}
            >
              {isArrayNotEmpty(playerResult) &&
                playerResult.map(item => (
                  <Option key={'player_' + item.playerId} value={item.playerId}>
                    {item.firstName + ' ' + item.lastName}
                  </Option>
                ))}
            </Select>
            {/* </Form.Item> */}
          </div>
          <div className="col-sm">
            <InputWithHead required="required-field pb-0 pt-4.5" heading={AppConstants.incident} />
            <Form.Item
              name="incidentName"
              rules={[{ required: true, message: ValidationConstants.incidentName }]}
              className="slct-in-add-manager-livescore livefirst one"
            >
              <Select
                showSearch
                placeholder={AppConstants.selectIncident}
                className="w-100"
                onChange={incident => this.props.liveScoreUpdateIncidentData(incident, 'injury')}
                // value={incidentData.injury ? incidentData.injury : undefined}
              >
                {isArrayNotEmpty(incidentTypeResult) &&
                  incidentTypeResult.map(item => (
                    <Option key={'incidentType_' + item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        {/*
                <div className="row">
                    <div className="col-sm-6">
                        <InputWithHead
                            heading={AppConstants.claim}
                            placeholder={AppConstants.yesNo}
                            onChange={(event) => this.props.liveScoreUpdateIncidentData(event.target.value, "claim")}
                            value={incidentData ? incidentData.claim : ""}
                        />
                    </div>
                </div>
                */}

        <div className="row">
          <div className="col-sm">
            <InputWithHead heading={AppConstants.description} />
            <TextArea
              allowClear
              onChange={event =>
                this.props.liveScoreUpdateIncidentData(
                  captializedString(event.target.value),
                  'description',
                )
              }
              // dangerouslySetInnerHTML={{ _html: editData.body }}
              // dangerouslySetInnerHTML={{ __html: editData.body }}
              // value={this.html2text(editData.body)}
              value={incidentData.description}
              name={'newsTitle'}
              onBlur={i =>
                this.formRef.current.setFieldsValue({
                  Description: captializedString(i.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm">
            <InputWithHead heading={AppConstants.addImages} />
            <div className="reg-competition-logo-view" onClick={this.selectImage}>
              <ImageLoader
                timeout={this.state.imageTimeout}
                src={incidentData.addImages ? incidentData.addImages : this.state.imageSelection}
              />
            </div>
            <input
              type="file"
              id="user-pic"
              className="d-none"
              // onChange={(event) => {
              //     this.setImage(event.target, 'evt.target')
              //     this.setState({ imageTimeout: 2000, crossImageIcon: false })
              //     setTimeout(() => {
              //         this.setState({ imageTimeout: null, crossImageIcon: true })
              //     }, 2000);
              // }}
              onChange={evt => this.setImage(evt.target)}
              onClick={event => {
                event.target.value = null;
              }}
            />

            <div className="position-absolute" style={{ bottom: 71, left: 150 }}>
              {(this.state.crossImageIcon || incidentData.addImages) && (
                <span className="user-remove-btn pl-2" style={{ cursor: 'pointer' }}>
                  <img
                    className="dot-image"
                    src={AppImages.redCross}
                    alt=""
                    width="16"
                    height="16"
                    onClick={() => this.deleteImage()}
                  />
                </span>
              )}
            </div>
            <span className="image-size-format-text">{AppConstants.imageSizeFormatText}</span>
          </div>

          <div className="col-sm">
            <InputWithHead heading={AppConstants.addVideos} />
            <div className="reg-competition-logo-view" onClick={this.selectVideo}>
              <ImageLoader
                timeout={this.state.videoTimeout}
                video
                src={incidentData.addVideo ? incidentData.addVideo : this.state.videoSelection}
                // poster={(incidentData.addVideo || this.state.videoSelection != '') ? '' : AppImages.circleImage}
                // poster={incidentData.addVideo ? incidentData.addVideo : this.state.videoSelection}
              />
            </div>
            <input
              type="file"
              id="user-vdo"
              className="d-none"
              onChange={event => {
                this.setVideo(event.target, 'evt.target');
                // this.setState({ videoTimeout: 2000, crossVideoIcon: false })
                // setTimeout(() => {
                //     this.setState({ videoTimeout: null, crossVideoIcon: true })
                // }, 2000);
              }}
              onClick={event => {
                event.target.value = null;
              }}
            />

            <div className="position-absolute" style={{ bottom: 71, left: 150 }}>
              {(this.state.crossVideoIcon || incidentData.addVideo) && (
                <span className="user-remove-btn pl-2" style={{ cursor: 'pointer' }}>
                  <img
                    className="dot-image"
                    src={AppImages.redCross}
                    alt=""
                    width="16"
                    height="16"
                    onClick={() => this.deleteVideo()}
                  />
                </span>
              )}
            </div>
            <span className="video_Message">{AppConstants.videoSizeMessage}</span>
          </div>
        </div>
      </div>
    );
  };

  footerView = isSubmitting => {
    return (
      <div className="fluid-width">
        <div className="footer-view">
          <div className="row">
            <div className="col-sm">
              <div className="reg-add-save-button">
                <Button
                  className="cancelBtnWidth"
                  onClick={() => history.push('/matchDayIncidentList')}
                  type="cancel-button"
                >
                  {AppConstants.cancel}
                </Button>
              </div>
            </div>
            <div className="col-sm">
              <div className="comp-buttons-view">
                {/* <Form.Item> */}
                {/* <Button onClick={(editData.title == '' || editData.author == null) ? this.handleSubmit : this.onSaveButton} className="user-approval-button" */}
                <Button
                  className="publish-button save-draft-text mr-0"
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
                >
                  {AppConstants.save}
                </Button>
                {/* </Form.Item> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  onSaveClick = e => {
    const { incidentData, incidentId, incidentMediaIds } = this.props.liveScoreIncidentState;
    let compId = null;

    if (this.state.umpireKey === 'umpire') {
      if (getUmpireCompetitionData()) {
        const { id } = JSON.parse(getUmpireCompetitionData());
        compId = id;
      }
    } else {
      const { id } = JSON.parse(getLiveScoreCompetiton());
      compId = id;
    }

    let date = incidentData.date
      ? moment(incidentData.date).format('YYYY-MMM-DD')
      : this.state.matchDetails
      ? moment(this.state.matchDetails.match[0].startTime).format('YYYY-MMM-DD')
      : null;
    let time = incidentData.date
      ? moment(incidentData.time).format('HH:mm')
      : this.state.matchDetails
      ? moment(this.state.matchDetails.match[0].startTime).format('HH:mm')
      : null;
    let startDateTime = moment(date + ' ' + time);
    let formatDateTime = new Date(startDateTime).toISOString();
    let mediaArry;
    let body;
    if (this.state.image !== null && this.state.video !== null) {
      mediaArry = [this.state.image, this.state.video];
    } else if (this.state.image !== null) {
      mediaArry = [this.state.image];
    } else if (this.state.video !== null) {
      mediaArry = [this.state.video];
    }

    if (this.state.isEdit) {
      body = {
        matchId: incidentData.mnbMatchId,
        teamId: incidentData.teamId,
        competitionId: compId,
        incidentTime: formatDateTime,
        description: incidentData.description,
        incidentTypeId: incidentData.injury,
        id: incidentId,
      };
    } else {
      body = {
        // matchId: incidentData.mnbMatchId,
        matchId: this.state.matchId,
        teamId: incidentData.teamId,
        competitionId: compId,
        incidentTime: formatDateTime,
        description: incidentData.description,
        incidentTypeId: incidentData.injury,
      };
    }

    if (this.state.image !== null || this.state.video !== null || incidentMediaIds.length > 0) {
      this.props.liveScoreAddEditIncident({
        body,
        playerIds: incidentData.playerIds,
        isEdit: this.state.isEdit,
        mediaArry,
        key: 'media',
        incidentMediaIds,
        umpireKey: this.state.umpireKey,
        incidentId,
      });
    } else {
      this.props.liveScoreAddEditIncident({
        body,
        playerIds: incidentData.playerIds,
        isEdit: this.state.isEdit,
        mediaArry,
        key: 'media',
        incidentMediaIds,
        umpireKey: this.state.umpireKey,
        incidentId,
      });
    }
  };

  render() {
    const { umpireKey } = this.state;
    let screen = this.props.location.state
      ? this.props.location.state.screenName
        ? this.props.location.state.screenName
        : null
      : null;
    return (
      <div className="fluid-width default-bg">
        {umpireKey ? (
          <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
        ) : (
          <DashboardLayout
            menuHeading={AppConstants.matchDay}
            menuName={AppConstants.liveScores}
            onMenuHeadingClick={() => history.push('./matchDayCompetitions')}
          />
        )}

        {umpireKey ? (
          <InnerHorizontalMenu
            menu="umpire"
            umpireSelectedKey={screen === 'umpireList' ? '2' : '1'}
          />
        ) : (
          <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="17" />
        )}

        <Loader visible={this.props.liveScoreIncidentState.loading} />

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
  return bindActionCreators(
    {
      liveScoreUpdateIncidentData,
      // liveScoreClearIncident,
      getliveScoreTeams,
      liveScorePlayerListAction,
      liveScoreAddEditIncident,
      liveScoreIncidentTypeAction,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    liveScoreIncidentState: state.LiveScoreIncidentState,
    liveScoreState: state.LiveScoreState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreAddIncident);
