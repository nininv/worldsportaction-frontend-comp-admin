import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Button, message } from "antd";

import AppConstants from "themes/appConstants";
import ValidationConstants from "themes/validationConstant";
import history from "util/history";
import { getLiveScoreCompetiton } from "util/sessionStorage";
import { showInvalidData } from "util/showImportResult";
import {
    liveScoreUmpireImportAction,
    liveScoreUmpireResetImportResultAction
} from "store/actions/LiveScoreAction/livescoreUmpiresAction";
import Loader from "customComponents/loader";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

// import "./umpire.css";

const { Content, Header, Footer } = Layout;

const columns = [
    {
        title: "First Name",
        dataIndex: "First Name",
        key: "First Name",
    },
    {
        title: "Last Name",
        dataIndex: "Last Name",
        key: "Last Name",
    },
    {
        title: "Email",
        dataIndex: "Email",
        key: "Email",
    },
    {
        title: "Contact No",
        dataIndex: "Contact No",
        key: "Contact No",
    },
    {
        title: "Organisation",
        dataIndex: "Organisation",
        key: "Organisation",
    },
];

class LiveScoreUmpireImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData: null,
            screenName: (props.location && props.location.state && props.location.state.screenName) ? props.location.state.screenName : null,
        };
    }

    componentDidMount() {
        this.props.liveScoreUmpireResetImportResultAction();
    }

    headerView = () => (
        <div className="header-view">
            <Header
                className="form-header-view"
                style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importUmpire}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        </div>
    );

    handleForce = data => {
        this.setState({ csvData: data.target.files[0] });
    };

    onUploadBtn = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton());
        if (this.state.csvData) {
            this.props.liveScoreUmpireImportAction({
                id,
                csvFile: this.state.csvData,
                screenName: "liveScoreUmpireList",
            });

            this.setState({
                csvData: null,
            }, () => {
                this.filesInput.value = null;
            });
        } else {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.csvField);
        }
    };

    contentView = () => (
        <div className="content-view pt-4">
            <span className="user-contact-heading">{AppConstants.fileInput}</span>

            <div className="col-sm">
                <div className="row">
                    <label>
                        <input
                            style={{ cursor: "pointer" }}
                            className="pt-2 pb-2"
                            type="file"
                            ref={(input) => {
                                this.filesInput = input
                            }}
                            name="file"
                            // icon="file text outline"
                            // iconPosition="left"
                            // label="Upload CSV"
                            // labelPosition="right"
                            placeholder="UploadCSV..."
                            onChange={this.handleForce}
                            accept=".csv"
                        />
                    </label>
                </div>
            </div>

            <div className="col-sm" style={{ marginTop: 10 }}>
                <div className="row">
                    <div className="reg-add-save-button">
                        {this.state.screenName === "umpireRoaster" ? (
                            <Button type="primary" className="primary-add-comp-form">
                                {AppConstants.upload}
                            </Button>
                        ) : (
                                <Button type="primary" className="primary-add-comp-form" onClick={this.onUploadBtn}>
                                    {AppConstants.upload}
                                </Button>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        const { liveScoreUmpiresState: { importResult, onLoad } } = this.props;
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="6" />

                <Loader visible={onLoad} />

                <Layout>
                    {this.headerView()}

                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>

                        {showInvalidData(columns, importResult)}
                    </Content>

                    <Footer />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreUmpireImportAction,
        liveScoreUmpireResetImportResultAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        liveScoreUmpiresState: state.LiveScoreUmpiresState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreUmpireImport);
