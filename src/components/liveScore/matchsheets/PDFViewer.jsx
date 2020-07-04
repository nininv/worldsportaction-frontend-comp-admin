import React from 'react';
import PropTypes from 'prop-types';
import { PDFViewer } from '@react-pdf/renderer';

const CustomPDFViewer = (props) => {
    const { children } = props;

    return (
        <PDFViewer className="custom-pdf-viewer" width="100%">
            {children}
        </PDFViewer>
    );
};

CustomPDFViewer.propTypes = {
    children: PropTypes.node,
};

CustomPDFViewer.defaultProps = {
    children: undefined,
};

export default PDFViewer;
