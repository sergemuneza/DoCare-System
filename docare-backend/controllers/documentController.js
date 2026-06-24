const Document = require("../models/Document");

const Notification = require("../models/Notification");

// const uploadDocument = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const { documentType, patientId, description } = req.body;

//     const document = await Document.create({
//       patient: patientId || req.user._id,
//       uploadedBy: req.user._id,
//       documentType,
//       filePath: req.file.path,
//       fileName: req.file.originalname,
//       description: description || ""
//     });

//     await Notification.create({
//       user: patientId || req.user._id,
//       title: "New document uploaded",
//       message: `Dr. ${req.user.name} has uploaded a ${documentType.replace(/_/g, " ")} for you.`,
//       type: "document_uploaded",
//       link: "/patient/documents"
//     });

//     res.status(201).json(document);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { documentType, patientId, description, requestId } = req.body;

    const document = await Document.create({
      patient: patientId || req.user._id,
      uploadedBy: req.user._id,
      documentType,
      filePath: req.file.path,
      fileName: req.file.originalname,
      description: description || "",
      relatedRequest: requestId || null
    });

    if (requestId) {
      const DocumentRequest = require("../models/DocumentRequest");
      await DocumentRequest.findByIdAndUpdate(requestId, { status: "uploaded" });
      const request = await DocumentRequest.findById(requestId).populate("patient", "name");
      if (request) {
        await Notification.create({
          user: request.patient._id,
          title: "Document ready for download",
          message: `Your requested ${documentType.replace(/_/g, " ")} has been uploaded by Dr. ${req.user.name}. Click to view and download it.`,
          type: "request_uploaded",
          link: "/patient/documents"
        });
      }
    } else {
      await Notification.create({
        user: patientId || req.user._id,
        title: "New document uploaded",
        message: `Dr. ${req.user.name} has uploaded a ${documentType.replace(/_/g, " ")} for you.`,
        type: "document_uploaded",
        link: "/patient/documents"
      });
    }

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ patient: req.user._id })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ patient: req.params.patientId })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.deleteOne();
    res.json({ message: "Document removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getPatientDocuments,
  deleteDocument
};