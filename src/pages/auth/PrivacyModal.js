import React from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
 } from 'reactstrap'

const PrivacyModal = ({isOpen, toggle}) => {
	return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
    >
      <ModalHeader>PRIVACY POLICY</ModalHeader>
      <ModalBody>
        The Avenir Privacy Policies govern your use of the Services,
        which allow self-directed Users to: (i) designate Selected
        Amounts from the Users’ connected accounts for Coinbits to use;
        (ii) designate Coinbits, as the User’s agent, to automatically
        purchase and own cryptocurrency for the equivalent value of the
        Selected Amount, and deposit and hold purchased cryptocurrency
        via Coinbits’ own wallet that must be accessed with a password
        or by maintaining a private key (“Digital Wallet”); and (iii)
        receive the Withdrawal Amount from Coinbits, who will remit to
        the User the equivalent value in US Dollars of cryptocurrency
        purchased and owned by Coinbits from User’s Selected Amount upon
        User’s request. Users will not own cryptocurrency through the
        Services, and at no point will Coinbits act as a custodian of
        any User- owned cryptocurrency. Coinbits solely acts as Users’
        designated agent with limited actual authority to purchase
        cryptocurrency that Coinbits owns outright by automatically
        rounding up pre-completed transactions in the Selected Amount,
        and Users solely receive the right to view the transactions
        performed on and the value of the User Account and the right to
        receive the dollar equivalent amount of cryptocurrency purchased
        by Coinbits using the Selected Amount by Withdrawal Request.
        Users have no right or discretion to withdraw, pledge, trade, or
        otherwise dispose of any cryptocurrency held by Coinbits. Any
        access to and use of Coinbits’ website, mobile applications, and
        any other online services provided to automatically debit and
        credit User’s designated account(s) (as part of the Services)
        will be subject to and governed by the Coinbits Terms and
        Policies. You understand that we may revise, update, and add new
        Coinbits Terms and Policies in our sole discretion, and may
        update the existing Coinbits Terms and Policies from time to
        time as described therein. Where appropriate, we may seek to
        provide advance notice before updated Terms and Policies become
        effective. You agree that we may notify you of the updated Terms
        and Policies by posting them on the Services (such as on our
        website), and that your use of the Services after the effective
        date of the updated Terms and Policies (or engaging in such
        other conduct as we may reasonably specify) constitutes your
        agreement to the updated Terms and Policies. It is your
        responsibility to check the Coinbits Terms and Policies posted
        on the Services periodically so that you are aware of any
        changes, as they are binding on you. The Coinbits Terms and
        Policies do not constitute a prospectus of any sort, are not a
        solicitation for investment and do not pertain in any way to an
        offering of securities in any jurisdiction. It is a description
        of the Services’ terms and conditions.
      </ModalBody>
    </Modal>
  )
}

export default PrivacyModal