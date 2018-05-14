/// Specific error used to signify that an item already exists with the a id
function ItemAlreadyExistsError(item, itemType) {
    Error.captureStackTrace(this);
    this.name = "ItemAlreadyExistsError";
    this.item = item;
    this.itemType = itemType;
    this.message = `The ${itemType ? itemType : "item"} already exists`;
 }
 ItemAlreadyExistsError.prototype = Object.create(Error.prototype);
 module.exports.ItemAlreadyExistsError = ItemAlreadyExistsError;
 
 /// Specific error used to signify that an item was not found
 function ItemNotFoundError(item, itemType) {
    Error.captureStackTrace(this);
    this.name = "ItemNotFoundError";
    this.item = item;
    this.itemType = itemType;
    this.message = `The ${itemType ? itemType : "item"} was not found`;
 }
 ItemNotFoundError.prototype = Object.create(Error.prototype);
 module.exports.ItemNotFoundError = ItemNotFoundError;
 
 /// Specific error used to signify that an item was expected to be unique but was not
 function ItemNotUniqueError(item, itemType) {
     Error.captureStackTrace(this);
     this.name = "ItemNotUniqueError";
     this.item = item;
     this.itemType = itemType;
     this.message = `The ${itemType ? itemType : "item"} was expected to be unique, but was not`;
  }
  ItemNotUniqueError.prototype = Object.create(Error.prototype);
  module.exports.ItemNotUniqueError = ItemNotUniqueError;
 
 /// Specific error used to signify that there are issues with Authentication
 function UnauthenticatedError(reason) {
     Error.captureStackTrace(this);
     this.name = "UnauthenticatedError";
     if(reason){
         this.reason = reason;
         this.message = "Access is denied: " + reason;   
     } else {
         this.message = "Access is denied.";
     }
 }
 UnauthenticatedError.prototype = Object.create(Error.prototype);
 module.exports.UnauthenticatedError = UnauthenticatedError;
 
 /// Specific error used to signify that there are issues with Authorisation (permission checks)
 function UnauthorisedError(reason) {
     Error.captureStackTrace(this);
     this.name = "UnauthorisedError";
     if(reason){
         this.reason = reason;
         this.message = "Not allowed: " + reason;   
     } else {
         this.message = "Not allowed.";
     }
 }
 UnauthorisedError.prototype = Object.create(Error.prototype);
 module.exports.UnauthorisedError = UnauthorisedError;
 
 /// Specific error used to signify that there was a validation error
 function ValidationError(failures) {
     Error.captureStackTrace(this);
     this.name = "ValidationError";
     this.message = "A validation error occured";
     this.validationFailures = failures;
 }
 ValidationError.prototype = Object.create(Error.prototype);
 
 ValidationError.fromSingleFailure = function(param, message, failureCode){
 
     let failure = {
         paramName: param,
         message: message
     };
 
     if(failureCode){
         failure.code = failureCode;
     }
 
     return new ValidationError([failure]);
 };
 module.exports.ValidationError = ValidationError;
 