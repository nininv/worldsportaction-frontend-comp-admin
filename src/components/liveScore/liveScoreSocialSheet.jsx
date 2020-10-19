import React, { Component } from "react";
import { Layout, Button, Table, Modal, Descriptions } from 'antd';
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import InputWithHead from "../../customComponents/InputWithHead"
import './liveScore.css';

const { confirm } = Modal;
const { Header, Footer, Content } = Layout;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: '#',
        dataIndex: '#',
        key: '#',
    },
    {
        title: 'Player Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Signature',
        dataIndex: 'signature',
        key: 'signature',
    },
    {
        title: '1',
        dataIndex: '1',
        key: '1',
    },
    {
        title: '2',
        dataIndex: '2',
        key: '2',
    },
    {
        title: '3',
        dataIndex: '3',
        key: '3',
    },
    {
        title: '4',
        dataIndex: '4',
        key: '4'
    },
];



class LiveScoreSocialSheet extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

        this.centerPassArray = []
        for (let i = 1; i < 80; i++) {
            this.centerPassArray.push(i)
        }
    }


    ///Match details
    matchDetailsContainer = (result) => {

        return (
            <div className="content-view pt-4 pb-0">
                <div className="drop-reverse">
                    <div className="col-sm">
                        <div className="row pl-1 pr-1">
                            <div className="col-sm" style={{ display: "flex", justifyContent: 'flex-start' }}>
                                <div>
                                    <span style={{ display: 'flex', }} className="live-score-profile-user-name">Brisban City Netball Association</span>
                                    <span style={{ display: 'flex', }} className="live-score-profile-user-name">Social Scoresheet</span>
                                </div>
                            </div>
                            <div className="col-sm" style={{ display: "flex", justifyContent: 'flex-end' }}>
                                <img
                                    src={AppImages.squareImage}
                                    height="80"
                                    width="80"
                                    name="image"
                                    onError={ev => {
                                        ev.target.src = AppImages.squareImage;
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }


    /// Round and Teams container
    roundAndteamsContainer = () => {
        return (
            <div className="match-details-rl-padding row mt-5">
                <div className="col-sm" style={{ flexDirection: "column", display: "flex" }}>
                    <div className="pl-5" style={{ display: "flex", flexDirection: "column" }}>
                        <span className="year-select-heading">Round 1</span>
                        <span className='year-select-heading mt-2'>Venue : John Fisher Court 1</span>
                        <span className='year-select-heading mt-2'>H: Team 1</span>
                    </div>

                    <div className="comp-dash-table-view mt-2">
                        <div>
                            <Table className="home-dashboard-table pt-2" columns={columns} dataSource={[]} pagination={false} />
                        </div>

                    </div>
                </div>
                <div className="col-sm" style={{ flexDirection: "column", display: "flex", alignContent: "center" }}>
                    <div className="pl-5" style={{ display: "flex", flexDirection: "column" }}>
                        <span className="year-select-heading">Date: 08/06/2020</span>
                        <span className='year-select-heading mt-2'>Time : 10:00am</span>
                        <span className='year-select-heading mt-2'>H: Team 2</span>
                    </div>

                    <div className="comp-dash-table-view mt-2">
                        <div>
                            <Table className="home-dashboard-table pt-2" columns={columns} dataSource={[]} pagination={false}
                            />
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    /// Center pass conatainer

    progressiveScoreContainer = () => {
        return (
            <div className="row match-details-rl-padding  mt-5" style={{ display: "flex", flexDirection: "row" }}>
                <div className="col-sm">
                    <div className="progressive-container">
                        {
                            this.centerPassArray.map((item) => {
                                return (
                                    // <div className="progressive-container">
                                    <span className='year-select-heading pl-2'>{item}</span>
                                    // </div>
                                )
                            })
                        }

                    </div>
                </div>

                <div className="col-sm">
                    <div className="progressive-container">
                        {this.centerPassArray.map((item) => {
                            return (
                                // <div>
                                <span className='year-select-heading pl-2'>{item}</span>
                                // </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <Layout>
                    {/* {this.headerView()} */}
                    <Content className="container, pt-5">
                        <div className="formView">
                            {this.matchDetailsContainer()}
                            {this.roundAndteamsContainer()}
                            {this.progressiveScoreContainer()}
                        </div>
                    </Content>

                </Layout>
            </div>
        )
    }
}
export default LiveScoreSocialSheet
