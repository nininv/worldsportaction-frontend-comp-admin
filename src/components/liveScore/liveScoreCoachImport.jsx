import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Breadcrumb, Button, message } from "antd";

import AppConstants from "themes/appConstants";
import ValidationConstants from "themes/validationConstant";
import history from "util/history";
import { getLiveScoreCompetiton } from "util/sessionStorage";
import { showInvalidData } from "util/showImportResult";
import { userExportFilesAction } from "store/actions/appAction";
import {
    liveScoreCoachImportAction,
    liveScoreCoachResetImportResultAction
} from "store/actions/LiveScoreAction/liveScoreCoachAction";
import Loader from "customComponents/loader";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./liveScore.css";

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
        title: "Team",
        dataIndex: "Team",
        key: "Team",
    },
    {
        title: "Division Grade",
        dataIndex: "Division Grade",
        key: "Division Grade",
    },
];

class LiveScoreCoachImport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData: null,
            competitionId: null,
        };
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton());
        this.setState({ competitionId: id });

        this.props.liveScoreCoachResetImportResultAction();
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
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importCoach}</Breadcrumb.Item>
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
            this.props.liveScoreCoachImportAction({ id, csvFile: this.state.csvData });

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

    onExport = () => {
        let url = AppConstants.coachExport + this.state.competitionId;
        this.props.userExportFilesAction(url);
    };

    contentView = () => (
        <div className="content-view pt-4">
            <span className="input-heading">{AppConstants.fileInput}</span>
            <div className="col-sm">
                <div className="row">
                    <label>
                        <input
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
                        <Button onClick={this.onUploadBtn} className="primary-add-comp-form" type="primary">
                            {AppConstants.upload}
                        </Button>
                    </div>

                    <div className="reg-add-save-button ml-3">
                        <NavLink to="/templates/wsa-livescore-import-coach.csv" target="_blank" download>
                            <Button className="primary-add-comp-form" type="primary">
                                {AppConstants.downloadTemplate}
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        const { liveScoreCoachState: { importResult, onLoad } } = this.props;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="23" />

                <Loader visible={onLoad || this.props.appState.onLoad} />

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
        liveScoreCoachImportAction,
        liveScoreCoachResetImportResultAction,
        userExportFilesAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        liveScoreCoachState: state.LiveScoreCoachState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreCoachImport);
