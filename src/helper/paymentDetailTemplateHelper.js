const paymentDetailTemplateHelper = {}

paymentDetailTemplateHelper.itemDetailTemplate = {
    name: "",
    description: "",
    price: 0,
    quantity: 1
}

paymentDetailTemplateHelper.itemHeaderTemplate = {
    type: "",
    title: "",
    sportType: "",
    file: {
        name: "",
        type: "",
    }
}

paymentDetailTemplateHelper.paymentTemplate = {
    subtotal: 0,
    adminFee: 0,
    promo: 0
}

paymentDetailTemplateHelper.paymentDetailTemplate = {
    payment : this.paymentTemplate,
    itemHeader : this.itemHeaderTemplate,
    itemDetails: [this.itemDetailTemplate]
}

module.exports = paymentDetailTemplateHelper