const translatePaymentStatus = (status, statuses) => {
    if(status === 'pending') return statuses[0]
    else return statuses[1];
}

export default translatePaymentStatus;
