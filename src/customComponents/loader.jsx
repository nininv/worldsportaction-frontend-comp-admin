import React, { Component } from "react";
import { Modal, Spin } from "antd";

class Loader extends Component {
    render() {
        return (
            <Modal
                // title="WSA 1"
                visible={this.props.visible}
                // onOk={this.handleOk}
                // onCancel={this.handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                centered
                width={0}
                height={0}
                closable={false}
                footer={null}
            >
                <Spin tip="Loading..."  delay={this.props.delay} />
            </Modal>
        );
    }
}

export default Loader;
