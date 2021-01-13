import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    Form,
    Checkbox,
    Radio,
    Modal,
} from "antd";

import InputWithHead from "../../customComponents/InputWithHead";
import InputNumberWithHead from "../../customComponents/InputNumberWithHead";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";

import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

import { isArrayNotEmpty } from "../../util/helpers";
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage';

import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import {
    getUmpirePaymentSettings,
    saveUmpirePaymentSettings,
} from '../../store/actions/umpireAction/umpirePaymentSettingAction';
import { liveScoreGetDivision } from "../../store/actions/LiveScoreAction/liveScoreTeamAction";
import { getUmpirePoolData } from "../../store/actions/umpireAction/umpirePoolAllocationAction";
import { getRefBadgeData } from '../../store/actions/appAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const initialPaymentSettingsData = {
    allDivisions: false,
    divisions: [],
    UmpirePaymentFeeType: 'BY_BADGE',
    byBadge: [],
    byPool: [],
    hasSettings: true,
};

const initialNoSettingsData = {
    allDivisions: false,
    divisions: [],
    hasSettings: false,
};

class UmpirePaymentSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            paymentSettingsData: null,
            selectedDivisions: null,
            allCompetition: null,
            allDivisionVisible: false,
            deleteModalVisible: false,
            sectionDataToDeleteIndex: null,
            tempPaymentSettingsData: null,
            tempSelectedDivisions: null,
        };
    }

    componentDidMount() {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        this.setState({ loading: true });
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS');
        this.props.getRefBadgeData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                const compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = !!compList.length && compList[0].id;
                
                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                if (!!compList.length) {
                    const orgId = compList[0].competitionOrganisation.orgId;

                    this.props.liveScoreGetDivision(firstComp);
                    this.props.getUmpirePoolData({ orgId, compId: firstComp })
                }

                const compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, allCompetition: compList })
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            const { selectedComp, allCompetition } = this.state;
            let orgId = null;

            for (let i in allCompetition) {
                if (allCompetition[i].id === selectedComp) {
                    orgId = allCompetition[i].competitionOrganisation.orgId;
                }
            }

            this.props.getUmpirePoolData({ orgId, compId: selectedComp });
        }

        if (this.props.umpirePoolAllocationState.umpirePoolData !== prevProps.umpirePoolAllocationState.umpirePoolData) {
            this.props.getUmpirePaymentSettings(this.state.selectedComp);
        }

        if (this.props.umpirePaymentSettingState !== prevProps.umpirePaymentSettingState && !!this.props.umpirePaymentSettingState.paymentSettingsData
            && !this.props.umpirePaymentSettingState.onLoad) {

            const { paymentSettingsData } = this.props.umpirePaymentSettingState;
            const { divisionList } = this.props.liveScoreTeamState;
            const { umpirePaymentSettings } = this.props.umpirePaymentSettingState.paymentSettingsData;

            const selectedDivisionsOrganiser = !!paymentSettingsData.umpirePaymentSettings.length ? JSON.parse(JSON.stringify(umpirePaymentSettings[0].divisions)) : [];
            const selectedDivisionsAffiliate = !!paymentSettingsData.allowedDivisionsSetting ? JSON.parse(JSON.stringify(paymentSettingsData.allowedDivisionsSetting.divisions)) : [];

            const selectedDivisions = [ ...selectedDivisionsOrganiser, ...selectedDivisionsAffiliate ];

            const umpirePaymentSettingsObj = !!paymentSettingsData.umpirePaymentSettings.length ? 
                paymentSettingsData.umpirePaymentSettings.map(settingsItem => ({
                    allDivisions: settingsItem.allDivisions,
                    // divisions: settingsItem.divisions.map(item => item.id),
                    divisions: settingsItem.divisions,
                    UmpirePaymentFeeType: settingsItem.UmpirePaymentFeeType,
                    byBadge: !!settingsItem.byBadge.length ? 
                            settingsItem.byBadge.map(byBadgeSetting => ({
                                accreditationUmpireRefId: byBadgeSetting.accreditationUmpireRefId,
                                rates: byBadgeSetting.rates.map(rate => ({
                                    roleId: rate.roleId,
                                    rate: rate.rate,
                                }))
                            })) : [],
                    byPool: !!settingsItem.byPool.length ? 
                            settingsItem.byPool.map(byPoolSetting => ({
                                umpirePoolId: byPoolSetting.umpirePoolId,
                                rates: byPoolSetting.rates.map(rate => ({
                                    roleId: rate.roleId,
                                    rate: rate.rate,
                                }))
                            })) : [],
                    hasSettings: true,
                })) : [];

            const allowedDivisionsSettingObj = !!paymentSettingsData.allowedDivisionsSetting ? [{ 
                allDivisions: paymentSettingsData.allowedDivisionsSetting.allDivisions,
                // divisions: paymentSettingsData.allowedDivisionsSetting.divisions.map(item => item.id),
                divisions: paymentSettingsData.allowedDivisionsSetting.divisions,
                hasSettings: false,
            }] : [];
            

            const paymentSettingsDataObj = {
                umpirePayerTypeRefId: paymentSettingsData.umpirePayerTypeRefId,
                settings: [ ...umpirePaymentSettingsObj, ...allowedDivisionsSettingObj ],
            }

            this.setState({ paymentSettingsData: paymentSettingsDataObj, selectedDivisions });

            // console.log('this.props.umpirePaymentSettingState.paymentSettingsData', paymentSettingsDataObj);
        }

        // console.log('this.props.umpirePoolAllocationState.umpirePoolData', this.props.umpirePoolAllocationState.umpirePoolData);
    }

    handleChangeWhoPaysUmpires = (e, isOrganiser) => {
        const { paymentSettingsData } = this.state;
        const { divisionList } = this.props.liveScoreTeamState;

        const newSelectedDivisions = [];
        let newSettingsData;
        
        if (isOrganiser) {
            const filteredSettingsData = paymentSettingsData.settings.filter(item => item.hasSettings !== isOrganiser)
            const initialSettingsBoxData = JSON.parse(JSON.stringify(initialPaymentSettingsData));

            if (e.target.checked) {
                newSettingsData = [ ...filteredSettingsData, initialSettingsBoxData ];
            } else {
                newSettingsData = [ ...filteredSettingsData ];
            }  
        } else {
            if (e.target.checked) {
                newSettingsData = [ ...this.state.paymentSettingsData.settings, initialNoSettingsData ];
            } else {
                newSettingsData = [ ...this.state.paymentSettingsData.settings.filter(item => !!item.isOrganiser) ];
            }  
        }

        newSettingsData.forEach(item => {
            item.allDivisions ? newSelectedDivisions.push(...divisionList) : newSelectedDivisions.push(...item.divisions);
        });

        const paymentSettingsDataObj = {
            umpirePayerTypeRefId: paymentSettingsData.umpirePayerTypeRefId,
            settings: newSettingsData,
        }

        this.setState({ paymentSettingsData: paymentSettingsDataObj, selectedDivisions: newSelectedDivisions });
    }

    handleChangeFeesRadio = (e, sectionData, sectionDataIndex, key) => {
        const { paymentSettingsData } = this.state;

        const sectionDataCopy = JSON.parse(JSON.stringify(sectionData));
        let { byBadge, byPool, UmpirePaymentFeeType } = sectionDataCopy[sectionDataIndex];

        if (key === 'byBadge') {
            byPool.length = 0;
            sectionDataCopy[sectionDataIndex].UmpirePaymentFeeType = 'BY_BADGE';
        } else {
            byBadge.length = 0;
            sectionDataCopy[sectionDataIndex].UmpirePaymentFeeType = 'BY_POOL';
        }

        const newPaymentSettingsData = {
            umpirePayerTypeRefId: paymentSettingsData.umpirePayerTypeRefId,
            settings: [ ...sectionDataCopy, ...paymentSettingsData.settings.filter(item => !item.hasSettings) ],
        }
        
        this.setState({ 
            paymentSettingsData: newPaymentSettingsData,
        });
    }

    handleChangeSettings = (sectionDataIndex, key, value, sectionData) => {
        const { paymentSettingsData } = this.state;
        const paymentSettingsDataCopy = JSON.parse(JSON.stringify(paymentSettingsData.settings));

        const targetBoxData = paymentSettingsDataCopy
            .filter(item => item.hasSettings === sectionData[0].hasSettings);

        const otherBoxData = paymentSettingsDataCopy
            .filter(item => item.hasSettings !== sectionData[0].hasSettings);

        if (key === 'allDivisions') {
            this.handleAllDivisionsChange(targetBoxData, sectionDataIndex, paymentSettingsDataCopy, value);
        } else {
            this.handleNonAllDivisionsChange(sectionData, targetBoxData, otherBoxData, sectionDataIndex, key, value);
        }
    }

    handleAllDivisionsChange = (targetBoxData, sectionDataIndex, paymentSettingsDataCopy, value) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { paymentSettingsData, selectedDivisions } = this.state;

        const newSelectedDivisions = [];

        paymentSettingsDataCopy.forEach(item => {
            item.divisions = [];
            item.allDivisions = false;
        });

        if (!!value) {
            newSelectedDivisions.push( ...divisionList);
        }

        targetBoxData[sectionDataIndex].divisions = !!value ? divisionList : [];
        targetBoxData[sectionDataIndex].allDivisions = value;

        const newPaymentSettingsData = {
            umpirePayerTypeRefId: paymentSettingsData.umpirePayerTypeRefId,
            settings: [ targetBoxData[sectionDataIndex] ],
        }

        this.setState({ 
            allDivisionVisible: !!value,
            tempPaymentSettingsData: !!value ? newPaymentSettingsData : null,
            paymentSettingsData: !value ? newPaymentSettingsData : paymentSettingsData,
            tempSelectedDivisions: !!value ? newSelectedDivisions : [],
            selectedDivisions: !value ? [] : selectedDivisions,
        });
    }

    handleNonAllDivisionsChange = (sectionData, targetBoxData, otherBoxData, sectionDataIndex, key, value) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { paymentSettingsData, selectedDivisions } = this.state;

        const newSelectedDivisions = [];

        const newSettingsData = [...otherBoxData, ...targetBoxData ];

        if (key === 'divisions') {
            targetBoxData[sectionDataIndex].divisions = value.map(item =>
                divisionList.find(divisionListItem => divisionListItem.id === item)
            );

            newSettingsData.forEach(item => {
                newSelectedDivisions.push(...item.divisions);
            });
        } else {
            targetBoxData[sectionDataIndex][key] = value;

            newSelectedDivisions.push(...selectedDivisions);
        }

        const updatedSelectedDivisions = !!newSelectedDivisions.length ? newSelectedDivisions : [];

        if (key === 'divisions' && updatedSelectedDivisions.length < divisionList.length) {
            newSettingsData.forEach(item => {
                item.allDivisions = false;
            });
        }

        if (key === 'divisions' && updatedSelectedDivisions.length === divisionList.length && value.length === divisionList.length) {
            newSettingsData
                .filter(item => item.hasSettings === sectionData[0].hasSettings)[sectionDataIndex]
                .allDivisions = true;
        }

        const newPaymentSettingsData = {
            umpirePayerTypeRefId: paymentSettingsData.umpirePayerTypeRefId,
            settings: newSettingsData,
        }

        this.setState({ 
            paymentSettingsData: newPaymentSettingsData, 
            selectedDivisions: updatedSelectedDivisions
        });
    }

    handleChangeRateCell = (e, sectionData, sectionDataIndex, rateListKey, rateRoleId, rateLineDataId) => {
        const { paymentSettingsData } = this.state;
        const sectionDataCopy = JSON.parse(JSON.stringify(sectionData));

        const rateList = sectionDataCopy[sectionDataIndex][rateListKey];

        const cellLineIdKey = rateListKey === 'byPool' ? 'umpirePoolId' : 'accreditationUmpireRefId';

        const rateLineDataForChange = rateList.find(data => data[cellLineIdKey] === rateLineDataId)?.rates;

        const rateLineData = !!rateLineDataForChange ? rateLineDataForChange : [];

        const rateDataForChangeIndex = rateLineData.findIndex(rate => rate.roleId === rateRoleId);

        if (rateDataForChangeIndex >= 0) {
            rateLineData[rateDataForChangeIndex].rate = e;
        } else {
            rateLineData.push({
                rate: e,
                roleId: rateRoleId,
            });
        }

        if (!rateLineDataForChange) {
            rateList.push({
                [cellLineIdKey]: rateLineDataId, 
                rates: rateLineData
            });
        }

        const newPaymentSettingsData = {
            umpirePayerTypeRefId: paymentSettingsData.umpirePayerTypeRefId,
            settings: [ ...sectionDataCopy, ...paymentSettingsData.settings.filter(item => !item.hasSettings) ],
        }
        
        this.setState({ 
            paymentSettingsData: newPaymentSettingsData,
        });
    }

    handleClickDeleteModal = (sectionDataIndex) => {
        this.setState({ 
            deleteModalVisible: true,
            sectionDataToDeleteIndex: sectionDataIndex 
        });
    }

    handleDeleteModal = key => {
        if (key === "ok") {
            const { paymentSettingsData, sectionDataToDeleteIndex } = this.state;
            const umpirePaymentSettingsCopy = JSON.parse(JSON.stringify(paymentSettingsData.settings.filter(item => item.hasSettings)));

            umpirePaymentSettingsCopy.splice(sectionDataToDeleteIndex, 1);

            const newPaymentSettingsData = {
                ...paymentSettingsData,
                settings: [ ...umpirePaymentSettingsCopy, ...paymentSettingsData.settings.filter(item => !item.hasSettings) ],
            };

            const newSelectedDivisions = [];

            newPaymentSettingsData.settings.forEach(item => {
                newSelectedDivisions.push(...item.divisions);
            });

            this.setState({ paymentSettingsData: newPaymentSettingsData, selectedDivisions: newSelectedDivisions });
        }

        this.setState({ deleteModalVisible: false, sectionDataToDeleteIndex: null });
    }

    handleAllDivisionModal = key => {
        if (key === "ok") {
            this.setState({ 
                paymentSettingsData: this.state.tempPaymentSettingsData,
                selectedDivisions: this.state.tempSelectedDivisions,
            });
        }

        this.setState({ 
            allDivisionVisible: false, 
            tempPaymentSettingsData: null,
            tempSelectedDivisions: null,
        });
    }

    handleAddBox = () => {
        const { paymentSettingsData } = this.state;
        
        const initialSettingsBoxData = JSON.parse(JSON.stringify(initialPaymentSettingsData));

        const newPaymentSettingsData = {
            ...paymentSettingsData,
            settings: [ ...paymentSettingsData.settings, initialSettingsBoxData ],
        };

        this.setState({ paymentSettingsData: newPaymentSettingsData });
    }

    onChangeComp = compID => {
        this.props.liveScoreGetDivision(compID);
        setUmpireCompId(compID);

        this.setState({ selectedComp: compID });
    }

    modifyPostArray = arr => {
        arr.forEach(item => {
            item.divisions = item.allDivisions ? [] : item.divisions.map(division => division.id);
            delete item.hasSettings; 
        });

        return arr;
    }

    handleSave = () => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const { selectedComp, paymentSettingsData } = this.state;

        const paymentSettingsDataCopy = JSON.parse(JSON.stringify(paymentSettingsData));

        const affiliateSettingArray = paymentSettingsDataCopy.settings
            .filter(item => !item.hasSettings && !!item.divisions.length);
        
        const umpirePaymentSettingsArray = paymentSettingsDataCopy.settings
            .filter(item => !!item.hasSettings && !!item.divisions.length && (!!item.byBadge));

        this.modifyPostArray(affiliateSettingArray);
        this.modifyPostArray(umpirePaymentSettingsArray);

        const allowedDivisionsSetting = !!affiliateSettingArray[0]?.divisions.length || !!affiliateSettingArray[0]?.allDivisions 
            ? affiliateSettingArray[0] 
            :  { allDivisions: false, divisions: [] };

        const umpirePaymentSettings = !!umpirePaymentSettingsArray.length ? umpirePaymentSettingsArray : [];

        const bodyData = {
            umpirePayerTypeRefId: paymentSettingsDataCopy.umpirePayerTypeRefId,
            umpirePaymentSettings,
            allowedDivisionsSetting,
        }

        // console.log('bodyData', bodyData);

        const saveData = {
            organisationId,
            competitionId: selectedComp,
            type: 'organiser',
            body: bodyData,
        };

        this.props.saveUmpirePaymentSettings(saveData);
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view d-flex align-items-center bg-transparent">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpirePaymentSetting}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    dropdownView = () => {
        const competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                className="d-flex align-items-center"
                                style={{ width: "fit-content" }}
                            >
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={this.onChangeComp}
                                    value={this.state.selectedComp}
                                >
                                    {competition.map((item) => (
                                        <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button 
                                    onClick={this.handleSave}
                                    className="publish-button save-draft-text" 
                                    type="primary" 
                                    htmlType="submit"
                                >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        return (
            <div className="content-view pt-4 mt-5">
                <span className='text-heading-large pt-2 pb-2'>{AppConstants.whoPayUmpire}</span>
                <div className="d-flex flex-column">
                    {this.umpireSettingsSectionView(AppConstants.competitionOrganiser, true)}
                    {this.umpireSettingsSectionView(AppConstants.affiliateOrganisations, false)}
                </div>

                {this.deleteConfirmModalView()}
                {this.allDivisionModalView()}
            </div>
        );
    };

    umpireSettingsSectionView = (sectionTitle, hasSettings) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { paymentSettingsData, selectedDivisions } = this.state;

        const sectionData = hasSettings && !!paymentSettingsData 
            ? paymentSettingsData?.settings.filter(item => item.hasSettings) 
            : paymentSettingsData?.settings.filter(item => !item.hasSettings);

        return (
            <>
                <Checkbox
                    onChange={(e) => this.handleChangeWhoPaysUmpires(e, hasSettings)}
                    checked={!!sectionData?.length}
                    className="mx-0 mb-2"
                >
                    {sectionTitle}
                </Checkbox>
                {sectionData && !!sectionData.length && (
                    <div className="position-relative" style={{ paddingBottom: 35 }}>
                        {sectionData.map((boxData, sectionDataIndex) => (
                        <div key={'settingsBox_' + sectionDataIndex} className="inside-container-view mb-2 mt-4">
                            {sectionData.length > 1 && (
                                <div className="d-flex float-right">
                                    <div
                                        className="transfer-image-view pt-0 pointer ml-auto"
                                            onClick={() => this.handleClickDeleteModal(sectionDataIndex, sectionData)}
                                    >
                                        <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                                        <span className="user-remove-text">{AppConstants.remove}</span>
                                    </div>
                                </div>
                            )}
                            <Checkbox
                                onChange={(e) => this.handleChangeSettings(sectionDataIndex, 'allDivisions', e.target.checked, sectionData)}
                                checked={boxData.allDivisions}
                            >
                                {AppConstants.allDivisions}
                            </Checkbox>
                            
                            <Select
                                mode="multiple"
                                placeholder="Select"
                                style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                                onChange={divisions => this.handleChangeSettings(sectionDataIndex, 'divisions', divisions, sectionData)}
                                value={(boxData.allDivisions ? divisionList : boxData.divisions).map(division => division.id)}
                            >
                                {(divisionList || []).map((item) => (
                                    <Option
                                        key={'compOrgDivision_' + item.id}
                                        disabled={
                                            (selectedDivisions.some(selectedDivision => selectedDivision.id === item.id 
                                            && !boxData.allDivisions && !boxData.divisions.find(division => division.id === item.id)))
                                        }
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                            {hasSettings && this.feesView(sectionData, sectionDataIndex)}
                        </div>
                        ))}
                        {selectedDivisions.length < this.props.liveScoreTeamState.divisionList.length
                            && hasSettings 
                            && (
                                <div className="row mb-5 position-absolute">
                                    <div 
                                        className="col-sm"
                                        onClick={() => this.handleAddBox()}
                                    >
                                        <span className="input-heading-add-another pointer pt-0">+ {AppConstants.addDivision}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
            </>
        )
    }

    feesView = (sectionData, sectionDataIndex) => {
        const { umpirePoolData } = this.props.umpirePoolAllocationState;

        const { badgeDataCompOrg } = this.props.umpirePaymentSettingState;
        const umpireBadgesData = isArrayNotEmpty(badgeDataCompOrg) ? badgeDataCompOrg : [];

        const { byBadge, byPool, UmpirePaymentFeeType } = sectionData[sectionDataIndex];

        return (
            <div>
                <span className='text-heading-large pt-3'>{AppConstants.fees}</span>
                <div className="d-flex flex-column">
                    <Radio
                        onChange={e => this.handleChangeFeesRadio(e, sectionData, sectionDataIndex, 'byBadge')}
                        checked={UmpirePaymentFeeType === 'BY_BADGE'}
                        className="p-0"
                    >
                        {AppConstants.byBadge}
                    </Radio>
                    {UmpirePaymentFeeType === 'BY_BADGE' && !!umpireBadgesData.length && (
                        <div>
                            {umpireBadgesData.map((badgeDataItem, i) => (
                                <div key={"badgeDataItem" + i}>
                                    {this.ratesView('byBadge', badgeDataItem, sectionData, sectionDataIndex)}
                                </div>
                            ))}
                        </div>
                    )}

                    <Radio
                        onChange={e => this.handleChangeFeesRadio(e, sectionData, sectionDataIndex, 'byPool')}
                        checked={UmpirePaymentFeeType === 'BY_POOL'}
                        className="p-0 mt-4"
                    >
                        {AppConstants.byPool}
                    </Radio>
                    {UmpirePaymentFeeType === 'BY_POOL' && !!umpirePoolData.length && (
                        <div>
                            {umpirePoolData.map((poolDataItem, i) => (
                                <div key={"poolDataItem" + i}>
                                    {this.ratesView('byPool', poolDataItem, sectionData, sectionDataIndex)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    ratesView = (radioListKey, dataItem, sectionData, sectionDataIndex) => {
        const cellLineIdKey = radioListKey === 'byPool' ? 'umpirePoolId' : 'accreditationUmpireRefId';
        const itemRates = sectionData[sectionDataIndex][radioListKey].find(data => data[cellLineIdKey] === dataItem.id)?.rates;

        const { id } = dataItem;

        return (
            <div>
                <div className="row">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            value={dataItem.description || dataItem.name}
                            disabled
                        />
                    </div>
                        
                    <div className='col-sm input-width'>
                        {this.rateCellView(itemRates, 15, AppConstants.umpireRate, sectionData, sectionDataIndex, radioListKey, id )}
                    </div>

                    <div className='col-sm input-width'>
                        {this.rateCellView(itemRates, 19, AppConstants.umpireResRate, sectionData, sectionDataIndex, radioListKey, id )}
                    </div>

                    <div className='col-sm input-width'>
                        {this.rateCellView(itemRates, 20, AppConstants.umpireCoachRate, sectionData, sectionDataIndex, radioListKey, id )}
                    </div>
                </div>
            </div>
        )
    }

    rateCellView = (poolItemRates, rateRoleId, heading, sectionData, sectionDataIndex, radioListKey, id ) => {
        const value = (poolItemRates || []).find(rate => rate.roleId === rateRoleId)?.rate;
        
        return (
            <InputNumberWithHead
                prefixValue="$"
                defaultValue={0}
                min={0}
                precision={2}
                step={0.01}
                heading={heading}
                onChange={e => this.handleChangeRateCell(e, sectionData, sectionDataIndex, radioListKey, rateRoleId, id )}
                value={!!value ? value : 0}
            /> 
        )
    }

    deleteConfirmModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.divisionSettings}
                    visible={this.state.deleteModalVisible}
                    onOk={() => this.handleDeleteModal("ok")}
                    onCancel={() => this.handleDeleteModal("cancel")}
                >
                    <p>{AppConstants.divisionRemoveMsg}</p>
                </Modal>
            </div>
        );
    }

    allDivisionModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal add-membership-type-modalLadder"
                    title={AppConstants.divisionSettings}
                    visible={this.state.allDivisionVisible}
                    onOk={() => this.handleAllDivisionModal("ok")}
                    onCancel={() => this.handleAllDivisionModal("cancel")}
                >
                    <p>{AppConstants.divisionAllDivisionMsg}</p>
                </Modal>
            </div>
        );
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="9" />
                <Layout>
                    <Form
                        onFinish={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>
                            <div className="formView umpire-form-view">{this.contentView()}</div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                    <Loader visible={this.props.umpireCompetitionState.onLoad || this.props.umpirePaymentSettingState.onLoad
                            || this.props.liveScoreTeamState.onLoad || this.props.umpirePoolAllocationState.onLoad} 
                    />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        getRefBadgeData,
        getUmpirePaymentSettings,
        saveUmpirePaymentSettings,
        liveScoreGetDivision,
        getUmpirePoolData,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentSettingState: state.UmpirePaymentSettingState,
        umpirePoolAllocationState: state.UmpirePoolAllocationState,
        liveScoreTeamState: state.LiveScoreTeamState,
        appState: state.AppState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePaymentSetting);
