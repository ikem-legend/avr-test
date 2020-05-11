import React from 'react'
import {
  Progress,
  CustomInput
} from 'reactstrap'
import classnames from 'classnames'
import {getLoggedInUser} from '../../helpers/authUtils'
import defaultProfilePic from '../../assets/images/users/default-user-avatar.svg'

export const AccountProfile = ({user, bankAccountSetup, total, multiplierSetup, documentUpload, documentUploadStatus, documentUploadError, topup, image}) => {
  const backupImage = getLoggedInUser().myImage
  return (
    <div className="account-profile">
      <h6>My Account</h6>
      <div className="media user-profile user-avatar mt-2">
        <img
          src={image ? image : backupImage === '' ? defaultProfilePic : backupImage}
          className="avatar-lg rounded-circle img-fluid mr-2"
          alt="Avenir"
        />
      </div>
      <h4 data-testid="username-display" className="mb-4">
        {user.myFirstName} {user.myLastName}
      </h4>
      <hr />
      <span data-testid="email-display">{user.myEmailAddress}</span>
      <p data-testid="phone-display" className="mt-1 mb-3">
        <span>{user.myPhoneNumber}</span>
      </p>
      <div className="mt-3">
        Account Setup - <span className="setup">{total}%</span>
      </div>
      <Progress value={total} className="setup-level" />
      <hr />
      <div className="reg-status mb-3">
        <CustomInput
          type="checkbox"
          id="reg-stage-1"
          label="Link my bank account and cards"
          checked={bankAccountSetup}
          readOnly
        />
        <span className={classnames({complete: bankAccountSetup === true}, {incomplete: bankAccountSetup === false}, 'ml-4 font-weight-bold')}>
          {bankAccountSetup ? 'Complete' : 'Incomplete'}
        </span>
      </div>
      <div className="reg-status mb-3">
        <CustomInput
          type="checkbox"
          id="reg-stage-3"
          label="Modify round-up multiplier"
          checked={multiplierSetup}
          readOnly
        />
        <span className={classnames({complete: multiplierSetup === true}, {incomplete: multiplierSetup === false}, 'ml-4 font-weight-bold')}>
          {multiplierSetup ? 'Complete' : 'Incomplete'}
        </span>
      </div>
      <div className="reg-status mb-3">
        <CustomInput
          type="checkbox"
          id="reg-stage-4"
          label="Upload User ID"
          checked={documentUpload === true && documentUploadStatus === 'APPROVED'}
          readOnly
        />
        <span className={classnames({complete: documentUpload === true && documentUploadStatus === 'APPROVED'}, {incomplete: documentUpload === false}, 'ml-4 font-weight-bold')}>
          {documentUpload === true && documentUploadStatus === 'APPROVED' ? 'Complete' : 'Incomplete'} - {documentUploadStatus ? documentUploadStatus === 'PENDING' ? 'Awaiting Verification' : documentUploadStatus : ''}
        </span>
        <span className={classnames('ml-4 font-weight-bold')}>
          {documentUploadError ? documentUploadError : null}
        </span>
      </div>
      <div className="reg-status">
        <CustomInput
          type="checkbox"
          id="reg-stage-5"
          label="Make your first top-up"
          checked={topup}
          readOnly
        />
        <span className={classnames({complete: topup === true}, {incomplete: topup === false}, 'ml-4 font-weight-bold')}>
          {topup ? 'Complete' : 'Incomplete'}
        </span>
      </div>
    </div>
  )
}