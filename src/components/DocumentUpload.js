import React, {useState} from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Col,
  Button,
} from 'reactstrap'
import classnames from 'classnames'
import DefaultImage from '../assets/images/default-image-upload.png'
import Loader from '../assets/images/spin-loader.gif'
import ImagePicker from './ImagePicker'

const DocumentUpload = ({
  userDocumentModal,
  userDocument,
  specifyId,
  toggleImgUpload,
  handleUserDocument,
  submitUserDocument,
  loadingUpload,
}) => {
  const [activeTab, setActiveTab] = useState('1')
  return (
    <Modal
      isOpen={userDocumentModal}
      toggle={toggleImgUpload}
      backdrop="static"
      centered
      size="lg"
      className="image-upload"
    >
      <ModalHeader className="account-link-header mx-auto pb-0">
        Upload User Identification
      </ModalHeader>
      <ModalBody className="text-center">
        <Row>
          <Col md={12}>
            <p className="mb-0">
              We need your means of identification to verify your identity for
              security purposes.{' '}
            </p>
            <p>
              This information is encrypted and not stored on Avenir servers
            </p>
          </Col>
        </Row>
        <div className="tab-container">
          <Row className="nav-container">
            <Col md={12}>
              <Nav tabs className="py-2">
                <Col md={6}>
                  <NavItem>
                    <NavLink
                      className={classnames({active: activeTab === '1'})}
                      onClick={() => {
                        setActiveTab('1')
                        specifyId(1)
                      }}
                    >
                      Upload Driver&apos;s License/Identity Card
                    </NavLink>
                  </NavItem>
                </Col>
                <Col md={6}>
                  <NavItem>
                    <NavLink
                      className={classnames({active: activeTab === '2'})}
                      onClick={() => {
                        setActiveTab('2')
                        specifyId(2)
                      }}
                    >
                      Upload Driver&apos;s Intl. Passport
                    </NavLink>
                  </NavItem>
                </Col>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-4">
                  <Row>
                    {userDocument.slice(0, 2).map((image, idx) => (
                      <Col size="6" key={idx} className="selected-image">
                        <img
                          alt="puImg"
                          src={
                            image && image.src
                              ? image.src
                              : image
                              ? image
                              : DefaultImage
                          }
                          className="img-fluid"
                        />
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col md={12}>
                      <ImagePicker
                        onUpload={handleUserDocument}
                        multiple
                        label="Click here to select the Front & Back or drag and drop to upload"
                        width="100%"
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2" className="p-4">
                  <Row>
                    {userDocument.slice(0, 1).map((image, idx) => (
                      <Col size="6" key={idx}>
                        <img
                          alt="puImg"
                          src={
                            image && image.src
                              ? image.src
                              : image
                              ? image
                              : DefaultImage
                          }
                          className="img-fluid"
                        />
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col md={12}>
                      <ImagePicker
                        onUpload={handleUserDocument}
                        multiple
                        label="Click here to select the Front & Back or drag and drop to upload"
                        width="100%"
                      />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </div>
        <Row>
          <Col md={12} className="text-center">
            <p className="mb-1 font-italic text-muted">
              PS - You will be unable to make cryptocurrency investments without
              an ID
            </p>
          </Col>
        </Row>
        {loadingUpload ? (
          <img
            src={Loader}
            alt="loader"
            style={{height: '40px', marginTop: '20px'}}
          />
        ) : (
          <Row>
            <Col md={{offset: 3, size: 3}} xs={6}>
              <Button
                onClick={toggleImgUpload}
                block
                color="inv-blue"
                className="mt-2 float-right"
              >
                Cancel
              </Button>
            </Col>
            <Col md={3} xs={6}>
              <Button
                onClick={submitUserDocument}
                block
                color="inv-blue"
                className="mt-2 float-left"
              >
                Upload ID
              </Button>
            </Col>
          </Row>
        )}
      </ModalBody>
    </Modal>
  )
}

export default DocumentUpload
