const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = (req, res) => {
  res.send({ message: "create handler" });
};
exports.findAll = (req, res) => {
  res.send({ message: "findAll handler" });
};
exports.findOne = (req, res) => {
  res.send({ message: "findOne handler" });
};
exports.update = (req, res) => {
  res.send({ message: "update handler" });
};
exports.delete = (req, res) => {
  res.send({ message: "delete handler" });
};
exports.deleteAll = (req, res) => {
  res.send({ message: "deleteAll handler" });
};
exports.findAllFavorite = (req, res) => {
  res.send({ message: "findAllFavorite handler" });
};
// creat and save a new contact
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name cannot empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating a contact")
    );
  }
};
// retrieve all contacts from the database
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
  return res.send(documents);
};
//find a single contact from the database with an id
exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "Error retrieving contact with id = ${req.params.id}")
    );
  }
};
// update a contact by the id in the resquest
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, "Error updating contact with id = ${req.params.id}")
    );
  }
};
// delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, "Error deleting contact with id = ${req.params.id}")
    );
  }
};
// findall favorite contacts of user
exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.find({ favorite: true });
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    );
  }
};

//delete all contacts of user
exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll({});
    return res.send(`${deletedCount} contacts were deleted successfully`);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while deleting all contacts")
    );
  }
};
