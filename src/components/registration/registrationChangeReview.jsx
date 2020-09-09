import React, { Component } from "react";
import {
    Layout,
    Input,
    Select,
    DatePicker,
    Button,
    Breadcrumb,
    Form,
    Radio,
    Modal,
    Table
} from "antd";
import "./product.scss";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { getYearAndCompetitionAction } from "../../store/actions/appAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ValidationConstants from "../../themes/validationConstant";
import { isArrayNotEmpty } from '../../util/helpers';
import { updateRegistrationReviewAction, getRegistrationChangeReview, saveRegistrationChangeReview } 
        from '../../store/actions/registrationAction/registrationChangeAction'
import { captializedString } from "../../util/helpers"
import moment, { utc } from "moment";
import { getOrganisationData } from "util/sessionStorage";
import history from '../../util/history'
import Loader from '../../customComponents/loader';
import { render } from "react-dom";

const { Header, Footer, Content } = Layout;

let this_Obj = null;

const refundFullAmountColumns = [
    {
        title: 'Paid Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount,record, index) => {
            return(
                <div>${amount}</div>
            );
        }
    },
    {
        title: 'Fee Type',
        dataIndex: 'feeType',
        key: 'feeType'
    },
    {
        title: 'Date',
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        render: (invoiceDate,record, index) => {
            let formattedDate = moment(invoiceDate).format('DD/MM/YYYY');
            return(
                <div>{formattedDate}</div>
            );
        }
    },
    {
        title: 'Refund Amount',
        dataIndex: 'amount',
        key: 'Refund Amount'
    }
];

const refundPartialAmountColumns = [
    {
        title: 'Paid Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount,record, index) => {
            return(
                <div>${amount}</div>
            );
        }
    },
    {
        title: 'Fee Type',
        dataIndex: 'feeType',
        key: 'feeType'
    },
    {
        title: 'Date',
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        render: (invoiceDate,record, index) => {
            let formattedDate = moment(invoiceDate).format('DD/MM/YYYY');
            return(
                <div>{formattedDate}</div>
            );
        }
    },
    {
        title: 'Refund Amount',
        dataIndex: 'amount',
        key: 'Refund Amount',
        render: (amount,record, index) => {
            return(
                <div>
                    <Input
                        style={{height:"25px",width:"100px",fontSize: "10px"}} type="number"
                        onChange={(e) => this_Obj.updateInvoices(e.target.value,index)}
                    />
                </div>
            );
        }
    }
]

class RegistrationChangeReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            acceptVisible: false,
            declineVisible: false,
            deRegisterId: null,
            organisationId: getOrganisationData().organisationUniqueKey,
            organisationTypeRefId: getOrganisationData().organisationTypeRefId,
            loading: false
        };
        this_Obj = this;
    }

    componentDidMount() {
        let deRegisterId = this.props.location? this.props.location.deRegisterId ?  this.props.location.deRegisterId: null:  null;
        console.log("deRegisterId::" + deRegisterId)
        this.setState({deRegisterId});
        this.apiCall(deRegisterId);
    }

    componentDidUpdate(nextProps){
        let regChangeState = this.props.registrationChangeState;
        if(this.state.loading == true && regChangeState.onSaveLoad == false){
            this.goBack();
        }
    }

    apiCall = (deRegisterId) =>{
        let payload = {
            deRegisterId : deRegisterId,
            organisationId: this.state.organisationId
        }

        this.props.getRegistrationChangeReview(payload);
    }

    acceptModal = (key) => {
        if(key == "show"){
            this.setState({acceptVisible: true });
        }
        else if(key == "ok"){
            this.setState({acceptVisible: false });
            const {reviewSaveData} = this.props.registrationChangeState;
            this.saveReview(reviewSaveData.invoices);
        }
        else {
            this.setState({acceptVisible: false });
        }
       
    };

    declineModal = (key) => {
        if(key == "show"){
            this.setState({declineVisible: true });
        }
        else if(key == "ok"){
            this.setState({declineVisible: false });
            const {regChangeReviewData} = this.props.registrationChangeState;
            let invoicesTemp = regChangeReviewData.invoices.map(e => ({ ... e }));
            for(let invoice of invoicesTemp){
                invoice.refundAmount = invoice.amount;
            }
            this.saveReview(invoicesTemp);
        }
        else {
            this.setState({declineVisible: false });
        }
       
    };

    goBack = () =>{
        history.push({pathname:'/registrationChange'});
    }

    updateRegistrationReview = (value, key) =>{
        this.props.updateRegistrationReviewAction(value,key);

        //For update invoices list 
        if(key == "refundTypeRefId"){
            const {regChangeReviewData} = this.props.registrationChangeState;
            let invoicesTemp = regChangeReviewData.invoices.map(e => ({ ... e }));
            if(value == 1){
                for(let invoice of invoicesTemp){
                    invoice.refundAmount = invoice.amount;
                }
            }
            this.props.updateRegistrationReviewAction(invoicesTemp,"invoices");
        }
    }

    updateInvoices = (refundAmount,index) => {
        const {reviewSaveData} = this.props.registrationChangeState;
        reviewSaveData.invoices[index].refundAmount = refundAmount;
        this.updateRegistrationReview(reviewSaveData.invoices,"invoices")
    }

    getApprovalsIconColor = (item) => {
        let color = item.refundTypeRefId == 1 ? "green" : "orange";
        return color;
    }

    getOrgRefName = (orgRefTypeId) => {
        let orgTypeRefName;
        if(orgRefTypeId == 1){
            orgTypeRefName = "Competition";
        }else if(orgRefTypeId == 2){
            orgTypeRefName = "Affliate";
        }else if(orgRefTypeId == 3){
            orgTypeRefName = "Membership";
        }
        return orgTypeRefName;
    }

    saveReview = (invoices) =>{
        
        let reviewSaveData = this.props.registrationChangeState.reviewSaveData;
        let regChangeReviewData = this.props.registrationChangeState.regChangeReviewData;
        if(reviewSaveData.refundTypeRefId!= null){
            if(reviewSaveData.refundTypeRefId == 1){
                reviewSaveData.refundAmount = regChangeReviewData.fullAmount;
            }
        }else{
            reviewSaveData.refundAmount = regChangeReviewData.fullAmount;
        }
        reviewSaveData["organisationId"] = this.state.organisationId;
        reviewSaveData["deRegisterId"] = this.state.deRegisterId;
        reviewSaveData["affOrgId"] = regChangeReviewData.affOrgId;
        reviewSaveData["compOrgId"] = regChangeReviewData.compOrgId;
        reviewSaveData["isDirect"] = regChangeReviewData.isDirect;
        reviewSaveData["organisationTypeRefId"] = this.state.organisationTypeRefId;
        reviewSaveData["membershipMappingId"] = regChangeReviewData.membershipMappingId;
        reviewSaveData["competitionId"] = regChangeReviewData.competitionId;
        reviewSaveData["userId"] = regChangeReviewData.userId;
        reviewSaveData["invoices"] = invoices;

        console.log("$$$$$$$$$$$$$$::" + JSON.stringify(reviewSaveData));
        
        this.props.saveRegistrationChangeReview(reviewSaveData);
        this.setState({loading: true});
    }


    ////modal view
    acceptModalView(getFieldDecorator) {
        const {reviewSaveData,regChangeReviewData} = this.props.registrationChangeState;
        return (
            <Modal
                title={"Refund"}
                visible={this.state.acceptVisible}
                onCancel={ () => this.acceptModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText={'Save'}
                onOk = { () => this.acceptModal("ok")}
                centered={true}>
                <Radio.Group className="reg-competition-radio"
                    value={reviewSaveData.refundTypeRefId}
                    onChange={(e) => this.updateRegistrationReview(e.target.value,"refundTypeRefId")}>
                    <Radio  value={1}>{'Refund full amount'}</Radio>
                    {reviewSaveData.refundTypeRefId == 1 ? 
                        <Table
                            className="refund-table"
                            columns={refundFullAmountColumns}
                            dataSource={regChangeReviewData.invoices}
                            pagination={false}
                        />
                    : null } 
                    <Radio  value={2}>{'Refund partial payment'}</Radio>
                    {reviewSaveData.refundTypeRefId == 2 ? 
                        <Table
                            className="refund-table"
                            columns={refundPartialAmountColumns}
                            dataSource={regChangeReviewData.invoices}
                            pagination={false}
                        />
                    : null } 
                    {/* {reviewSaveData.refundTypeRefId == 2 ? 
                    <InputWithHead
                            placeholder={AppConstants.refundAmount}
                            value={reviewSaveData.refundAmount}
                            onChange={(e) => this.updateRegistrationReview(e.target.value,"refundAmount")}
                        />
                        : null } */}
                </Radio.Group>
            </Modal>
        )
    }

    declineModalView(getFieldDecorator) {
        const {reviewSaveData} = this.props.registrationChangeState;
        return (
            <Modal
                title={"Decline"}
                visible={this.state.declineVisible}
                onCancel={ () => this.declineModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText={'Save'}
                onOk = { () => this.declineModal("ok")}
                centered={true}>
                <InputWithHead heading={AppConstants.reasonWhyYourAreDecline} />
                <Radio.Group className="reg-competition-radio"
                    value={reviewSaveData.declineReasonRefId}
                    onChange={(e) => this.updateRegistrationReview(e.target.value,"declineReasonRefId")}>
                    <Radio value={1}>
                        <span style={{whiteSpace: 'pre-wrap',display: 'inline-flex'}}>They have already taken the court for training, grading or a competition game</span>
                    </Radio>
                    <Radio value={2}>{'They owe monies'}</Radio>
                    <Radio value={3}>{'Other'}</Radio>
                    {reviewSaveData.declineReasonRefId == 3 ? 
                    <InputWithHead
                            placeholder={AppConstants.other}
                            value={reviewSaveData.otherInfo}
                            onChange={(e) => this.updateRegistrationReview(e.target.value,"otherInfo")}
                        />
                     : null}
                </Radio.Group>

            </Modal>
        )
    }

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
                    <div className="row">
                        <div
                            className="col-sm"
                            style={{ display: "flex", alignContent: "center" }}
                        >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">
                                    {AppConstants.registrationChange}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        );
    }

    ////////form content view
    contentView = (getFieldDecorator) => {

        const { regChangeReviewData, deRegistionOption, reviewSaveData } = this.props.registrationChangeState
        //console.log(reviewSaveData, 'reviewSaveData')

        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            disabled={true}
                            heading={AppConstants.username}
                            placeholder={AppConstants.username}
                            value={regChangeReviewData ? regChangeReviewData.userName : null}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            disabled={true}
                            heading={AppConstants.userIsRegisteredTo}
                            placeholder={AppConstants.userIsRegisteredTo}
                            value={regChangeReviewData ? regChangeReviewData.userRegisteredTo : null}
                        />

                    </div>
                </div>

                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead
                            disabled={true}
                            heading={AppConstants.competition_name}
                            placeholder={AppConstants.competition_name}
                            value={regChangeReviewData ? regChangeReviewData.competitionName : null}
                        />
                    </div>

                    <div className="col-sm">
                        <InputWithHead
                            disabled={true}
                            heading={AppConstants.competitionAdministrator}
                            placeholder={AppConstants.competitionAdministrator}
                            value={regChangeReviewData ?  regChangeReviewData.competitionOrgName : null}
                        />
                    </div>
                </div>


                <span className='text-heading-large pt-5' >{AppConstants.regChangeDetail}</span>
                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead heading={AppConstants.dateRegChange} />
                        <DatePicker
                            disabled={true}
                            size="large"
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'createdOn'}
                            placeholder={"dd-mm-yyyy"}
                            value={regChangeReviewData.createdOn!= null && moment(regChangeReviewData.createdOn) }
                        />
                    </div>

                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dateCompStart} />
                        <DatePicker
                            disabled={true}
                            size="large"
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'startDate'}
                            placeholder={"dd-mm-yyyy"}
                            value={regChangeReviewData.startDate !== null && moment(regChangeReviewData.startDate)}
                        />
                    </div>
                </div>


                <div >
                    <InputWithHead
                            disabled={true}
                            heading={AppConstants.regChangeType}
                            placeholder={AppConstants.regChangeType}
                            value={regChangeReviewData ?  regChangeReviewData.regChangeType : null}
                        />
                </div>

                <div>
                    <InputWithHead heading={AppConstants.doTheySayForGame} />
                    <Radio.Group
                        disabled={true}
                        className="reg-competition-radio"
                        value={regChangeReviewData ?  (regChangeReviewData.reasonTypeRefId!= null ? 2 : 1)  : null}
                    >
                        <Radio value={1}>{'Yes'}</Radio>
                        <Radio value={2}>{'No'}</Radio>
                    </Radio.Group>
                </div>
                {regChangeReviewData.reasonTypeRefId!= null ?
                <div>
                    <InputWithHead heading={AppConstants.reasonToDeRegister} />
                    <Radio.Group
                        disabled={true}
                        className="reg-competition-radio"
                        value={regChangeReviewData ?  regChangeReviewData.reasonTypeRefId : null}
                    >
                        {isArrayNotEmpty(deRegistionOption) && deRegistionOption.map((item) => (
                            <Radio key={item.id} value={item.id}>{item.value}</Radio>
                        ))
                        }
                        {
                            (regChangeReviewData.reasonTypeRefId == 5) &&
                            <div>
                                <InputWithHead
                                    disabled={true}
                                    className='ml-5'
                                    placeholder='Other'
                                    style={{ maxWidth: '50%', minHeight: 60 }} />

                            </div>
                        }

                    </Radio.Group>
                </div> : null }

                <div>
                    <InputWithHead heading={AppConstants.approvals} />
                    {(regChangeReviewData.approvals || []).map((item, index) =>(
                        <div key={item.orgRefTypeId + "approval" + index}>
                            <div style={{display: 'flex'}}>
                                <div>{item.payingOrgName} - {this.getOrgRefName(item.orgRefTypeId)}</div>
                                {item.refundTypeRefId != null  ? 
                                    <div>
                                        {item.refundTypeRefId != 3 ? 
                                            <div style={{color: this.getApprovalsIconColor(item),paddingLeft: "10px"}}>&#x2714;</div>
                                            :
                                            <div style={{color: "red",paddingLeft: "10px"}}>&#x2718;</div>
                                        }
                                    </div>
                                  : null  
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    //////footer view containing all the buttons
    footerView = () => {
        let {regChangeReviewData} = this.props.registrationChangeState;
        let isShowButton = regChangeReviewData.isShowButton;
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" onClick = {() => this.goBack()} >{
                                isShowButton == 1 ? AppConstants.cancel : AppConstants.back
                                }</Button>
                            </div>
                        </div>
                        {isShowButton == 1 ? 
                        <div className="col-sm" >
                            <div className="comp-buttons-view">
                                <Button onClick={() => this.acceptModal("show")} className="user-approval-button mr-3" type="primary" htmlType="submit" >
                                    {AppConstants.approve}
                                </Button>

                                <Button onClick={() => this.declineModal("show")}  className="user-approval-button" type="primary" htmlType="submit" >
                                    {AppConstants.decline}
                                </Button>
                            </div>
                        </div> 
                        : null }
                    </div>
                </div>
            </div>
        );
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"9"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        noValidate="noValidate" >
                        <Content>
                            <Loader visible={this.props.registrationChangeState.onLoad || 
                                this.props.registrationChangeState.onSaveLoad} />
                            <div className="formView">
                                {this.contentView(getFieldDecorator)}
                                {this.acceptModalView(getFieldDecorator)}
                                {this.declineModalView(getFieldDecorator)}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getYearAndCompetitionAction,
            updateRegistrationReviewAction,
            getRegistrationChangeReview,
            saveRegistrationChangeReview
        },
        dispatch
    );
}
function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        registrationChangeState: state.RegistrationChangeState

    };
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationChangeReview));
