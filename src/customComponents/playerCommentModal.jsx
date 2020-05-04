import React from 'react';
import { Input, Modal, } from 'antd';
const { TextArea } = Input;
class PlayerCommentModal extends React.Component {
    render() {
        const { heading, placeholder, name, handleBlur, finalGradeId, owner, proposedGradeID, OwnCreatedComment, affilateCreatedComment, affilate, onChange, type, value, modalTitle, visible, onOK, onCancel, ownnerComment, affilateComment } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={onOK}
                    onCancel={onCancel}
                // cancelButtonProps={{ style: { display: finalGradeId !== null && 'none' } }}
                >

                    {owner
                        &&
                        <div>
                            <div className="col-sm pl-0 pb-2">
                                {owner !== null &&
                                    < span style={{ fontFamily: "bold", fontSize: 18, paddingRight: 2 }} className={`comment-heading`}>{owner}{" "}</span>
                                }
                                {OwnCreatedComment !== null &&
                                    < span style={{ fontFamily: "bold", fontSize: 18, paddingRight: 2 }} className={`comment-heading`}>{"("}{OwnCreatedComment}{")"}{" "}{":"}{"   "}</span>
                                }
                                {ownnerComment !== null &&
                                    < span className={`comment-heading`}>{ownnerComment}</span>
                                }

                            </div>
                            <div>

                            </div>
                        </div>
                    }
                    {/* {proposedGradeID !== null &&
                        affilate
                        &&
                        <div className="col-sm pl-0 pb-2">
                            {affilate !== null &&
                                < span style={{ fontFamily: "bold", fontSize: 18, paddingRight: 2 }} className={`comment-heading`}>{affilate}{" "}</span>
                            }
                            {affilateCreatedComment !== null &&
                                < span style={{ fontFamily: "bold", fontSize: 18, paddingRight: 2 }} className={`comment-heading`}>{"("}{affilateCreatedComment}{')'}{" "}{":"}{"   "}</span>
                            }
                            {affilateComment !== null &&
                                < span className={`comment-heading`}>{affilateComment}</span>
                            }
                        </div>
                    } */}

                    <TextArea
                        className="textAreaInput"
                        placeholder={placeholder}
                        allowClear
                        name={name}
                        // handleChange={(name) => alert(name)}
                        onBlur={handleBlur}
                        onChange={onChange}
                        type={type}
                        value={value}
                        // defaultValue="xyz"
                        {...this.props}
                    />

                </Modal >
            </div >
        )
    }
}


export default PlayerCommentModal;