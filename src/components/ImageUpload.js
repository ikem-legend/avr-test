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
  Button
} from 'reactstrap'
import classnames from 'classnames'
import DefaultImage from '../assets/images/default-image-upload.png'
import Loader from '../assets/images/spin-loader.gif'
import ImagePicker from './ImagePicker'

const ImageUpload = ({profileImgModal, profileImg, toggleProfileImgUpload, handleProfileImg, submitProfileImg, loadingImgUpload}) => {
  const [activeTab, setActiveTab] = useState('1')
	return (
		<Modal isOpen={profileImgModal} toggle={toggleProfileImgUpload} backdrop="static" centered size="lg" className="image-upload">
      <ModalHeader className="account-link-header mx-auto pb-0">Upload Profile Image</ModalHeader>
		  <ModalBody className="text-center">
		    <Row>
		      <Col md={12}>
		        <p className="mb-0">Please select your preferred profile image. </p>
		      </Col>
		    </Row>
        <div className="tab-container">
          <Row className="nav-container">
            <Col md={12}>
              <Nav tabs className="py-2">
                <Col md={12}>
                  <NavItem>
                    <NavLink
                      className={classnames({active: activeTab === '1'})}
                      onClick={() => {
                        setActiveTab('1')
                      }}
                    >
                      Profile Image
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
                    <Col size="12">
                      <img
                        alt="puImg"
                        src={profileImg && profileImg.src ? profileImg.src : profileImg ? profileImg : DefaultImage}
                        className="img-fluid"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <ImagePicker
                        onUpload={handleProfileImg}
                        label="Click here to select the image to upload"
                        width="100%"
                      />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </div>
		    {loadingImgUpload ? (
		      <img
		        src={Loader}
		        alt="loader"
		        style={{height: '40px', marginTop: '20px'}}
		      />
		    ) : (
          <Row>
            <Col md={{offset:3, size: 3}} xs={6}>
              <Button onClick={toggleProfileImgUpload} block color="inv-blue" className="mt-2 float-right">Cancel</Button>
            </Col>
            <Col md={3} xs={6}>
    		      <Button onClick={submitProfileImg} block color="inv-blue" className="mt-2 float-left">Upload Profile Image</Button>
            </Col>
          </Row>
		    )}
		  </ModalBody>
		</Modal>
	)
}

export default ImageUpload