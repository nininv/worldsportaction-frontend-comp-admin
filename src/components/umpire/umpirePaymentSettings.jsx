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
    Radio
} from "antd";

import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { umpirePaymentSettingUpdate } from '../../store/actions/umpireAction/umpirePaymentSettingAction'
import { getRefBadgeData } from '../../store/actions/appAction'

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class UmpirePaymentSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null
        };
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
        this.props.umpirePaymentSettingUpdate({ value: null, key: 'refreshPage' })
        this.props.getRefBadgeData()
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id

                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }
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

    onChangeComp = compID => {
        // this.props.liveScoreGetDivision(compID);
        setUmpireCompId(compID);

        this.setState({ selectedComp: compID });
    }

    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
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
        const { paidByCompOrgDivision } = this.props.umpirePaymentSettingState
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit">
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
        const { paidByCompOrg, paidByAffiliate } = this.props.umpirePaymentSettingState
        return (
            <div className='pt-4' style={{ padding: '3%', minWidth: 240 }}>
                <span className='text-heading-large pt-2'>{AppConstants.whoPayUmpire}</span>

                <div className="d-flex flex-column">
                    <Checkbox
                        className="single-checkbox"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'paidByComp'
                        })}
                        checked={paidByCompOrg}
                    >
                        {AppConstants.competitionOrganiser}
                    </Checkbox>

                    {paidByCompOrg && (
                        <div className="inside-container-view">
                            {this.paidByCompOrgView()}
                            {this.feesView()}
                        </div>
                    )}

                    <Checkbox
                        className="single-checkbox ml-0"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'paidByAffilate'
                        })}
                        checked={paidByAffiliate}
                    >
                        {AppConstants.affiliateOrganisations}
                    </Checkbox>

                    {paidByAffiliate && (
                        <div className="inside-container-view">
                            {this.paidByAffiliateView()}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    paidByCompOrgView = () => {
        const { paidByCompOrgDivision, selectAllDiv, compOrgDiv } = this.props.umpirePaymentSettingState
        return (
            <div className="d-flex flex-column">
                <Checkbox
                    onChange={(e) => this.props.umpirePaymentSettingUpdate({
                        value: e.target.checked,
                        key: 'selectAllDiv'
                    })}
                    checked={selectAllDiv}
                >
                    {AppConstants.allDivisions}
                </Checkbox>
                {selectAllDiv === false && (
                    <Select
                        mode="multiple"
                        placeholder="Select"
                        style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                        onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({
                            value: divisionId,
                            key: 'paidByCompOrgDivision'
                        })}
                        value={paidByCompOrgDivision}
                    >
                        {compOrgDiv.map((item) => (
                            <Option key={'compOrgDivision_' + item.id} disabled={item.disabled} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                )}
            </div>
        )
    }

    paidByAffiliateView = () => {
        const { paidByAffiliateDivision, selectAllDiv, affiliateDiv } = this.props.umpirePaymentSettingState
        return (
            <div className="d-flex flex-column">
                <Checkbox
                    onChange={(e) => this.props.umpirePaymentSettingUpdate({
                        value: e.target.checked,
                        key: 'selectAllDiv'
                    })}
                    checked={selectAllDiv}
                >
                    {AppConstants.allDivisions}
                </Checkbox>
                {
                    selectAllDiv === false &&
                    <Select
                        mode="multiple"
                        placeholder="Select"
                        style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                        onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({
                            value: divisionId,
                            key: 'paidByAffiliateDivision'
                        })}
                        value={paidByAffiliateDivision}
                    >
                        {affiliateDiv.map((item) => (
                            <Option key={'affiliateDivision_' + item.id} disabled={item.disabled} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                }
            </div>
        )
    }

    feesView = () => {
        const { byBadgeBtn, byPoolBtn, inputFieldForByPool } = this.props.umpirePaymentSettingState
        return (
            <div>
                <span className='text-heading-large pt-3'>{AppConstants.fees}</span>
                <div className="d-flex flex-column">
                    <Radio
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byBadge'
                        })}
                        checked={byBadgeBtn}
                    >
                        {AppConstants.byBadge}
                    </Radio>
                    {byBadgeBtn && (
                        <div>
                            {this.byBadgeView()}
                        </div>
                    )}

                    <Radio
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byPool'
                        })}
                        checked={byPoolBtn}
                    >
                        {AppConstants.byPool}
                    </Radio>
                    {byPoolBtn && (
                        <div>
                            {inputFieldForByPool.map((item, index) => (
                                <div key={"inputFieldForByPool" + index}>
                                    {this.inputFieldsForByPool(item, index)}
                                </div>
                            ))}
                            {/* <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addAnotherGroupForByPool' })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherGroup}</span> */}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    inputFieldsForByPool = (item, index) => {
        const { inputFieldForByPool } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div className="row pt-3">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'name',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].name}
                        />
                    </div>
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete="off"
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireRate}
                            placeholder={"Umpire Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'umpireRate',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].umpireRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete="off"
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireResRate}
                            placeholder={"Umpire Reserve Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'umpReserveRate',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].umpReserveRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete="off"
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireCoachRate}
                            placeholder={"Umpire Coach Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'umpCoachRate',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].umpCoachRate}
                        />
                    </div>

                    {/* <div className="col-sm-1 umpire-delete-image-view">
                        <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removePoolItem', index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                    </div> */}
                </div>
            </div>
        )
    }

    byBadgeView = () => {
        const { inputFieldArray, byBadgeDivision, allDivisionBadge, compOrgDiv } = this.props.umpirePaymentSettingState
        const { badgeDataCompOrg } = this.props.umpirePaymentSettingState
        let badge = isArrayNotEmpty(badgeDataCompOrg) ? badgeDataCompOrg : []
        return (
            <div>
                <div className="d-flex flex-column" style={{ marginTop: 20 }}>
                    <Checkbox checked={allDivisionBadge} onChange={(e) => this.props.umpirePaymentSettingUpdate({
                        value: e.target.checked,
                        key: 'allDivisionBadge'
                    })}>
                        {AppConstants.allDivisions}
                    </Checkbox>
                    {allDivisionBadge == false && (
                        <Select
                            mode="multiple"
                            placeholder="Select"
                            style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                            onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({
                                value: divisionId,
                                key: 'byBadgeDivision'
                            })}
                            value={byBadgeDivision}
                        >
                            {compOrgDiv.map((item) => (
                                <Option key={'compOrgDivision_' + item.id} disabled={item.disabled} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>
                {/* <div> */}
                {badge.map((item, index) => (
                    <div key={"inputFieldArray" + index}>
                        {this.inputFields(item, index)}
                    </div>
                ))}
                {/* <div style={{ marginTop: inputFieldArray.length === 0 ? null : -35 }}> */}
                {/* <div>
                    <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addAnotherGroup' })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherGroup}</span>
                </div> */}
                {/* </div> */}
            </div>
        )
    }

    inputFields = (badgeData, index) => {
        const { inputFieldArray } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div className="row pt-3">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'name'
                            })}
                            value={badgeData.description}
                            disabled
                        />
                    </div>
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete="off"
                            prefix="$"
                            type="number"
                            step=".01"
                            heading={AppConstants.umpireRate}
                            placeholder={"Umpire Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'umpireRate'
                            })}
                            // value={inputFieldArray[index].umpireRate}
                            value={badgeData.umpireRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete="off"
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireResRate}
                            placeholder={"Umpire Reserve Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'umpReserveRate'
                            })}
                            // value={inputFieldArray[index].umpReserveRate}
                            value={badgeData.umpReserveRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete="off"
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireCoachRate}
                            placeholder={"Umpire Coach Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index,
                                key: 'umpCoachRate'
                            })}
                            // value={inputFieldArray[index].umpCoachRate}
                            value={badgeData.umpCoachRate}
                        />
                    </div>

                    {/* <div className="col-sm-1 umpire-delete-image-view">
                        <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removeItem', index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                    </div> */}
                </div>
            </div>
        )
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
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        umpirePaymentSettingUpdate,
        getRefBadgeData
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentSettingState: state.UmpirePaymentSettingState,
        appState: state.AppState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePaymentSetting);
