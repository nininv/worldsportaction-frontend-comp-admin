import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
} from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';

import './styles.css';

import CustomPDFViewer from './PDFViewer';
import PDFDocument from './PDFDocument';
import MatchSheetTemplate from './MatchSheetTemplate';

const LiveScoreMatchSheetPreviewModal = (props) => {
    const {
        visible,
        matchDetails,
        match,
        matchTemplateTypes,
        organisation,
        modalTitle,
        handleOK,
        handleCancel
    } = props;

    return (
        <Modal
            {...props}
            className="live-score-match-sheet-modal"
            title={modalTitle}
            visible={visible}
            onOk={handleOK}
            onCancel={handleCancel}
            okText="Print"
            cancelText="Download"
            width="900px"
            footer={false}
        >
            <CustomPDFViewer>
                <PDFDocument
                    pages={
                        matchTemplateTypes.length > 0
                            ? matchTemplateTypes.map((type) => (
                                <MatchSheetTemplate
                                    templateType={type.description}
                                    organisation={organisation}
                                    matchDetails={matchDetails}
                                    match={match}
                                />
                            )) : []
                    }
                />
            </CustomPDFViewer>
        </Modal>
    );
};

LiveScoreMatchSheetPreviewModal.propTypes = {
    visible: PropTypes.bool,
    matchDetails: PropTypes.object,
    match: PropTypes.object,
    matchId: PropTypes.number,
    matchTemplateTypes: PropTypes.array,
    organisation: PropTypes.object,
    matchList: PropTypes.array,
    modalTitle: PropTypes.string,
    handleOK: PropTypes.func,
    handleCancel: PropTypes.func
};

LiveScoreMatchSheetPreviewModal.defaultProps = {
    visible: false,
    loading: false,
    matchDetails: null,
    matchId: null,
    matchTemplateTypes: [],
    organisation: null,
    matchList: [],
    modalTitle: 'LiveScores Match Sheet',
    handleOK: () => {},
    handleCancel: () => {}
};

export default LiveScoreMatchSheetPreviewModal;
