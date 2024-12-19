import React, { useState } from "react";
import { usePaymentInputs, PaymentInputsWrapper } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const Cardpay = ({sendDetails}) => {
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [inputErrors, setInputErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    wrapperProps,
    getCardImageProps,
  } = usePaymentInputs();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change detected: ${name} = ${value}`);

    if (name === "expiryDate") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 4); // Keep only digits, max 4
      setCardDetails((prevDetails) => ({
        ...prevDetails,
        [name]: formattedValue,
      }));
    } else {
      setCardDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const validateCardNumber = (cardNumber) => {
    if (!/^4\d{12,15}$/.test(cardNumber)) {
      console.log("Invalid card number:", cardNumber);
      return "Invalid card number. Please check your input.";
    }
    return "";
  };

  const validateExpiryDate = (expiryDate) => {
    if (!/^(0[1-9]|1[0-2])\d{2}$/.test(expiryDate)) {
      console.log("Invalid expiry date:", expiryDate);
      return "Invalid expiry date. Use MMYY format.";
    }
    return "";
  };

  const validateCVC = (cvc) => {
    if (!/^\d{3}$/.test(cvc)) {
      console.log("Invalid CVC:", cvc);
      return "CVC must be 3 digits.";
    }
    return "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting payment data...");
    console.log("Card Details:", cardDetails);

    const cardNumberError = validateCardNumber(cardDetails.cardNumber);
    const expiryDateError = validateExpiryDate(cardDetails.expiryDate);
    const cvcError = validateCVC(cardDetails.cvc);

    const errors = { cardNumberError, expiryDateError, cvcError };
    console.log("Validation results:", errors);

    if (cardNumberError || expiryDateError || cvcError) {
      console.log("Validation failed, setting errors...");
      setInputErrors({
        cardNumber: cardNumberError,
        expiryDate: expiryDateError,
        cvc: cvcError,
      });
      return;
    }

    console.log("Validation passed, processing payment...");
    setPaymentSuccess(true);
    sendDetails(cardDetails);
    setPaymentError("");
    console.log("Payment Data:", cardDetails);
  };

  return (
    <div>
      {paymentError && <Alert variant="danger">{paymentError}</Alert>}
      {paymentSuccess && <Alert variant="success">Payment Successful!</Alert>}

      <form onSubmit={onSubmit} style={{ display: "flex", columnGap: "10px" }}>
        <PaymentInputsWrapper {...wrapperProps}>
          <svg {...getCardImageProps({ images })} />
          <input
            {...getCardNumberProps()}
            placeholder="Card Number"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
          />
        </PaymentInputsWrapper>
        {inputErrors.cardNumber && (
          <Alert variant="danger">{inputErrors.cardNumber}</Alert>
        )}

        <PaymentInputsWrapper {...wrapperProps}>
          <input
            {...getExpiryDateProps()}
            placeholder="MMYY"
            name="expiryDate"
            value={cardDetails.expiryDate}
            onChange={handleInputChange}
            maxLength="4" // Enforce a maximum of 4 digits
          />
        </PaymentInputsWrapper>
        {inputErrors.expiryDate && (
          <Alert variant="danger">{inputErrors.expiryDate}</Alert>
        )}

        <PaymentInputsWrapper {...wrapperProps}>
          <input
            {...getCVCProps()}
            placeholder="CVC"
            name="cvc"
            value={cardDetails.cvc}
            onChange={handleInputChange}
          />
        </PaymentInputsWrapper>
        {inputErrors.cvc && <Alert variant="danger">{inputErrors.cvc}</Alert>}

        <Button type="submit" variant="primary">
          Proceed to Payment
        </Button>
      </form>
    </div>
  );
};

export default Cardpay;
