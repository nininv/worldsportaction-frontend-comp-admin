import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Input,
    Button,
    Table,
    Select,
    Checkbox,
    TimePicker,
    message,
    Form,
} from 'antd';
import moment from 'moment';
import CSVReader from 'react-csv-reader'
import Tooltip from 'react-png-tooltip'

import "./competition.css";
import InputWithHead from '../../customComponents/InputWithHead';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from "../../themes/appConstants";
import {
    updateVenuAndTimeDataAction,
    updateVenuListAction,
    refreshVenueFieldsAction,
    removeObjectAction,
    clearVenueDataAction
} from '../../store/actions/competitionModuleAction/venueTimeAction'
import { getYearAndCompetitionAction } from '../../store/actions/appAction'
import { getCommonRefData, addVenueAction, checkVenueDuplication } from '../../store/actions/commonAction/commonAction'
import { getAffiliatesListingAction } from '../../store/actions/userAction/userAction'
import history from '../../util/history'
import ValidationConstants from "../../themes/validationConstant";
import AppImages from '../../themes/appImages';
import { captializedString } from '../../util/helpers';
import PlacesAutocomplete from "./elements/PlaceAutoComplete";
import Loader from "../../customComponents/loader";
import { getOrganisationData } from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
}

class CompetitionVenueAndTimesAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveContraintLoad: false,
            firstTimeCompId: null,
            yearRefId: 1,
            screenNavigationKey: null,
            csvData: null,
            loading: false,
            screenHeader: "",
            hover: false,
            venueAddress: null,
            venueAddressError: '',
            courtColumns: [
                {
                    title: "Court Numbers",
                    dataIndex: "courtNumber",
                    key: "courtNumber",
                    render: (courtNumber) => (
                        <div style={{ textAlign: 'center' }}>
                            {courtNumber}
                        </div>
                    )
                },
                {
                    title: "Court Name",
                    dataIndex: "venueCourtName",
                    key: "venueCourtName",
                    render: (courtName, record, index) => {
                        return (
                            <Form.Item name={`venueCourtName${index}`} rules={[{ required: true, message: ValidationConstants.courtField[3] }]}>
                                <Input
                                    disabled={record.isDisabled}
                                    required="required-field pt-0"
                                    className="input-inside-table-venue-court"
                                    onChange={(courtName) => this.props.updateVenuAndTimeDataAction(courtName.target.value, index, 'venueCourtName', 'courtData')}
                                    value={courtName}
                                    placeholder="Court Name"
                                />
                            </Form.Item>
                        )
                    }
                },

                {
                    title: "Longitude",
                    dataIndex: "lng",
                    key: "lng",
                    width: 100,
                    filterDropdown: true,
                    filterIcon: () => (
                        <div className="mt-4">
                            <Tooltip placement="bottom">
                                <span>{AppConstants.LatitudeMsg}</span>
                            </Tooltip>
                        </div>
                    ),
                    render: (lng, record, index) => (
                        <div className="d-flex flex-row align-items-center">
                            <Form.Item name={`lng${index}`} rules={[{ required: true, message: ValidationConstants.courtField[2] }]}>
                                <Input
                                    className="input-inside-table-venue-court"
                                    onChange={(lng) => this.props.updateVenuAndTimeDataAction(lng.target.value, index, 'lng', 'courtData')}
                                    value={lng}
                                    placeholder="Longitude"
                                />
                            </Form.Item>
                        </div>
                    ),
                }, {
                    title: "Latitude",
                    dataIndex: "lat",
                    key: "lat",
                    width: 100,
                    // Sorter: true,
                    filterDropdown: true,
                    filterIcon: () => (
                        <div className="mt-4">
                            <Tooltip placement="bottom">
                                <span>{AppConstants.LatitudeMsg}</span>
                            </Tooltip>
                        </div>
                    ),
                    render: (lat, record, index) => (
                        // <div className="d-flex flex-row align-items-center" style={{ height: index > 0 ? 0 : 150 }}>
                        <div className="d-flex flex-row align-items-center">
                            <Form.Item
                                name={`lat${index}`}
                                rules={[{ required: true, message: ValidationConstants.courtField[1] }]}
                            >
                                <Input
                                    className="input-inside-table-venue-court"
                                    onChange={(lat) => this.props.updateVenuAndTimeDataAction(lat.target.value, index, 'lat', 'courtData')}
                                    value={lat}
                                    placeholder="Latitude"
                                />
                            </Form.Item>
                        </div>
                    ),
                },
                {
                    // title: "Override Venue Timeslots?",
                    title: <span >Override Venue Timeslots?</span>,
                    dataIndex: "overideSlot",
                    key: "overideSlot",
                    width: 150,
                    filterDropdown: true,
                    filterIcon: () => (
                        <div className="mt-4">
                            <Tooltip placement="bottom">
                                {AppConstants.overRideSlotMsg}
                            </Tooltip>
                        </div>
                    ),
                    render: (overideSlot, record, index) => (
                        // <div className="d-flex flex-row align-items-center">
                        <Checkbox
                            className="single-checkbox mt-1 d-flex justify-content-center"
                            defaultChecked={overideSlot}
                            onChange={e => this.overrideVenueSlotOnchange(e, index)}
                        />
                        // </div>
                    ),
                },
                {
                    title: "",
                    dataIndex: "clear",
                    key: "clear",
                    render: (clear, record, index) => (
                        <span className="w-100 d-flex justify-content-center pointer">
                            <img
                                className="dot-image"
                                src={AppImages.redCross}
                                alt=""
                                width="16"
                                height="16"
                                onClick={() => this.removeTableObj(clear, record, index)}
                            />
                        </span>
                    )
                }
            ]

        };
        this.myRef = React.createRef();
        this.props.getCommonRefData();
        const organisationData = getOrganisationData() ? getOrganisationData() : null;
        this.props.getAffiliatesListingAction({
            organisationId: organisationData.organisationUniqueKey,
            affiliatedToOrgId: -1,
            organisationTypeRefId: -1,
            statusRefId: -1,
            paging: { limit: -1, offset: 0 },
            stateOrganisations: true,
        });
        this.formRef = React.createRef();
    }

    removeTableObj(clear, record, index) {
        this.props.updateVenuAndTimeDataAction("", index, "remove")
        setTimeout(() => {
            this.setFormFieldValue();
        }, 300);
    }

    overrideVenueSlotOnchange(e, index) {
        this.props.updateVenuAndTimeDataAction(e.target.checked, index, 'overideSlot')
    }

    componentDidMount() {
        window.scroll(0, 0);
        // this.myRef.current.scrollTo(0, 0);
        let screenNavigationKey = this.props.location.state ? this.props.location.state.key : '';
        this.setState({ screenNavigationKey });
        this.setHeaderValue(screenNavigationKey);
        this.props.checkVenueDuplication();
    }

    setHeaderValue = (screenNavigationKey) => {
        if (screenNavigationKey === AppConstants.venues) {
            this.setState({ screenHeader: AppConstants.competitions });
        } else if (
            (screenNavigationKey === AppConstants.competitionFees) ||
            (screenNavigationKey === AppConstants.competitionDetails) ||
            (screenNavigationKey === AppConstants.dashboard)
        ) {
            this.setState({ screenHeader: AppConstants.registration });
        } else if (screenNavigationKey === AppConstants.venuesList) {
            this.setState({ screenHeader: AppConstants.user });
        }
    }

    componentDidUpdate(nextProps) {
        if (this.state.saveContraintLoad === true && this.props.commonReducerState.onVenueDataLoad === false) {
            this.navigateTo();
        }

        if (nextProps.venueTimeState !== this.props.venueTimeState) {
            if (this.state.csvData != null) {
                this.setState({ csvData: null, loading: false });
                this.setFormFieldValue();
            }
        }
    }

    setFormFieldValue = () => {
        let venueData = this.props.venueTimeState.venuData;
        // this.formRef.current.setFieldsValue({
        //     name: venueData.venueName,
        //     addressOne: venueData.street1,
        //     suburb: venueData.suburb,
        //     stateRefId: venueData.stateRefId,
        //     postcode: venueData.postalCode
        // });

        venueData.venueCourts.map((item, index) => {
            this.formRef.current.setFieldsValue({
                [`venueCourtName${index}`]: item.venueCourtName,
                [`lat${index}`]: item.lat,
                [`lng${index}`]: item.lng,
            });
        });
    }

    readVenueCourtCSV = (data) => {
        this.setState({ csvData: data, loading: true });
        this.props.updateVenuAndTimeDataAction(data, "addGameAndCourtThroughCSV", 'venueCourts');
        let e = document.getElementById("venueCourtUpload");
        e.value = null;
    };

    navigateTo = () => {
        if (this.state.screenNavigationKey == AppConstants.venues) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/competitionVenueTimesPrioritisation', 'fromAddVenue')
            }, 800);
            this.setState({ saveContraintLoad: false })
        } else if (this.state.screenNavigationKey == AppConstants.competitionFees) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                // history.push('/registrationCompetitionFee')
                history.push('/registrationCompetitionFee', {
                    venueScreen: true,
                    id: this.props.location.state ? this.props.location.state.id : null
                })
            }, 800);
            this.setState({ saveContraintLoad: false })
        } else if (this.state.screenNavigationKey == AppConstants.competitionDetails) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/competitionOpenRegForm')
            }, 800);
            this.setState({ saveContraintLoad: false })
        } else if (this.state.screenNavigationKey == AppConstants.dashboard) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/registrationCompetitionForm', {
                    venueScreen: true,
                    id: this.props.location.state ? this.props.location.state.id : null
                })
            }, 800);
            this.setState({ saveContraintLoad: false })
        } else if (this.state.screenNavigationKey == AppConstants.venuesList) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/venuesList')
            }, 800);
            this.setState({ saveContraintLoad: false })
        } else {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/')
            }, 800);
            this.setState({ saveContraintLoad: false })
        }
    }

    getDisabledHours = (startTime) => {
        let hours = [];
        let startHour = startTime.split(':')[0];
        for (let i = 0; i < Number(startHour); i++) {
            hours.push(i);
        }
        return hours;
    }

    getDisabledMinutes = (selectedHour, startTime) => {
        let hour = Number(startTime.split(":")[0]);
        let min = Number(startTime.split(":")[1]);
        let minutes = [];
        if (selectedHour === hour) {
            for (let i = 0; i <= min; i++) {
                minutes.push(i);
            }
        }
        if (selectedHour < hour) {
            for (let i = 0; i <= 60; i++) {
                minutes.push(i);
            }
        }
        return minutes;
    }

    validateTime = (rule, value, callback, startTime, endTime, type) => {
        if (type == "end") {
            if (startTime > endTime) {
                callback('End time should be greater than start time');
                return;
            }
        }
        callback();
    }

    onChangeGameTimePicker = (time, value, index, key1, key2) => {
        if (time != null)
            this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, key1, key2)
    }

    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.venueAndTimes}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        );
    };

    handlePlacesAutocomplete = (data) => {
        const { stateList } = this.props.commonReducerState;
        const address = data;
        this.props.checkVenueDuplication(address);

        if (!address || !address.addressOne || !address.suburb) {
            this.setState({
                venueAddressError: ValidationConstants.venueAddressDetailsError,
            })
        } else {
            this.setState({
                venueAddressError: ''
            })
        }

        this.setState({
            venueAddress: address,
        });

        const stateRefId = stateList.length > 0 && address.state
            ? stateList.find((state) => state.name === address.state).id
            : null;

        this.formRef.current.setFieldsValue({
            stateRefId,
            addressOne: address.addressOne || null,
            suburb: address.suburb || null,
            postcode: address.postcode || null,
        });

        if (address.addressOne) {
            this.props.updateVenuAndTimeDataAction(stateRefId, 'Venue', 'stateRefId');
            this.props.updateVenuAndTimeDataAction(address.addressOne, 'Venue', 'street1');
            this.props.updateVenuAndTimeDataAction(address.suburb, 'Venue', 'suburb');
            this.props.updateVenuAndTimeDataAction(address.postcode, 'Venue', 'postalCode');
            this.props.updateVenuAndTimeDataAction(address.lat, 'Venue', 'lat');
            this.props.updateVenuAndTimeDataAction(address.lng, 'Venue', 'lng');
        }
    };

    onChangeLinkToAffiliate = (affiliateData) => {
        this.props.updateVenuAndTimeDataAction(affiliateData, 'organisations', 'organisations')
    }

    contentView = () => {
        const { venuData } = this.props.venueTimeState
        const { stateList } = this.props.commonReducerState
        const { affiliateList } = this.props.userState
        return (
            <div className="content-view">
                <span className="form-heading">
                    {AppConstants.venue}
                </span>
                <Form.Item
                    className="formLineHeight"
                    name="name"
                    rules={[{ required: true, message: ValidationConstants.nameField[2] }]}
                >
                    <InputWithHead
                        auto_complete="off"
                        required="required-field"
                        heading={AppConstants.name}
                        placeholder={AppConstants.name}
                        onChange={(e) => this.props.updateVenuAndTimeDataAction(captializedString(e.target.value), 'Venue', 'name')}
                        value={venuData.name}
                        onBlur={(e) => this.formRef.current.setFieldsValue({
                            'name': captializedString(e.target.value)
                        })}
                    />
                </Form.Item>
                <Form.Item
                    className="formLineHeight"
                    name="shortName"
                    rules={[{ required: true, message: ValidationConstants.nameField[3] }]}
                >
                    <InputWithHead
                        auto_complete="new-shortName"
                        required="required-field"
                        heading={AppConstants.short_Name}
                        disabled={this.state.isUsed}
                        placeholder={AppConstants.short_Name}
                        maxLength={4}
                        onChange={(e) => this.props.updateVenuAndTimeDataAction(captializedString(e.target.value), 'Venue', 'shortName')}
                        value={venuData.shortName}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            'shortName': captializedString(i.target.value)
                        })}
                    />
                </Form.Item>
                <Form.Item className="formLineHeight" name="venueAddress">
                    <PlacesAutocomplete
                        heading={AppConstants.venueSearch}
                        required
                        error={this.state.venueAddressError}
                        onSetData={this.handlePlacesAutocomplete}
                    />
                </Form.Item>

                <Form.Item className="formLineHeight" name="addressOne">
                    <InputWithHead
                        auto_complete="new-addressOne"
                        required="required-field"
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        value={venuData.street1}
                        readOnly
                    />
                </Form.Item>

                <Form.Item className="formLineHeight" name="addressTwo">
                    <InputWithHead
                        auto_complete="new-addressTwo"
                        heading={AppConstants.addressTwo}
                        placeholder={AppConstants.addressTwo}
                        onChange={(street2) => this.props.updateVenuAndTimeDataAction(street2.target.value, 'Venue', 'street2')}
                        value={venuData.street2}
                    />
                </Form.Item>

                <Form.Item className="formLineHeight" name="suburb">
                    <InputWithHead
                        auto_complete="new-suburb"
                        required="required-field"
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        value={venuData.suburb}
                        readOnly
                    />
                </Form.Item>

                <Form.Item className="formLineHeight" name="stateRefId">
                    <InputWithHead required="required-field" heading={AppConstants.stateHeading} />
                    <Select
                        style={{ width: '100%' }}
                        placeholder={AppConstants.select}
                        value={venuData.stateRefId}
                        disabled
                    >
                        {stateList.map((item) => (
                            <Option key={'state_' + item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item className="formLineHeight" name="postcode">
                    <InputWithHead
                        auto_complete="new-postcode"
                        required="required-field"
                        heading={AppConstants.postcode}
                        placeholder={AppConstants.postcode}
                        value={venuData.postalCode}
                        maxLength={4}
                        readOnly
                    />
                </Form.Item>

                <Form.Item className="formLineHeight" name="contact">
                    <InputWithHead
                        auto_complete="new-contact"
                        heading={AppConstants.contactNumber}
                        placeholder={AppConstants.contactNumber}
                        onChange={(contactNumber) => this.props.updateVenuAndTimeDataAction(contactNumber.target.value, 'Venue', 'contactNumber')}
                        value={venuData.contactNumber}
                    />
                </Form.Item>

                <div className="fluid-width" style={{ marginTop: 25 }}>
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox
                                className="single-checkbox"
                                defaultChecked={false}
                                onChange={e => this.props.updateVenuAndTimeDataAction(e.target.checked, 'Venue', 'affiliate')}
                            >
                                {AppConstants.linkToHomeAffiliate}
                            </Checkbox>
                        </div>
                        {venuData.affiliate && (
                            <div className="col-sm">
                                <Select
                                    mode="multiple"
                                    showSearch
                                    style={{ width: '100%' }}
                                    onChange={(affiliateData) => this.onChangeLinkToAffiliate(affiliateData)}
                                    placeholder="Select"
                                    optionFilterProp="children"
                                >
                                    {affiliateList.map((item) => (
                                        <Option key={'affiliate_' + item.id} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    onTimeChange = (time, index, field) => {
        if (time !== null && time !== undefined) {
            this.onChangeGameTimePicker(time, time.format("HH:mm"), index, field, 'gameTimeslot');
        }
    };

    gameData(item, index) {
        const { daysList } = this.props.commonReducerState
        return (
            <div className="row" key={"gameDay" + index}>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.dayOfTheWeek} />
                    <Select
                        // className="year-select"
                        style={{ width: '100%' }}
                        onChange={(dayOfTheWeek) => this.props.updateVenuAndTimeDataAction(dayOfTheWeek, index, 'dayRefId', 'gameTimeslot')}
                        value={item.dayRefId}
                        placeholder="Select Week Day"
                    >
                        {daysList.map((item) => (
                            <Option key={'day_' + item.id} value={item.id}>{item.description}</Option>
                        ))}
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.startTime} />
                    <TimePicker
                        key="startTime"
                        className="comp-venue-time-timepicker"
                        style={{ width: '100%' }}
                        onChange={(time) => this.onTimeChange(time, index, 'startTime')}
                        onBlur={(e) => this.onTimeChange(e.target.value && moment(e.target.value, "HH:mm"), index, 'startTime')}
                        value={moment(item.startTime, "HH:mm")}
                        format="HH:mm"
                        // minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.endTime} />
                    <TimePicker
                        key="endTime"
                        disabledHours={() => this.getDisabledHours(item.startTime)}
                        disabledMinutes={(e) => this.getDisabledMinutes(e, item.startTime)}
                        className="comp-venue-time-timepicker"
                        style={{ width: '100%' }}
                        onChange={(time) => this.onTimeChange(time, index, 'endTime')}
                        onBlur={(e) => this.onTimeChange(e.target.value && moment(e.target.value, "HH:mm"), index, 'endTime')}
                        value={moment(item.endTime, "HH:mm")}
                        format="HH:mm"
                        // minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.removeObjectAction(index, item, 'gameTimeslot')}>
                    <span className="user-remove-btn">
                        <i className="fa fa-trash-o" aria-hidden="true" />
                    </span>
                    <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                </div>
            </div>
        )
    }

    handleMouseIn() {
        this.setState({ hover: true })
    }

    handleMouseOut() {
        this.setState({ hover: false })
    }

    ///game day view
    gameDayView = () => {
        const { gameDays } = this.props.venueTimeState.venuData
        return (
            <div className="fees-view pt-5">
                <div className="d-flex flex-row align-items-center">
                    <span className="form-heading">
                        {AppConstants.game_Days}
                        <span className="required-field" style={{ fontSize: "14px" }} />
                    </span>

                    <div style={{ marginTop: -25 }}>
                        <Tooltip>
                            {AppConstants.gameDayMsg}
                        </Tooltip>
                    </div>

                </div>

                <div className="fluid-width">
                    {/* {this.gameData()} */}
                    {gameDays.map((item, index) => {
                        return this.gameData(item, index)
                    })}
                </div>
                <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'gameDays')} className="input-heading-add-another">
                    + {AppConstants.addDay}
                </span>
            </div>
        );
    };

    onAddTimeChange = (time, index, tableIndex, field) => {
        if (time !== null && time !== undefined) {
            this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, field, 'addTimeSlotField', tableIndex);
        }
    };

    expendedRowData(item, index, tableIndex) {
        const { daysList } = this.props.commonReducerState
        return (
            <div className="row" key={"available" + index}>
                <div className="col-sm">
                    <InputWithHead required="pt-1" heading={AppConstants.dayOfTheWeek} />
                    <Select
                        style={{ width: '100%' }}
                        onChange={(dayOfTheWeek) => this.props.updateVenuAndTimeDataAction(dayOfTheWeek, index, 'dayRefId', 'addTimeSlotField', tableIndex)}
                        value={item.dayRefId}
                        placeholder="Select Week Day"
                    >
                        {daysList.map((item) => (
                            <Option key={'day_' + item.id} value={item.id}>{item.description}</Option>
                        ))}
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-1" heading={AppConstants.startTime} />
                    <TimePicker
                        className="comp-venue-time-timepicker"
                        style={{ width: '100%' }}
                        onChange={(time) => this.onAddTimeChange(time, index, tableIndex, 'startTime')}
                        onBlur={(e) => this.onAddTimeChange(e.target.value && moment(e.target.value, "HH:mm"), index, tableIndex, 'startTime')}
                        value={moment(item.startTime, "HH:mm")}
                        format="HH:mm"
                        // minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-1" heading={AppConstants.endTime} />
                    <TimePicker
                        className="comp-venue-time-timepicker"
                        style={{ width: '100%' }}
                        disabledHours={() => this.getDisabledHours(item.startTime)}
                        disabledMinutes={(e) => this.getDisabledMinutes(e, item.startTime)}
                        onChange={(time) => this.onAddTimeChange(time, index, tableIndex, 'startTime')}
                        onBlur={(e) => this.onAddTimeChange(e.target.value && moment(e.target.value, "HH:mm"), index, tableIndex, 'endTime')}
                        value={moment(item.endTime, "HH:mm")}
                        format="HH:mm"
                        // minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.updateVenuAndTimeDataAction(null, index, 'removeButton', 'add_TimeSlot', tableIndex)}>
                    <span className="user-remove-btn">
                        <i className="fa fa-trash-o" aria-hidden="true" />
                    </span>
                    <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                </div>
            </div>
        )
    }

    expandedRowView = (item, tableIndex) => {
        return (
            <div className="comp-expanded-row-view inside-container-view mt-2">
                {item.availabilities.map((item, index) => {
                    return this.expendedRowData(item, index, tableIndex)
                })}
                {/* {this.gameData(item, index)} */}
                <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, tableIndex, 'availabilities', 'add_TimeSlot')} className="input-heading-add-another pt-3">
                    + {AppConstants.add_TimeSlot}
                </span>
            </div>
        )
    }

    addCourt = () => {
        this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'venueCourts')
        setTimeout(() => {
            this.setFormFieldValue();
        }, 300);
    }

    //////court day view
    courtView = () => {
        let venueCourts = [...this.props.venueTimeState.venuData.venueCourts];
        return (
            <div className="fees-view pt-5">
                <div className="d-flex">
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        <span className="form-heading">
                            {AppConstants.courts} <span className="required-field" style={{ fontSize: "14px", paddingTop: '5px' }} />
                        </span>
                        <div className="mt-n20">
                            <Tooltip>
                                {AppConstants.courtsMsg}
                            </Tooltip>
                        </div>
                    </div>
                    <Button className="primary-add-comp-form ml-auto" type="primary">
                        <div className="row">
                            <div className="col-sm">
                                <label htmlFor="venueCourtUpload" className="csv-reader">
                                    <img src={AppImages.import} alt="" className="export-image" />
                                    {AppConstants.import}
                                </label>
                                <CSVReader
                                    inputId="venueCourtUpload"
                                    inputStyle={{ display: 'none' }}
                                    parserOptions={papaparseOptions}
                                    onFileLoaded={(e) => this.readVenueCourtCSV(e)}
                                />
                            </div>
                        </div>
                    </Button>
                </div>

                <div className="inside-container-view">
                    <div className="contextual-table-responsive content-responsive">
                        <Table
                            className="fees-table"
                            columns={this.state.courtColumns}
                            dataSource={[...venueCourts]}
                            pagination={false}
                            Divider=" false"
                            expandedRowKeys={JSON.stringify(this.props.venueTimeState.venuData.expandedRowKeys)}
                            // expandedRowRender={(record, index) => this.expandedRowView(record, index)}
                            expandable={{
                                expandedRowRender: (record, index) => this.expandedRowView(record, index),
                                rowExpandable: (record) => record.overideSlot,
                            }}
                            expandIconAsCell={false}
                            expandIconColumnIndex={-1}
                            loading={this.state.loading && true}
                        />
                    </div>
                    <span style={{ cursor: 'pointer' }} onClick={() => this.addCourt()} className="input-heading-add-another">
                        + {AppConstants.addCourt}
                    </span>
                </div>
            </div>
        );
    };

    onAddVenue = (e) => {
        let hasError = false;

        if (this.props.commonReducerState.venueAddressDuplication) {
            message.error(ValidationConstants.duplicatedVenueAddressError);
            return;
        }

        if (this.state.venueAddressError) {
            message.error(this.state.venueAddressError);
            return;
        }

        const { venuData } = this.props.venueTimeState
        message.config({
            duration: 3.5,
            maxCount: 1,
        });
        if (venuData.venueCourts.length === 0) {
            message.error(ValidationConstants.emptyAddCourtValidation);
        }
        if (venuData.gameDays.length === 0) {
            message.error(ValidationConstants.emptyGameDaysValidation);
        } else {
            if (venuData.venueCourts.length === 0) {
                message.error(ValidationConstants.emptyAddCourtValidation);
                return;
            }

            venuData.venueCourts.map((item, index) => {
                (item.availabilities || []).map((avItem, avIndex) => {
                    if (avItem.startTime > avItem.endTime) {
                        hasError = true;
                    }
                })
            });

            if (hasError) {
                message.error(ValidationConstants.venueCourtEndTimeValidation);
                return;
            }

            venuData.gameDays.map((item, index) => {
                if (item.startTime > item.endTime) {
                    hasError = true;
                    // break;
                }
            });

            if (hasError) {
                message.error(ValidationConstants.gameDayEndTimeValidation);
                return;
            }

            if (!hasError) {
                venuData["screenNavigationKey"] = this.state.screenNavigationKey;
                this.props.addVenueAction(venuData);
                this.setState({ saveContraintLoad: true });
            }
        }
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="d-flex justify-content-end">
                                {/* <Button onClick={() => this.props.addVenueAction(venuData)} className="open-reg-button" type="primary"> */}
                                <Button
                                    className="publish-button"
                                    type="primary"
                                    style={{ marginRight: '20px' }}
                                    onClick={() => this.navigateTo()}
                                >
                                    {AppConstants.cancel}
                                </Button>
                                <Button className="publish-button" type="primary" htmlType="submit">
                                    {AppConstants.save}
                                </Button>
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
                <Loader visible={this.props.commonReducerState.onLoad || this.props.venueTimeState.onLoad} />

                <DashboardLayout
                    menuHeading={this.state.screenHeader}
                    menuName={this.state.screenHeader}
                />

                {/* <InnerHorizontalMenu menu="competition" compSelectedKey="7" /> */}

                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onAddVenue}
                        onFinishFailed={(err) => {
                            this.formRef.current.scrollToField(err.errorFields[0].name);
                        }}
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView">{this.contentView()}</div>
                            <div className="formView">{this.gameDayView()}</div>
                            <div className="formView">{this.courtView()}</div>
                        </Content>

                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateVenuAndTimeDataAction,
        getYearAndCompetitionAction,
        updateVenuListAction,
        getCommonRefData,
        addVenueAction,
        refreshVenueFieldsAction,
        getAffiliatesListingAction,
        removeObjectAction,
        clearVenueDataAction,
        checkVenueDuplication,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        venueTimeState: state.VenueTimeState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
        userState: state.UserState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionVenueAndTimesAdd);
