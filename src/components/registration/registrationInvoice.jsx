import React, { Component } from "react";
import { Layout, Radio, Select, Descriptions, Input, Divider } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import Chart from "chart.js";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead"
import AppImages from "../../themes/appImages";
import { getInvoice } from "../../store/actions/stripeAction/stripeAction"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input
let totalArray = []
// let data =
//     [
//         {
//             "id": 1585,
//             "firstName": "Stella",
//             "middleName": "",
//             "lastName": "L",
//             "suburb": "Wynne",
//             "street1": "135 County 646 Rd",
//             "street2": "",
//             "mCasualFee": "0.00",
//             "mCasualGst": "0.00",
//             "mSeasonalFee": "0.00",
//             "mSeasonalGst": "0.00",
//             "cSeasonalFees": "15.00",
//             "cSeasonalGST": "1.50",
//             "cCasualFees": "14.00",
//             "cCasualGST": "1.40",
//             "aSeasonalFees": "14.00",
//             "aSeasonalGST": "1.40",
//             "aCasualFees": "13.00",
//             "aCasualGST": "1.30"
//         }
//     ]

class RegistrationInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019winter",
            value: "playingMember",
            competition: "all",
        }

    }




    componentDidMount() {
        // let competitionId = localStorage.getItem("competitionId")
        // let organisationId = localStorage.getItem('organisationId')
        this.props.getInvoice("397")
    }




    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view container mb-n3" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                    </div>
                </div>
            </Header >
        )
    }

    ///top header view
    topView = (result) => {
        let userDetail = result.length > 0 ? result[0].billTo : []
        return (
            <div className="content-view pt-4 pb-0 " >
                <div className="drop-reverse" >
                    <div className="col-sm "
                    >
                        <label className="invoice-description">
                            <img
                                src={AppImages.squareImage}
                                // alt="animated"
                                height="120"
                                width="120"
                                // style={{ borderRadius: 60 }}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.squareImage;
                                }}
                            />
                        </label>
                        <InputWithHead
                            heading={"Receipt No.1234497"}
                        />
                        {userDetail && userDetail.firstName &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0" label="Bill To">
                                    {userDetail.firstName}{' '}{userDetail.middleName}{' '}{userDetail.lastName}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail && (userDetail.suburb || userDetail.street1) &&
                            < Descriptions >
                                <Descriptions.Item className="pb-0"  >
                                    {userDetail.suburb} {" "}
                                    {userDetail.street1} {' '}{userDetail.street2}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail && userDetail.postalCode &&
                            < Descriptions >
                                <Descriptions.Item >
                                    {userDetail.postalCode} {" "}
                                </Descriptions.Item>
                            </Descriptions>
                        }

                        {/* </div> */}
                    </div>
                    <div className="col-sm pt-5">
                        <TextArea
                            placeholder="Text Area"
                        />
                    </div>
                </div>

            </div>
        )
    }

    ////////form content view
    contentView = (result) => {
        let data = result.length > 0 ? result[0].fees : []
        return (
            <div className="content-view pt-0 pb-0">
                <div className="invoice-row-view" >
                    <div className="invoice-col-View pb-0 pr-0 pl-0 " >
                        <InputWithHead
                            heading={"Description"}
                        />
                    </div>
                    <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                        <div className="invoice-row-view " >
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Quantity"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Unit Price"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Discount"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"GST"}
                                />
                            </div>
                            <div className="col-sm" >
                                <InputWithHead
                                    heading={"Amount AUD"}
                                />
                            </div>
                        </div>
                    </div>
                    <Divider className="mt-0 mb-0" />
                </div>


                {/* {data.membership && data.membership.length > 0 && data.membership.map((membershipItem, membershipIndex) => {
                    return ( */}
                {data && data.length > 0 && data.map((participantItem, participantIndex) => {
                    let competitionDetails = participantItem && participantItem.competitionDetail
                    let userDetail = participantItem.userDetail && participantItem.userDetail
                    let membershipDetail = participantItem && participantItem.membershipDetail
                    let affiliateDetail = participantItem && participantItem.affiliateDetail
                    return (
                        <div>
                            < div className="invoice-row-view" >
                                <div className="invoice-col-View pb-0 pl-0" >
                                    <div className="invoice-col-View pb-0 pl-0 pr-0" >
                                        {userDetail && userDetail.firstName &&
                                            <InputWithHead
                                                heading={"Registration - " + userDetail.firstName + " " + userDetail.lastName}
                                            />
                                        }
                                    </div>

                                    {/* {userDetail && userDetail.suburb &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0 pt-0" >
                                                {userDetail.suburb}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }

                                    {userDetail && userDetail.street1 &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0" >
                                                {userDetail.street1} {" "}{userDetail.street2}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }
                                    {userDetail && userDetail.PhoneNo &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0" >
                                                {userDetail.PhoneNo}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }
                                    {userDetail && userDetail.postalCode &&
                                        <Descriptions >
                                            <Descriptions.Item  >
                                                {userDetail.postalCode}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    } */}
                                </div>
                                < Divider className="mt-0 mb-0" />
                            </ div>
                            < div className="row" >
                                <div className="invoice-col-View pb-0 pr-0 pl-0" >
                                    <InputWithHead
                                        heading={membershipDetail.mOrganisationName + "-" + membershipDetail.membershipProductName}
                                    />
                                </div>

                                <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                                    <div>
                                        < div className="row" >
                                            <div className="col-sm invoice-description"  >
                                                <InputWithHead
                                                    // required='justify-content-center'
                                                    heading={("1.00")}
                                                />
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                <InputWithHead
                                                    heading={(Number(membershipDetail.mCasualFee) + Number(membershipDetail.mSeasonalFee)).toFixed(2)}
                                                />
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                <InputWithHead
                                                    heading={'N/A'}
                                                />
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                <InputWithHead
                                                    heading={(Number(membershipDetail.mCasualGst) + Number(membershipDetail.mSeasonalGst)).toFixed(2)}
                                                />
                                            </div>
                                            <div className="col-sm " >
                                                <InputWithHead
                                                    required="invoice"
                                                    heading={(Number(membershipDetail.mCasualFee) + Number(membershipDetail.mSeasonalFee) + Number(membershipDetail.mCasualGst) + Number(membershipDetail.mSeasonalGst)).toFixed(2)}
                                                />
                                            </div>
                                        </ div>
                                    </div>
                                </div>
                            </div>
                            <div className="row" >
                                < Divider className="mt-0 mb-0" />
                                <div className="invoice-col-View pr-0 pl-0" >
                                    {competitionDetails && competitionDetails.cOrganisationName &&
                                        <InputWithHead
                                            heading={competitionDetails.cOrganisationName}
                                        />
                                    }
                                </div>
                                <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                                    <div>
                                        <div className="row">
                                            <div className="col-sm invoice-description" >
                                                <InputWithHead
                                                    heading={"1.00"}
                                                />
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                <InputWithHead
                                                    heading={(Number(competitionDetails.cCasualFee) + Number(competitionDetails.cSeasonalFee)).toFixed(2)}
                                                />
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                <InputWithHead
                                                    heading={'N/A'}
                                                />
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                <InputWithHead
                                                    heading={(Number(competitionDetails.cCasualGst) + Number(competitionDetails.cSeasonalGst)).toFixed(2)}
                                                />
                                            </div>
                                            <div className="col-sm" >
                                                <InputWithHead
                                                    required="invoice"
                                                    heading={((Number(competitionDetails.cCasualFee) + Number(competitionDetails.cSeasonalFee)) + (Number(competitionDetails.cCasualGst) + Number(competitionDetails.cSeasonalGst))).toFixed(2)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                < Divider className="mt-0 mb-0" />
                            </div>
                            <div className="row" >
                                <div className="invoice-col-View pb-0 pr-0 pl-0" >
                                    {affiliateDetail && affiliateDetail.aOrganisationName &&
                                        <InputWithHead
                                            heading={affiliateDetail.aOrganisationName}
                                        />
                                    }
                                </div>
                                <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                                    <div>
                                        <div className="row">
                                            <div className="col-sm invoice-description" >
                                                {affiliateDetail &&
                                                    <InputWithHead
                                                        heading={"1.00"}
                                                    />}
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                {affiliateDetail &&
                                                    <InputWithHead
                                                        heading={(Number(affiliateDetail.aCasualFee) + Number(affiliateDetail.aSeasonalFee)).toFixed(2)}
                                                    />
                                                }
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                {affiliateDetail &&
                                                    <InputWithHead
                                                        heading={'N/A'}
                                                    />
                                                }
                                            </div>
                                            <div className="col-sm invoice-description" >
                                                {affiliateDetail &&
                                                    < InputWithHead
                                                        heading={(Number(affiliateDetail.aCasualGst) + Number(affiliateDetail.aSeasonalGst)).toFixed(2)}
                                                    />}
                                            </div>
                                            <div className="col-sm" >
                                                {affiliateDetail &&
                                                    < InputWithHead
                                                        required="invoice"
                                                        heading={((Number(affiliateDetail.aCasualFee) + Number(affiliateDetail.aSeasonalFee)) + (Number(affiliateDetail.aCasualGst) + Number(affiliateDetail.aSeasonalGst))).toFixed(2)}
                                                    />}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* {data.length - 1 !== participantIndex && */}
                                < Divider className="mt-0 mb-0" />

                                {/* } */}
                            </div>
                            <div className="d-flex row d-flex justify-content-end" >
                                <div className="invoice-total justify-content-end">
                                    <InputWithHead
                                        heading={"Total"}
                                    />
                                </div>
                                <div className="invoice-total-Amount">
                                    <InputWithHead
                                        required="invoice"
                                        heading={"$" + "150"}
                                    />
                                </div>
                                {data.length - 1 !== participantIndex &&
                                    < Divider className="mt-0 mb-0" />

                                }
                            </div>

                        </div>
                    )
                }
                )
                }




            </div >
        )
    }

    subTotal = (data) => {
        let totalvalueArray = []
        let totalValue = 0
        if (data.length > 0) {
            for (let a in data) {
                let membership = data[a].membership
                let competitionFees = data[a].competitionOrganiser.fees
                let affilateFees = data[a].affiliate && data[a].affiliate.fees
                for (let i in membership) {
                    let fees = membership[i].membershipProductTypes
                    for (let j in fees) {
                        totalvalueArray.push(Number(fees[j].mCasualFee + fees[j].mSeasonalFee))
                    }
                }
                for (let k in competitionFees) {
                    totalvalueArray.push(Number(competitionFees[k].cCasualFees + competitionFees[k].cSeasonalFees))
                }
                for (let l in affilateFees) {
                    totalvalueArray.push(Number(affilateFees[l].aCasualFees + affilateFees[l].aSeasonalFees))
                }
            }
            totalValue = totalvalueArray.reduce((a, b) => a + b, 0)
            return totalValue
        }
        return totalValue
    }

    subGst = (data) => {
        let totalGstArray = []
        let totalGst = 0
        if (data.length > 0) {
            for (let a in data) {
                let membership = data[a].membership
                let competitionFees = data[a].competitionOrganiser.fees
                let affilateFees = data[a].affiliate.fees
                for (let i in membership) {
                    let fees = membership[i].membershipProductTypes
                    for (let j in fees) {
                        totalGstArray.push(Number(fees[j].mCasualFee + fees[j].mSeasonalFee))
                    }
                }
                for (let k in competitionFees) {
                    totalGstArray.push(Number(competitionFees[k].cCasualFees + competitionFees[k].cSeasonalFees))
                }
                for (let l in affilateFees) {
                    totalGstArray.push(Number(affilateFees[l].aCasualFees + affilateFees[l].aSeasonalFees))
                }
            }
            totalGst = totalGstArray.reduce((a, b) => a + b, 0)
            return totalGst
        }
        return totalGst

    }



    charityRoundUpView = (result) => {
        let data = isArrayNotEmpty(result) ? result : []
        return (
            <div>
                {data && data.length > 0 && data.map((participantItem, participantIndex) => {
                    let charityRoundUpData = participantItem && isArrayNotEmpty(participantItem.charityDetail) ? participantItem.charityDetail : []
                    return (
                        <Radio.Group
                            className="reg-competition-radio"
                            // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                            value={"item.id"}
                        >
                            {charityRoundUpData.length > 0 && charityRoundUpData.map(charityRoundUpItem => {
                                return (
                                    <Radio key={charityRoundUpItem.id} value={charityRoundUpItem.id}>{charityRoundUpItem.roundUpName}</Radio>
                                );
                            })}

                        </Radio.Group>
                    )
                })}
            </div>
        )
    }





    totalInvoiceView = (result) => {
        let data = result.length > 0 ? result : []
        // let subValue = this.subTotal(data)
        let subValue = 0
        return (
            <div className="content-view ">
                {this.charityRoundUpView(result)}
                <div className="drop-reverse" >
                    <div className="col-sm ">
                        <TextArea
                            placeholder="Text Area"
                        />
                    </div>
                    <div className="col-sm pl-0 pr-0"
                    >

                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="col-sm-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pr-4"}
                                    heading={"Subtotal"}
                                />
                            </div>
                            <InputWithHead
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={subValue !== 0 ? subValue.toFixed(2) : '0'}
                            />

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="col-sm-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pr-4 pt-0"}
                                    heading={"GST 10%"}
                                />
                            </div>
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={subValue !== 0 ? (subValue / 10).toFixed(2) : '0'}
                            />

                        </div>
                        <div className="row" >
                            <div className="col-sm" />
                            <div className="col-sm"  >
                                <div style={{ display: 'flex', height: "1px", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.65)" }}
                                >
                                </div>
                            </div>

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>

                            <InputWithHead
                                required={"pr-4 pt-0"}
                                heading={"Amount Due"}
                            />
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={"AUD" + " " + Number(subValue + subValue / 10).toFixed(2)}
                            />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm pt-5 invoiceImage">
                        <label>
                            <img
                                src={AppImages.netballImages}
                                // alt="animated"
                                height="100%"
                                width="100%"
                                // style={{ borderRadius: 60 }}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.netballImages;
                                }}
                            />
                        </label>
                    </div>
                    <div className="col-sm pt-5 invoiceImageMain ">
                        <label>
                            <img
                                src={AppImages.netballLogoMain}
                                height="100%"
                                width="100%"
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.netballLogoMain;
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div >
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div >
                <div className="comp-player-grades-footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        let result = this.props.stripeState.getInvoicedata
        console.log("result", result)
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />

                <Layout>
                    {this.headerView()}
                    <Content className="container">
                        <div className="formView">
                            {this.topView(result)}
                            {this.contentView(result)}
                            {this.totalInvoiceView(result)}
                        </div>
                        <Loader visible={this.props.stripeState.onLoad} />
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInvoice
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        stripeState: state.StripeState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(RegistrationInvoice);

