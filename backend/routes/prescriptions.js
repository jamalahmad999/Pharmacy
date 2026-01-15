const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const Prescription = require('../models/Prescription');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// Upload prescription to Cloudinary
router.post('/upload', upload.single('prescription'), async (req, res) => {
  try {
    console.log('Prescription upload request received');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Upload to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'lifepharmacy/prescriptions',
        resource_type: 'auto', // Handles both images and PDFs
        transformation: [
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ 
            error: 'Failed to upload prescription to Cloudinary',
            details: error.message 
          });
        }

        console.log('Cloudinary upload success:', result.secure_url);

        res.json({ 
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes
        });
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Error uploading prescription:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to upload prescription',
      message: error.message 
    });
  }
});

// Submit prescription order
router.post('/submit', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      address, 
      location,
      notes, 
      prescriptionUrls 
    } = req.body;

    if (!name || !phone || !address || !location || !prescriptionUrls || prescriptionUrls.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'phone', 'address', 'location', 'prescriptionUrls']
      });
    }

    // Save prescription to database
    const prescription = new Prescription({
      patientName: name,
      phone,
      address,
      location,
      notes,
      prescriptionImages: prescriptionUrls.map(url => ({
        url: url.url || url,
        publicId: url.publicId,
        format: url.format
      })),
      status: 'pending'
    });

    const savedPrescription = await prescription.save();
    
    res.json({
      success: true,
      message: 'Prescription submitted successfully',
      data: {
        prescriptionId: savedPrescription._id,
        orderId: 'PRX' + savedPrescription._id,
        name,
        phone,
        address,
        location,
        notes,
        prescriptionUrls,
        status: 'pending',
        createdAt: savedPrescription.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting prescription:', error);
    res.status(500).json({ error: 'Failed to submit prescription' });
  }
});

// Get all prescriptions (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const prescriptions = await Prescription.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Prescription.countDocuments(query);
    
    res.json({
      success: true,
      data: prescriptions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Get single prescription (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    
    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

// Update prescription status (admin)
router.put('/admin/:id/status', async (req, res) => {
  try {
    const { status, adminNotes, rejectionReason } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const update = { status, adminNotes };
    
    if (status === 'rejected' && rejectionReason) {
      update.rejectionReason = rejectionReason;
    }
    
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    
    res.json({
      success: true,
      message: 'Prescription status updated',
      data: prescription
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
});

module.exports = router;
