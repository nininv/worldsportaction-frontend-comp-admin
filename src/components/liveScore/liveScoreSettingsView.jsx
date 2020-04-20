import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    Radio,
    Tabs,
    Input,
    Form
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import { connect } from 'react-redux';
import AppImages from "../../themes/appImages";
import {
    getLiveScoreSettingInitiate,
    onChangeSettingForm,
    settingDataPostInititae,
    clearLiveScoreSetting,
    searchVenueList,
    clearFilter
} from '../../store/actions/LiveScoreAction/LiveScoreSettingAction'
import Loader from '../../customComponents/loader';
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import {

    getCompetitonVenuesList
} from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import ImageLoader from '../../customComponents/ImageLoader'
import history from "../../util/history";
const { Header, Footer } = Layout;
const { Option } = Select;

class LiveScoreSettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: AppImages.circleImage,
            image: null,
            venueData: [],
            reportSelection: 'Period',
            recordSelection: 'Own',
            competitionFormat: null,
            timeOut: null
        };
    }
    componentDidMount() {
        let comp_id = getLiveScoreCompetiton()
        if (comp_id) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            if (this.props.location.state === 'edit' || id) {
                this.props.getLiveScoreSettingInitiate(id)
                this.props.getCompetitonVenuesList()
            } else {
                this.props.clearLiveScoreSetting()
                this.props.getCompetitonVenuesList()
            }
        }
        if (this.props.location.state === 'add') {
            this.props.clearLiveScoreSetting()
            this.props.getCompetitonVenuesList()
        }

    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreSetting != this.props.liveScoreSetting) {
            const { competitionName, shortName, competitionLogo, scoring } = this.props.liveScoreSetting.form
            this.props.form.setFieldsValue({
                competition_name: competitionName,
                short_name: shortName,
                time: this.props.liveScoreSetting.form.timerType,
                venue: this.props.liveScoreSetting.form.venue
            })


        }
        if (nextProps.venueList != this.props.venueList) {
        }
    }


    ////method to select multiple value
    teamChange = (value) => {
        this.props.onChangeSettingForm({ key: 'venue', data: value })
    }


    competition_format = e => {
        this.props.onChangeSettingForm({ key: 'scoring', data: e.target.value })
    };

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]) })
            const imgData = URL.createObjectURL(data.files[0])
            this.props.onChangeSettingForm({ key: 'competitionLogo', data: data.files[0] })
            this.props.onChangeSettingForm({ key: 'Logo', data: imgData })
        }
    };

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    //method to check box selection
    onChangeCheckBox(checkedValues) {

        this.props.onChangeSettingForm({ key: 'record1', data: checkedValues })
    }
    onChangeCheckBox2(checkedValues) {
        this.props.onChangeSettingForm({ key: 'record2', data: checkedValues })
    }

    ////method to change time
    onChangeTime(time, timeString) {
    }

    tabCallBack = (key) => {
        this.setState({ competitionTabKey: key })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {


            if (!err) {
                const arrayOfVenue = this.props.liveScoreSetting.form.allVenue.map(data => data.id)
                const {
                    id,
                    competitionName,
                    shortName,
                    competitionLogo,
                    scoring,
                    record1,
                    record2,
                    attendanceRecordingType,
                    attendanceRecordingPeriod,
                    timerType,
                    venue
                } = this.props.liveScoreSetting.form
                const umpire = record1.includes("recordUmpire")
                const umpirenum = umpire ? 1 : 0
                const gameTimeTracking = record1.includes("gameTimeTracking")
                const positionTracking = record1.includes("positionTracking")
                const recordGoalAttempts = record2.includes("recordGoalAttempts")
                const centrePassEnabled = record2.includes("centrePassEnabled")
                const incidentsEnabled = record2.includes("incidentsEnabled")


                let orgId = null
                if (this.props.location.state === 'add') {
                    let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
                    orgId = organisationId
                }

                var formData = new FormData();

                formData.append('id', id)
                formData.append('longName', competitionName)
                formData.append('name', shortName)
                formData.append('logo', competitionLogo)
                formData.append('recordUmpire', umpirenum)
                formData.append('gameTimeTracking', gameTimeTracking)
                formData.append('positionTracking', positionTracking)
                formData.append('recordGoalAttempts', recordGoalAttempts)
                formData.append('centrePassEnabled', centrePassEnabled)
                formData.append('incidentsEnabled', incidentsEnabled)
                formData.append('attendanceRecordingType', attendanceRecordingType)
                formData.append('attendanceRecordingPeriod', attendanceRecordingPeriod)
                formData.append('scoringType', scoring)
                formData.append('timerType', timerType)
                formData.append('organisationId', orgId ? orgId : this.props.liveScoreSetting.data.organisationId)

                this.props.settingDataPostInititae({ body: formData, venue: venue, settingView: this.props.location.state })
                // this.props.clearLiveScoreSetting()
                // this.props.history.push('/liveScoreCompetitions')
                // this.props.clearLiveScoreSetting()
            }
        });
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.settings}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    handleSearch = (value, data) => {
        console.log(value, data)
        const filteredData = data.filter(memo => {
            return memo.venueName.indexOf(value) > -1
        })
        this.props.searchVenueList(filteredData)

    };

    ////////form content view
    contentView = (getFieldDecorator) => {
        const { competitionName, competitionLogo, scoring } = this.props.liveScoreSetting.form
        const { loader } = this.props.liveScoreSetting
        let grade = this.state.venueData
        const applyTo1 = [{ label: 'Record Umpire', value: "recordUmpire" }, { label: ' Game Time Tracking', value: "gameTimeTracking" }, { label: 'Position Tracking', value: "positionTracking" }];
        const applyTo2 = [{ label: 'Record Goal Attempts', value: "recordGoalAttempts" }, { label: 'Centre Pass Enabled', value: "centrePassEnabled" }, { label: 'Incidents Enabled', value: "incidentsEnabled" }];
        console.log(this.props.venueList, 'this.props.venueList')
        return (
            <div className="content-view pt-4">
                <Form.Item>
                    {getFieldDecorator('competition_name', {
                        rules: [{ required: true, message: ValidationConstants.competitionField }]
                    })(
                        <InputWithHead
                            required={"required-field pb-0"}
                            heading={AppConstants.competition_name}
                            placeholder={AppConstants.competition_name}
                            name="competitionName"
                            // value="xyz"
                            onChange={(e) => {
                                console.log(e.target.name, e.target.value)
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('short_name', {
                        rules: [{ required: true, message: ValidationConstants.shortField }]
                    })(
                        <InputWithHead
                            required={"required-field pb-0"}
                            heading={AppConstants.short_Name}
                            placeholder={AppConstants.short_Name}
                            name="shortName"
                            // value="xyz"
                            onChange={(e) => {
                                console.log(e.target.name, e.target.value)
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    )}
                </Form.Item>

                {/* image and check box view */}
                <InputWithHead heading={AppConstants.competitionLogo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                {/* <label>
                                    <img
                                        src={this.props.liveScoreSetting.form.Logo}
                                        alt=""
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name={'image'}


                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    />
                                </label> */}

                                <ImageLoader
                                    timeout={this.state.timeout}
                                    src={this.props.liveScoreSetting.form.Logo} />

                            </div>
                            <input
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                name={"imageFile"}
                                onChange={(evt) => {
                                    this.setImage(evt.target)
                                    this.setState({ timeout: 2000 })
                                    setTimeout(() => {
                                        this.setState({ timeout: null })
                                    }, 2000);
                                }} />

                        </div>
                        <div
                            className="col-sm"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <Checkbox
                                className="single-checkbox"
                                defaultChecked={true}

                            // onChange={e => this.onChange(e)}
                            >
                                {AppConstants.useDefault}
                            </Checkbox>
                        </div>

                    </div>
                </div>

                {/* venue muilti selection */}
                <InputWithHead
                    required={"required-field pb-0"}


                    heading={AppConstants.venues} />
                <div>
                    <Form.Item>
                        {getFieldDecorator('venue', {
                            rules: [{ required: true, message: ValidationConstants.venueField }]
                        })(
                            <Select
                                mode="multiple"
                                placeholder={AppConstants.selectVenue}
                                style={{ width: "100%", }}
                                onChange={value => {
                                    this.props.onChangeSettingForm({ key: 'venue', data: value })
                                    this.props.clearFilter()
                                }}
                                filterOption={false}
                                // value={this.state.team === [] ? AppConstants.selectTeam : this.state.team}
                                onSearch={(value) => { this.handleSearch(value, this.props.liveScoreSetting.mainVenueList) }}
                                value={"261"}
                            >
                                {this.props.venueList.venueData ? this.props.liveScoreSetting.venueData.map((item) => {
                                    return <Option key={item.venueId} value={item.venueId}>
                                        {item.venueName}
                                    </Option>
                                }) : ''}
                            </Select>
                        )}
                    </Form.Item>

                </div>

                {/* match settings check boxes */}
                <InputWithHead heading={AppConstants.matchSettings} />
                <span className="applicable-to-heading"> {AppConstants.wouldLikeRecord}</span>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox.Group
                                style={{
                                    display: "-ms-flexbox",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}
                                options={applyTo1}
                                value={this.props.liveScoreSetting.form.record1}
                                onChange={e => this.onChangeCheckBox(e)}
                            />
                        </div>
                        <div className="col-sm" style={{ paddingTop: 1 }}>
                            <Checkbox.Group
                                style={{
                                    display: "-ms-flexbox",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}
                                options={applyTo2}
                                value={this.props.liveScoreSetting.form.record2}
                                onChange={e => this.onChangeCheckBox2(e)}
                            />
                        </div>
                    </div>
                </div>

                {/* dropdown view */}
                <InputWithHead heading={AppConstants.attendence_reord_report} />
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.record} />
                        <Select
                            placeholder={'Select Record'}
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                            onChange={recordSelection => this.props.onChangeSettingForm({ key: "attendanceRecordingType", data: recordSelection })}
                            value={this.props.liveScoreSetting.form.attendanceRecordingType}
                        // defaultValue={}
                        // value={this.props.liveScoreSetting.form.attendanceRecordingType}
                        >
                            <Option value={"OWN"}>{'Own'}</Option>
                            <Option value={"BOTH"}>{'Both'}</Option>
                            <Option value={"OPPOSITION"}>{'Opposition'}</Option>
                        </Select>
                    </div>
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.report} />
                        <Select
                            placeholder={'Select Report'}
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={reportSelection => this.props.onChangeSettingForm({ key: "attendanceRecordingPeriod", data: reportSelection })}
                            value={this.props.liveScoreSetting.form.attendanceRecordingPeriod}
                        // value={this.props.liveScoreSetting.form.attendanceRecordingPeriod}
                        >
                            <Option value={"PEROID"}>{'Period'}</Option>
                            <Option value={"MINUTE"}>{'Minute'}</Option>
                            <Option value={"MATCH"}>{'Games'}</Option>

                        </Select>
                    </div>
                </div>

                {/* radion button view */}
                <span className="applicable-to-heading">{AppConstants.scoring}</span>
                <div className="row" >

                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.competition_format(e)}
                        value={this.props.liveScoreSetting.form.scoring}
                    >
                        <div className="row ml-2" style={{ marginTop: 18 }} >
                            <Radio value={"SINGLE"}>{AppConstants.single}</Radio>
                            <Radio value={"50_50"}>{'50/50'} </Radio>
                        </div>
                    </Radio.Group>
                </div>

                {/* timer view */}
                <InputWithHead required={"required-field"} heading={AppConstants.timer} />
                <div>
                    <Form.Item>
                        {getFieldDecorator('time', {
                            rules: [{ required: true, message: ValidationConstants.timerField }]
                        })(
                            <Select
                                placeholder={'Select Time'}
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={timer => this.props.onChangeSettingForm({ key: "timerType", data: timer })}
                                // value={"CENTRAL"}
                                // value={this.props.liveScoreSetting.form.timerType}
                                // defaultValue={this.props.liveScoreSetting.form.timerType}
                                // defaultValue={this.props.liveScoreSetting.form.timerType}
                                placeholder={"Select Time"}
                            >
                                <Option value={"CENTRAL"}>{'Central'}</Option>
                                <Option value={"PER_MATCH"}>{'Per Match'}</Option>
                                <Option value={"CENTRAL_WITH_MATCH_OVERRIDE"}>{'Central with Per Match Override '}</Option>

                            </Select>
                        )}
                    </Form.Item>
                </div>

                {/* ladder setting view */}
                {/* <InputWithHead heading={AppConstants.ladderSettings} />
                <div className="inside-container-view" >
                    <div className="table-responsive">
                        <Table className="fees-table" columns={columns} dataSource={data} pagination={false} Divider=" false" />
                    </div>
                </div> */}
            </div>
        )
    };


    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            {/* <div className="reg-add-save-button">
                                <Button type="cancel-button">{AppConstants.delete}</Button>
                            </div> */}
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                {/* <Button className="save-draft-text" type="save-draft-text">
                                    {AppConstants.saveAsDraft}
                                </Button> */}
                                <Button onClick={this.handleSubmit} htmlType='submit' className="publish-button" type="primary">
                                    {this.state.competitionTabKey == 6 ? AppConstants.publish : AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    };




    render() {
        const { getFieldDecorator } = this.props.form
        let local_Id = getLiveScoreCompetiton()
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                {local_Id &&
                    <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"18"} />
                }
                <Loader visible={this.props.liveScoreSetting.loader} />
                <Layout>
                    {this.headerView()}
                    {/* <Content> */}
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        {/* <Form onSubmit={this.checkSubmit} noValidate="novalidate" className="login-form"> */}
                        <div className="formView">{this.contentView(getFieldDecorator)}</div>
                    </Form>

                    <Footer>{this.footerView()}</Footer>
                </Layout>
            </div>
        );
    }
}
function mapStatetoProps(state) {
    return {
        liveScoreSetting: state.LiveScoreSetting,
        venueList: state.LiveScoreMatchState
    }
}
export default connect(mapStatetoProps, { clearLiveScoreSetting, getLiveScoreSettingInitiate, onChangeSettingForm, getCompetitonVenuesList, settingDataPostInititae, searchVenueList, clearFilter })((Form.create()(LiveScoreSettingsView)));
