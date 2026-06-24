const DocumentRequest = require("../models/DocumentRequest");

const createRequest = async (req, res) => {
  try {
    const { documentType, reason } = req.body;

    const request = await DocumentRequest.create({
      patient: req.user._id,
      requestedBy: req.user._id,
      documentType,
      reason
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await DocumentRequest.find()
      .populate("patient", "name email")
      .populate("requestedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await DocumentRequest.find({ patient: req.user._id })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Notification = require("../models/Notification");

// const updateRequestStatus = async (req, res) => {
//   try {
//     const request = await DocumentRequest.findById(req.params.id)
//       .populate("patient", "name");
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     request.status = req.body.status;
//     await request.save();

//     const messages = {
//       approved: {
//         title: "Document request approved",
//         message: `Your request for a ${request.documentType.replace(/_/g, " ")} has been approved.`,
//         type: "request_approved"
//       },
//       rejected: {
//         title: "Document request rejected",
//         message: `Your request for a ${request.documentType.replace(/_/g, " ")} was not approved.`,
//         type: "request_rejected"
//       },
//       uploaded: {
//         title: "Document uploaded",
//         message: `Your requested ${request.documentType.replace(/_/g, " ")} has been uploaded.`,
//         type: "document_uploaded"
//       }
//     };

//     if (messages[req.body.status]) {
//       await Notification.create({
//         user: request.patient._id,
//         ...messages[req.body.status]
//       });
//     }

//     res.json(request);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const updateRequestStatus = async (req, res) => {
  try {
    const request = await DocumentRequest.findById(req.params.id)
      .populate("patient", "name");

    if (!request) return res.status(404).json({ message: "Request not found" });

    const previousStatus = request.status;
    request.status = req.body.status;
    await request.save();

    const typeLabel = request.documentType.replace(/_/g, " ");

    const notificationMap = {
      approved: {
        title: "Document request approved",
        message: `Your request for a ${typeLabel} has been approved. You can now download it from My Documents.`,
        type: "request_approved",
        link: "/patient/documents"
      },
      rejected: {
        title: "Document request rejected",
        message: `Your request for a ${typeLabel} was reviewed and could not be fulfilled at this time.`,
        type: "request_rejected",
        link: "/patient/requests"
      },
      uploaded: {
        title: "Document ready for download",
        message: `Your requested ${typeLabel} has been uploaded by your doctor. Click to view and download it.`,
        type: "request_uploaded",
        link: "/patient/documents"
      }
    };

    if (notificationMap[req.body.status]) {
      await Notification.create({
        user: request.patient._id,
        ...notificationMap[req.body.status]
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus
};