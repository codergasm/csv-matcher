import React, {useContext} from 'react';
import {TranslationContext} from "../App";
import InputPrimary from "./InputPrimary";
import ErrorInfo from "./ErrorInfo";

const InvoiceForm = ({invoice, setInvoice, isInvoiceApplicable, setIsInvoiceApplicable, setInvoiceError, invoiceError}) => {
    const { content } = useContext(TranslationContext);

    const handleChange = (field, value) => {
        setInvoice(prevState => {
            return {
                ...prevState,
                [field]: value
            }
        });
    }

    return <div className="form invoiceForm">
        <label className="label--marginLeft label--invoice">
            <button className={isInvoiceApplicable ? "btn btn--check btn--check--selected" : "btn btn--check"}
                    onClick={() => { setIsInvoiceApplicable(p => !p); }}>

            </button>
            {content.invoiceCheckbox}
        </label>

        {isInvoiceApplicable ? <div className="invoiceForm__inner">
            <InputPrimary label={content.companyName}
                          placeholder={content.companyName}
                          value={invoice.name}
                          type={'text'}
                          setValue={(e) => { setInvoiceError(false); handleChange('name', e); }} />
            <InputPrimary label={content.companyNIP}
                          placeholder={content.companyNIP}
                          value={invoice.nip}
                          type={'text'}
                          setValue={(e) => { setInvoiceError(false); handleChange('nip', e); }} />
            <InputPrimary label={content.companyStreetName}
                          placeholder={content.companyStreetName}
                          value={invoice.street_name}
                          type={'text'}
                          setValue={(e) => { setInvoiceError(false); handleChange('street_name', e); }} />
            <InputPrimary label={content.companyStreetNumber}
                          placeholder={content.companyStreetNumber}
                          value={invoice.street_number}
                          type={'text'}
                          setValue={(e) => { setInvoiceError(false); handleChange('street_number', e); }} />
            <InputPrimary label={content.companyPostalCode}
                          placeholder={content.companyPostalCode}
                          value={invoice.postal_code}
                          type={'text'}
                          setValue={(e) => { setInvoiceError(false); handleChange('postal_code', e); }} />

            {invoiceError ? <ErrorInfo content={content.invoiceError} /> : ''}
        </div> : ''}
    </div>
};

export default InvoiceForm;
