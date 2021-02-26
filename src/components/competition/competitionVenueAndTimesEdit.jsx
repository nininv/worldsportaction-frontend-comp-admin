import React, { Component } from "react";
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
    Form, Modal
} from "antd";
// import CSVReader from 'react-csv-reader';
import moment from "moment";

import "./competition.css";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import {
    updateVenuAndTimeDataAction, updateVenuListAction, refreshVenueFieldsAction,
    removeObjectAction, venueByIdAction, clearVenueDataAction
} from '../../store/actions/competitionModuleAction/venueTimeAction'
import { getYearAndCompetitionAction } from '../../store/actions/appAction'
import { getCommonRefData, addVenueAction, checkVenueDuplication } from '../../store/actions/commonAction/commonAction'
import { getAffiliatesListingAction } from "../../store/actions/userAction/userAction";
import history from '../../util/history'
import ValidationConstants from "../../themes/validationConstant";
import AppImages from "../../themes/appImages";
import Loader from '../../customComponents/loader';
import PlacesAutocomplete from "./elements/PlaceAutoComplete";
import { getOrganisationData } from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
// let this_Obj = null;

// const papaparseOptions = {
//     header: true,
//     dynamicTyping: true,
//     skipEmptyLines: true,
//     transformHeader: header =>
//         header
//             .toLowerCase()
//             .replace(/\W/g, '_'),
//     complete: function (results, file) {
//         // console.log("Parsing complete:", results, file);
//     }
// }

class CompetitionVenueAndTimesEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // initialData: null,
            getDataLoading: false,
            venueId: 0,
            saveContraintLoad: false,
            firstTimeCompId: null,
            yearRefId: 1,
            screenNavigationKey: null,
            venueOrganisation: [],
            csvData: null,
            loading: false,
            isUsed: false,
            venueAddress: null,
            venueAddressError: '',
            isCreator: null,
            fieldConfigurationRefIdIndex: null,
            venueConfigurationModalIsOpened: false,
            courtColumns: [
                {
                    title: "Court Number",
                    dataIndex: "courtNumber",
                    key: "courtNumber",
                    render: (courtNumber, record, index) => {
                        return (
                            <div className="text-center">
                                {courtNumber}
                            </div>
                        )
                    }
                },
                {
                    title: "Court Name",
                    dataIndex: "venueCourtName",
                    key: "venueCourtName",
                    render: (courtName, record, index) => {
                        return (
                            <Form.Item
                                name={`venueCourtName${index}`}
                                rules={[{ required: true, message: ValidationConstants.courtField[3] }]}
                            >
                                <Input
                                    // disabled={record.isDisabled}
                                    required="required-field pt-0 pb-0"
                                    className="input-inside-table-fees"
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
                    render: (lng, record, index) => {
                        return (
                            <Form.Item
                                name={`lng${index}`}
                                rules={[{ required: true, message: ValidationConstants.courtField[2] }]}
                            >
                                <Input
                                    className="input-inside-table-venue-court"
                                    // disabled={record.isDisabled}
                                    onChange={(lng) => this.props.updateVenuAndTimeDataAction(lng.target.value, index, 'lng', 'courtData')}
                                    value={lng}
                                    placeholder="Longitude"
                                />
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Latitude",
                    dataIndex: "lat",
                    key: "lat",
                    render: (lat, record, index) => {
                        return (
                            <Form.Item
                                name={`lat${index}`}
                                rules={[{ required: true, message: ValidationConstants.courtField[1] }]}
                            >
                                <Input
                                    className="input-inside-table-venue-court"
                                    // disabled={record.isDisabled}
                                    onChange={(lat) => this.props.updateVenuAndTimeDataAction(lat.target.value, index, 'lat', 'courtData')}
                                    value={lat}
                                    placeholder="Latitude"
                                />
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Override Venue Timeslots?",
                    dataIndex: "overideSlot",
                    key: "overideSlot",
                    width: 200,
                    render: (overideSlot, record, index) => (
                        <div>
                            <Checkbox
                                // disabled={this.state.isUsed}
                                className="single-checkbox mt-1 d-flex justify-content-center"
                                defaultChecked={overideSlot}
                                onChange={e => this.overideVenueslotOnchange(e, index)}
                            />
                        </div>
                    )
                },
                {
                    title: "",
                    dataIndex: "fieldConfigurationRefId",
                    key: "fieldConfigurationRefId",
                    width: process.env.REACT_APP_VENUE_CONFIGURATION_ENABLED ? 200 : 0,
                    render: (fieldConfigurationRefId, record, index) => (
                        process.env.REACT_APP_VENUE_CONFIGURATION_ENABLED ?
                            <div>
                                <img
                                    className="venue-configuration-image"
                                    src={this.state.venueConfigurationImages[fieldConfigurationRefId-1]}
                                    alt=""
                                    height={80}
                                />
                                <img
                                    className="venue-configuration-control"
                                    src={AppImages.chevronRight}
                                    alt=""
                                    height={25}
                                    onClick={() => {
                                        this.setState({venueConfigurationModalIsOpened: true, fieldConfigurationRefIdIndex: index})
                                    }}
                                />
                            </div>
                            :
                            <></>
                    )
                },
                {
                    title: "",
                    dataIndex: "clear",
                    key: "clear",
                    render: (clear, record, index) => (
                        <span className="w-100 d-flex justify-content-center" style={{ cursor: 'pointer' }}>
                            {/* {!record.isDisabled && ( */}
                            <img
                                className="dot-image"
                                src={AppImages.redCross}
                                alt=""
                                width="16"
                                height="16"
                                onClick={() => this.removeTableObj(clear, record, index)}
                            />
                            {/* )} */}
                        </span>
                    )
                }
            ],
            manualAddress: false,
            venueConfigurationImages: [
                AppImages.venueConfiguration1,
                AppImages.venueConfiguration2,
                AppImages.venueConfiguration3,
                AppImages.venueConfiguration4,
                AppImages.venueConfiguration5,
                AppImages.venueConfiguration6,
                AppImages.venueConfiguration7,
                AppImages.venueConfiguration8,
            ],

        };
        // this_Obj = this;
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
            this.setVenuCourtFormFields()
        }, 300);
    }

    overideVenueslotOnchange(e, index) {
        this.props.updateVenuAndTimeDataAction(e.target.checked, index, 'overideSlot')
    }

    componentWillMount() {
        // this.setState({initialData: this.props.venueTimeState.venuData});
    }

    componentDidMount() {
        window.scroll(0, 0);
        let venueId = this.props.location.state.venueId;
        let isUsed = this.props.location.state.isUsed;
        let isCreator = this.props.location.state.isCreator;
        this.props.updateVenuAndTimeDataAction(isUsed, 'venueIsUsed', "venueIsUsed")
        this.setState({
            screenNavigationKey: this.props.location.state.key,
            venueId,
            isUsed,
            isCreator,
        })
        let payload = {
            venueId: venueId
        }
        this.props.venueByIdAction(payload);
        this.setState({ getDataLoading: true });
        this.props.checkVenueDuplication();
    }

    componentDidUpdate(nextProps) {
        // let competitionList = this.props.appState.competitionList
        if (this.state.saveContraintLoad && this.props.venueTimeState.onLoad == false) {
            this.navigateTo();
        }

        if (nextProps.venueTimeState !== this.props.venueTimeState) {
            if (this.props.venueTimeState.venueEditOnLoad === false && this.state.getDataLoading) {
                this.setState({
                    getDataLoading: false
                });
                this.setFormFieldValue();

                let venueData = this.props.venueTimeState.venuData;
                this.setState({
                    venueAddress: {
                        addressOne: venueData.street1,
                        suburb: venueData.suburb,
                        stateRefId: venueData.stateRefId,
                        fieldConfigurationRefId: venueData.fieldConfigurationRefId,
                        postcode: venueData.postalCode,
                        lat: venueData.lat,
                        lng: venueData.lng,
                    }
                });

                this.setVenueOrganisation();
            }

            if (this.state.csvData != null) {
                this.setState({ csvData: null, loading: false });
                this.setFormFieldValue();
            }
        }

        if (nextProps.userState != this.props.userState) {
            if (this.props.userState.onLoad == false) {
                this.setVenueOrganisation();
            }
        }
    }

    setFormFieldValue = () => {
        let venueData = this.props.venueTimeState.venuData;

        this.formRef.current.setFieldsValue({
            name: venueData.venueName,
            shortName: venueData.shortName,
            addressOne: venueData.street1,
            suburb: venueData.suburb,
            stateRefId: venueData.stateRefId,
            fieldConfigurationRefId: venueData.fieldConfigurationRefId,
            postcode: venueData.postalCode
        });
        this.setVenuCourtFormFields();
    };

    setVenuCourtFormFields = () => {
        let venueData = this.props.venueTimeState.venuData;
        venueData.venueCourts.forEach((item, index) => {
            this.formRef.current.setFieldsValue({
                [`venueCourtName${index}`]: item.venueCourtName,
                [`lat${index}`]: item.lat,
                [`lng${index}`]: item.lng,
            });
            // (item.availabilities || []).map((av, avIndex) => {
            //     this.formRef.current.setFieldsValue({
            //         [`startTime${index}${avIndex}`]:  moment(av.startTime, "HH:mm"),
            //         [`endTime${index}${avIndex}`]:  moment(av.endTime, "HH:mm"),
            //     });
            // })
        });
    }

    setVenueOrganisation = () => {
        // let venueData = this.props.venueTimeState.venuData;
        // let isVenueMapped = venueData.isVenueMapped;
        // let affiliateData = venueData.affiliateData;
        const { affiliateList, impersonationList = [] } = this.props.userState;
        const venueOrganisation = affiliateList.length ? affiliateList : impersonationList;
        const organisationId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;

        if (venueOrganisation != null && venueOrganisation.length > 0) {
            venueOrganisation.forEach((item) => {
                // let affiliate = affiliateData.find(x=>x == item.id);
                // if (affiliate != null && affiliate != undefined) {
                //     item["isDisabled"] = isVenueMapped;
                // } else {
                //     item["isDisabled"] = false;
                // }
                // item["isDisabled"] = this.state.isUsed;
                item["isDisabled"] = item.isChild == "0" && item.organisationUniqueKey !== organisationId;
            });
            this.setState({ venueOrganisation: venueOrganisation });
        }
    }

    navigateTo = () => {
        if (this.state.screenNavigationKey == AppConstants.venuesList) {
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

    readVenueCourtCSV = (data) => {
        this.setState({ csvData: data, loading: true });
        this.props.updateVenuAndTimeDataAction(data, "addGameAndCourtThroughCSV", 'venueCourts');
        let e = document.getElementById("venueCourtUpload");
        e.value = null;
    };

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
        if (type === "end") {
            if (startTime > endTime) {
                callback('End time should be greater than start time');
                return;
            }
        }
        callback();
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
        const { venuData } = this.props.venueTimeState
        const address = data;

        this.props.checkVenueDuplication({
            ...address,
            venueId: venuData?.venueId,
        });

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
            this.props.updateVenuAndTimeDataAction(venuData.fieldConfigurationRefId, 'Venue', 'fieldConfigurationRefId');
            this.props.updateVenuAndTimeDataAction(address.addressOne, 'Venue', 'street1');
            this.props.updateVenuAndTimeDataAction(address.suburb, 'Venue', 'suburb');
            this.props.updateVenuAndTimeDataAction(address.postcode, 'Venue', 'postalCode');
            this.props.updateVenuAndTimeDataAction(address.lat, 'Venue', 'lat');
            this.props.updateVenuAndTimeDataAction(address.lng, 'Venue', 'lng');
        }
    };

    enabledContentView = () => {
        const { venuData } = this.props.venueTimeState
        const { stateList } = this.props.commonReducerState
        // const { venueOrganisation } = this.props.userState

        const state = stateList.length > 0 && venuData.stateRefId
            ? stateList.find((state) => state.id === venuData.stateRefId).name
            : null;

        let defaultVenueAddress = `${venuData.street1 ? `${venuData.street1},` : ''
            } ${venuData.suburb ? `${venuData.suburb},` : ''
            } ${state ? `${state},` : ''
            } Australia`;

        return (
            <div className="content-view">
                <span className="form-heading">
                    {AppConstants.venue}
                </span>
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: ValidationConstants.nameField[2] }]}
                >
                    <InputWithHead
                        auto_complete="new-name"
                        required="required-field"
                        heading={AppConstants.name}
                        disabled={this.state.isUsed || !this.state.isCreator}
                        placeholder={AppConstants.name}
                        onChange={(name) => this.props.updateVenuAndTimeDataAction(name.target.value, 'Venue', 'name')}
                        value={venuData.name}
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
                        disabled={this.state.isUsed || !this.state.isCreator}
                        placeholder={AppConstants.short_Name}
                        onChange={(name) => this.props.updateVenuAndTimeDataAction(name.target.value, 'Venue', 'shortName')}
                        value={venuData.shortName}
                    />
                </Form.Item>

                {
                    !this.state.manualAddress &&
                    <Form.Item name="venueAddress">
                        <PlacesAutocomplete
                            defaultValue={defaultVenueAddress}
                            heading={AppConstants.venueSearch}
                            required
                            error={this.state.venueAddressError}
                            onSetData={this.handlePlacesAutocomplete}
                        />
                    </Form.Item>

                }

                <div
                    className="orange-action-txt" style={{ marginTop: "10px" }}
                    onClick={() => this.setState({ manualAddress: !this.state.manualAddress })}

                >{this.state.manualAddress ? AppConstants.returnAddressSearch : AppConstants.enterAddressManually}
                </div>


                {
                    this.state.manualAddress &&
                    <Form.Item name="addressOne">
                        <InputWithHead
                            auto_complete="new-addressOne"
                            required="required-field"
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            onChange={(street1) => this.props.updateVenuAndTimeDataAction(street1.target.value, 'Venue', 'street1')}
                            value={venuData.street1}
                        />
                    </Form.Item>
                }

                {
                    this.state.manualAddress &&
                    <InputWithHead
                        auto_complete="new-addressTwo"
                        heading={AppConstants.addressTwo}
                        placeholder={AppConstants.addressTwo}
                        onChange={(street2) => this.props.updateVenuAndTimeDataAction(street2.target.value, 'Venue', 'street2')}
                        value={venuData.street2}
                    />
                }


                {
                    this.state.manualAddress &&
                    <Form.Item name="suburb">
                        <InputWithHead
                            auto_complete="new-suburb"
                            required="required-field"
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            onChange={(suburb) => this.props.updateVenuAndTimeDataAction(suburb.target.value, 'Venue', 'suburb')}
                            value={venuData.suburb}
                        />
                    </Form.Item>
                }

                {
                    this.state.manualAddress &&
                    <InputWithHead
                        required="required-field"
                        heading={AppConstants.stateHeading}
                    />
                }

                {
                    this.state.manualAddress &&
                    <Form.Item name="stateRefId">
                        <Select
                            className="w-100"
                            placeholder={AppConstants.select}
                            onChange={(stateRefId) => this.props.updateVenuAndTimeDataAction(stateRefId, 'Venue', 'stateRefId')}
                            value={venuData.stateRefId}
                        >
                            {stateList.map((item) => (
                                <Option key={'state_' + item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                }


                {
                    this.state.manualAddress &&
                    <Form.Item name="postcode">
                        <InputWithHead
                            auto_complete="new-postcode"
                            required="required-field"
                            heading={AppConstants.postcode}
                            placeholder={AppConstants.postcode}
                            onChange={(postalCode) => this.props.updateVenuAndTimeDataAction(postalCode.target.value, 'Venue', 'postalCode')}
                            value={venuData.postalCode}
                            maxLength={4}
                        />
                    </Form.Item>
                }

                <InputWithHead
                    auto_complete="new-contactNumber"
                    heading={AppConstants.contactNumber}
                    placeholder={AppConstants.contactNumber}
                    onChange={(contactNumber) => this.props.updateVenuAndTimeDataAction(contactNumber.target.value, 'Venue', 'contactNumber')}
                    value={venuData.contactNumber}
                />

                <div className="fluid-width" style={{ marginTop: 25 }}>
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox
                                // disabled={this.state.isUsed}
                                className="single-checkbox"
                                checked={venuData.affiliate}
                                onChange={e => this.props.updateVenuAndTimeDataAction(e.target.checked, 'Venue', 'affiliate')}
                            >
                                {AppConstants.linkToHomeAffiliate}
                            </Checkbox>
                        </div>
                        {venuData.affiliate && (
                            <div className="col-sm">
                                <Select
                                    // disabled={this.state.isUsed}
                                    mode="multiple"
                                    className="w-100"
                                    value={venuData.affiliateData}
                                    onChange={(affiliateData) => this.props.updateVenuAndTimeDataAction(affiliateData, 'editOrganisations', "editOrganisations")}
                                    placeholder="Select"
                                >
                                    {this.state.venueOrganisation.map((item) => (
                                        <Option
                                            key={'venueOrganisation_' + item.id}
                                            value={item.id}
                                            disabled={item.isDisabled}
                                        >
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    diabledContentView = () => {
        const { venuData } = this.props.venueTimeState
        const { stateList } = this.props.commonReducerState
        // const { venueOrganisation } = this.props.userState

        const state = stateList.length > 0 && venuData.stateRefId
            ? stateList.find((state) => state.id === venuData.stateRefId).name
            : null;

        let defaultVenueAddress = `${venuData.street1 ? `${venuData.street1},` : ''
            } ${venuData.suburb ? `${venuData.suburb},` : ''
            } ${state ? `${state},` : ''
            } Australia`;

        return (
            <div className="content-view">
                <span className="form-heading">
                    {AppConstants.venue}
                </span>
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: ValidationConstants.nameField[2] }]}
                >
                    <InputWithHead
                        auto_complete="new-name"
                        required="required-field"
                        heading={AppConstants.name}
                        disabled={this.state.isUsed || !this.state.isCreator}
                        placeholder={AppConstants.name}
                        onChange={(name) => this.props.updateVenuAndTimeDataAction(name.target.value, 'Venue', 'name')}
                        value={venuData.name}
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
                        disabled={this.state.isUsed || !this.state.isCreator}
                        placeholder={AppConstants.short_Name}
                        onChange={(name) => this.props.updateVenuAndTimeDataAction(name.target.value, 'Venue', 'shortName')}
                        value={venuData.shortName}
                    />
                </Form.Item>


                <InputWithHead
                    value={defaultVenueAddress}
                    placeholder={AppConstants.short_Name}
                    heading={AppConstants.venueSearch}
                    required="required-field"
                    disabled={true}
                />


                <Form.Item name="addressOne">
                    <InputWithHead
                        auto_complete="new-addressOne"
                        required="required-field"
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        onChange={(street1) => this.props.updateVenuAndTimeDataAction(street1.target.value, 'Venue', 'street1')}
                        value={venuData.street1}
                        disabled={this.state.isUsed || !this.state.isCreator}
                    />
                </Form.Item>

                <InputWithHead
                    auto_complete="new-addressTwo"
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(street2) => this.props.updateVenuAndTimeDataAction(street2.target.value, 'Venue', 'street2')}
                    value={venuData.street2}
                    disabled={this.state.isUsed || !this.state.isCreator}
                />

                <Form.Item name="suburb">
                    <InputWithHead
                        auto_complete="new-suburb"
                        required="required-field"
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        onChange={(suburb) => this.props.updateVenuAndTimeDataAction(suburb.target.value, 'Venue', 'suburb')}
                        value={venuData.suburb}
                        disabled={this.state.isUsed || !this.state.isCreator}
                    />
                </Form.Item>

                <InputWithHead
                    required="required-field"
                    heading={AppConstants.stateHeading}
                />

                <Form.Item name="stateRefId">
                    <Select
                        className="w-100"
                        placeholder={AppConstants.select}
                        onChange={(stateRefId) => this.props.updateVenuAndTimeDataAction(stateRefId, 'Venue', 'stateRefId')}
                        value={venuData.stateRefId}
                        disabled={this.state.isUsed || !this.state.isCreator}
                    >
                        {stateList.map((item) => (
                            <Option key={'state_' + item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="postcode">
                    <InputWithHead
                        auto_complete="new-postcode"
                        required="required-field"
                        heading={AppConstants.postcode}
                        placeholder={AppConstants.postcode}
                        onChange={(postalCode) => this.props.updateVenuAndTimeDataAction(postalCode.target.value, 'Venue', 'postalCode')}
                        value={venuData.postalCode}
                        maxLength={4}
                        disabled={this.state.isUsed || !this.state.isCreator}
                    />
                </Form.Item>

                <InputWithHead
                    auto_complete="new-contactNumber"
                    heading={AppConstants.contactNumber}
                    placeholder={AppConstants.contactNumber}
                    onChange={(contactNumber) => this.props.updateVenuAndTimeDataAction(contactNumber.target.value, 'Venue', 'contactNumber')}
                    value={venuData.contactNumber}
                    disabled={this.state.isUsed || !this.state.isCreator}
                />

                <div className="fluid-width" style={{ marginTop: 25 }}>
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox
                                // disabled={this.state.isUsed}
                                className="single-checkbox"
                                checked={venuData.affiliate}
                                onChange={e => this.props.updateVenuAndTimeDataAction(e.target.checked, 'Venue', 'affiliate')}
                            >
                                {AppConstants.linkToHomeAffiliate}
                            </Checkbox>
                        </div>
                        {venuData.affiliate && (
                            <div className="col-sm">
                                <Select
                                    // disabled={this.state.isUsed}
                                    mode="multiple"
                                    className="w-100"
                                    value={venuData.affiliateData}
                                    onChange={(affiliateData) => this.props.updateVenuAndTimeDataAction(affiliateData, 'editOrganisations', "editOrganisations")}
                                    placeholder="Select"
                                >
                                    {this.state.venueOrganisation.map((item) => (
                                        <Option
                                            key={'venueOrganisation_' + item.id}
                                            value={item.id}
                                            disabled={item.isDisabled}
                                        >
                                            {item.name}
                                        </Option>
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
            this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, field, 'gameTimeslot');
        }
    };

    gameData(item, index) {
        const { daysList } = this.props.commonReducerState
        return (
            <div className="row" key={"gameDay" + index}>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.dayOfTheWeek} />
                    <Select
                        // disabled={item.isDisabled}
                        // className="year-select w-100"
                        className="w-100"
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
                        // disabled={item.isDisabled}
                        key="startTime"
                        className="comp-venue-time-timepicker w-100"
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
                        // disabled={item.isDisabled}
                        key="endTime"
                        disabledHours={() => this.getDisabledHours(item.startTime)}
                        disabledMinutes={(e) => this.getDisabledMinutes(e, item.startTime)}
                        className="comp-venue-time-timepicker w-100"
                        onChange={(time) => this.onTimeChange(time, index, 'endTime')}
                        onBlur={(e) => this.onTimeChange(e.target.value && moment(e.target.value, "HH:mm"), index, 'endTime')}
                        value={moment(item.endTime, "HH:mm")}
                        format="HH:mm"
                        // minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                {/* {!item.isDisabled && ( */}
                <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.removeObjectAction(index, item, 'gameTimeslot')}>
                    <span className="user-remove-btn">
                        <i className="fa fa-trash-o" aria-hidden="true" />
                    </span>
                    <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                </div>
                {/* )} */}
            </div>
        )
    }

    ///game day view
    gameDayView = () => {
        const { gameDays } = this.props.venueTimeState.venuData
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">
                    {AppConstants.game_Days}
                    <span className="required-field" style={{ fontSize: "14px" }} />
                </span>
                <div className="fluid-width">
                    {/* {this.gameData()} */}
                    {(gameDays || []).map((item, index) => {
                        return this.gameData(item, index)
                    })}
                </div>
                {/* {!this.state.isUsed && ( */}
                <span
                    className="input-heading-add-another"
                    onClick={() => this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'gameDays')}
                    style={{ cursor: 'pointer' }}
                >
                    + {AppConstants.addAnotherDay}
                </span>
                {/* )} */}
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
            <div className="row" key={"expandedRow" + index}>
                <div className="col-sm">
                    <InputWithHead required="pt-1" heading={AppConstants.dayOfTheWeek} />
                    <Select
                        disabled={item.isDisabled}
                        className="w-100"
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
                        disabled={item.isDisabled}
                        className="comp-venue-time-timepicker w-100"
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
                        disabled={item.isDisabled}
                        className="comp-venue-time-timepicker w-100"
                        disabledHours={() => this.getDisabledHours(item.startTime)}
                        disabledMinutes={(e) => this.getDisabledMinutes(e, item.startTime)}
                        onChange={(time) => this.onAddTimeChange(time, index, tableIndex, 'endTime')}
                        onBlur={(e) => this.onAddTimeChange(e.target.value && moment(e.target.value, "HH:mm"), index, tableIndex, 'endTime')}
                        value={moment(item.endTime, "HH:mm")}
                        format="HH:mm"
                        // minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                {!item.isDisabled && (
                    <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.updateVenuAndTimeDataAction(null, index, 'removeButton', 'add_TimeSlot', tableIndex)}>
                        <span className="user-remove-btn">
                            <i className="fa fa-trash-o" aria-hidden="true" />
                        </span>
                        <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                    </div>
                )}
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
                {/* {!this.state.isUsed ? */}
                <span
                    className="input-heading-add-another pt-3"
                    onClick={() => this.props.updateVenuAndTimeDataAction(null, tableIndex, 'availabilities', 'add_TimeSlot')}
                    style={{ cursor: 'pointer' }}
                >
                    + {AppConstants.add_TimeSlot}
                </span>
                {/* : null
            } */}
            </div>
        )
    }

    addCourt = () => {
        this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'venueCourts')
        setTimeout(() => {
            this.setVenuCourtFormFields()
        }, 300);
    }

    //////court day view
    courtView = () => {
        let venueTimestate = this.props.venueTimeState;
        let { venueCourts } = venueTimestate.venuData;
        return (
            <div className="fees-view pt-5">
                <div className="d-flex">
                    <span className="form-heading">{AppConstants.courts}
                        <span className="required-field" style={{ fontSize: 14, paddingTop: 5 }} />
                    </span>
                    {/* {!this.state.isUsed && ( */}
                    {/* <Button className="primary-add-comp-form ml-auto" type="primary">
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
                                    onFileLoaded={this.readVenueCourtCSV}
                                />
                            </div>
                        </div>
                    </Button> */}
                    {/* )} */}
                </div>

                <div className="inside-container-view">
                    <div className="table-responsive">
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
                    {/* {!this.state.isUsed ? */}
                    <span
                        className="input-heading-add-another"
                        onClick={() => this.addCourt()}
                        style={{ cursor: 'pointer' }}
                    >
                        + {AppConstants.addCourt}
                    </span>
                    {/* : null
                    } */}
                </div>
            </div>
        );
    };

    onAddVenue = (values) => {
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
        } else if (venuData.gameDays.length === 0) {
            message.error(ValidationConstants.emptyGameDaysValidation);
        } else {
            if (venuData.venueCourts.length === 0) {
                message.error(ValidationConstants.emptyAddCourtValidation);
                return;
            }

            venuData.venueCourts.forEach((item) => {
                (item.availabilities || []).forEach((avItem) => {
                    if (avItem.startTime > avItem.endTime) {
                        hasError = true;
                    }
                })
            });

            if (hasError) {
                message.error(ValidationConstants.venueCourtEndTimeValidation);
                return;
            }

            venuData.gameDays.forEach((item) => {
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
                this.props.addVenueAction(venuData)
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
                                <Button className="publish-button" type="primary" style={{ marginRight: 20 }} onClick={() => this.navigateTo()}>
                                    {AppConstants.cancel}
                                </Button>
                                {/* {!this.state.isUsed ? */}
                                <Button className="publish-button" type="primary" htmlType="submit">
                                    {AppConstants.save}
                                </Button>
                                {/* : null} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ////Show success message after success response
    // success = () => {
    //     this.props.commonReducerState.addVenueSuccessMsg = ""
    //     message.success('Venue - Added Successfully')
    //     this.props.refreshVenueFieldsAction()
    //     history.push('/competitionVenueTimesPrioritisation')
    // };

    onFinishFailed = (errorInfo) => {
        message.config({ maxCount: 1, duration: 1.5 })
        message.error(ValidationConstants.plzReviewPage)
    };

    venueConfigurationModal = () => (
        <Modal
            title="Venue Configuration"
            visible={this.state.venueConfigurationModalIsOpened}
            className="venue-configuration-modal"
            onCancel={() => {this.setState({venueConfigurationModalIsOpened: false})}}
            onOk={() => {this.setState({venueConfigurationModalIsOpened: false})}}
            foter={[]}>
            {
                this.state.venueConfigurationImages.map((item, key) => (
                    <img
                        className={"venue-configuration-image " + ( this.isSelected(key) ? "selected" : "" ) }
                        src={item}
                        key={"venue_configuration_images" + key}
                        alt=""
                        height={150}
                        onClick={() => {
                            this.setState({fieldConfigurationRefId: key, venueConfigurationModalIsOpened: false});
                            this.props.updateVenuAndTimeDataAction(
                                key+1,
                                this.state.fieldConfigurationRefIdIndex,
                                'fieldConfigurationRefId',
                                'courtData',
                            )
                        }}
                    />
                ))
            }
        </Modal>
    )

    isSelected = (id = 0) => {
        return this.state.fieldConfigurationRefId === id;
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                {this.venueConfigurationModal()}
                <DashboardLayout
                    menuHeading={AppConstants.user}
                    menuName={AppConstants.user}
                />
                {/* <InnerHorizontalMenu menu="competition" compSelectedKey="7" /> */}
                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onAddVenue}
                        onFinishFailed={(err) => {
                            this.formRef.current.scrollToField(err.errorFields[0].name)
                            this.onFinishFailed()
                        }}
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView">{(this.state.isUsed || !this.state.isCreator) ? this.diabledContentView() : this.enabledContentView()}</div>
                            <div className="formView">{this.gameDayView()}</div>
                            <div className="formView">{this.courtView()}</div>
                            <Loader
                                visible={
                                    this.props.venueTimeState.onLoad
                                    || this.props.commonReducerState.onLoad
                                }
                            />
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
        venueByIdAction,
        clearVenueDataAction,
        checkVenueDuplication
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

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionVenueAndTimesEdit);
