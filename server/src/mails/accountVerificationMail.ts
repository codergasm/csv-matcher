const accountVerificationMail = (email, token) => {
    return {
        to: email,
        from: `RowMatcher <${process.env.EMAIL_ADDRESS}>`,
        subject: 'Aktywuj swoje konto w RowMatcher.com',
        html: `<div>
        <h2>
            Dziękujemy, że jesteś z nami!
        </h2>
        <p>
            Oto Twój link aktywacyjny:
        </p>
        <a href="${process.env.WEBSITE_URL}/weryfikacja?token=${token}">
            ${process.env.WEBSITE_URL}/weryfikacja?token=${token}
        </a>
    </div>`
    }
}

export default accountVerificationMail;
