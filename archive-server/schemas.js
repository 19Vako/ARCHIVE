const { type } = require("@testing-library/user-event/dist/cjs/utility/type.js");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const DocumentCardScheme = new Schema ({
    docType: {
       type: String,
       default: ""
    },
    docNumber: {
       type: String,
       default: ""
    },
    docPDF: {
      type: String,
      default: ''
    },
    docCreateDate: {
       type: String,
       default: ""
    },
    docSigningDate: {
       type: String,
       default: ""
    },
    name: {
       type: String,
       default: ""                                 
    },
    validityPeriod: {
       type: String,
       default: ""
    },
    organizationName: {
       type: String,
       default: ""
    },
    organisationCode: {
       type: String,
       default: ""
    },
    counterpartyName: {
       type: String,
       default: ""
    },
    counterpartyCode: {
       type: String,
       default: ""
    },
    content: {
       type: String,
       default: ""                                                           
    },
    contractType: {
       type: String,
       default: ""
    },
    addition: {
       type: Array,
       default: []                                                           
    },
    author: {
       type: String,
       default: ""
    },
    createDate: {
       type: String,
       default: ""
    },
    cardLink: {
       type: String,
       default: ""                                                       
    }
})
const MgScheme = new Schema ({
    name: {
       type: String,
       default: ""
    },
    password: {
       type: String,
       default: ""
    },
    adminPassword: {
      type: String,
      default: ""
    }
})


const DocCardScheme = new Model('archive', DocumentCardScheme, 'archive');
const ManagerScheme = new Model('managers', MgScheme);
const AdminScheme = new Model('admin', MgScheme, 'admin');

module.exports = { DocCardScheme, ManagerScheme, AdminScheme };