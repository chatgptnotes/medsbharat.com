'use client';

import { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export default function UploadPrescriptionPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  const MAX_FILES = 5;
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setError('');

    // Check file count
    if (files.length + newFiles.length > MAX_FILES) {
      setError(`You can only upload up to ${MAX_FILES} files`);
      return;
    }

    // Validate each file
    const validFiles: UploadedFile[] = [];
    for (const file of newFiles) {
      // Check file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, and PDF files are allowed');
        continue;
      }

      // Check file size
      if (file.size > MAX_SIZE) {
        setError(`File ${file.name} is too large. Max size is 5MB`);
        continue;
      }

      // Create preview
      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : '';

      validFiles.push({
        file,
        preview,
        id: Math.random().toString(36).substr(2, 9),
      });
    }

    setFiles([...files, ...validFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      setError('Please upload at least one prescription');
      return;
    }

    if (!contactNumber) {
      setError('Please enter your contact number');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload to Cloudinary via API route
      const uploadedUrls: string[] = [];

      for (const { file } of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-prescription', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Upload failed');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      // Save prescription data to database
      const prescriptionData = {
        patientName: patientName || 'Not provided',
        contactNumber,
        instructions: instructions || '',
        prescriptionUrls: uploadedUrls,
        uploadedAt: new Date().toISOString(),
      };

      // TODO: Call API to save prescription data
      console.log('Prescription data:', prescriptionData);

      setUploadSuccess(true);
      setFiles([]);
      setPatientName('');
      setContactNumber('');
      setInstructions('');

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/products';
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload prescriptions. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-orange-500">
            Home
          </Link>
          <span className="material-icons text-gray-400 text-sm">chevron_right</span>
          <span className="text-gray-900 font-medium">Upload Prescription</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Upload className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Upload Prescription
              </h1>
              <p className="text-gray-600">
                Upload your doctor's prescription and we'll deliver the medicines to your doorstep.
                Our pharmacists will verify your prescription before processing the order.
              </p>
            </div>
          </div>
        </div>

        {uploadSuccess ? (
          /* Success Message */
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Prescription Uploaded Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you! Our pharmacist will review your prescription and contact you shortly.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to products page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Upload Zone */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Your Prescription
              </h2>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-400'
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drag & drop your prescription here
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button type="button" onClick={() => document.getElementById('file-input')?.click()}>
                    Choose Files
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Accepted formats: JPG, PNG, PDF (Max 5MB per file, up to 5 files)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">{error}</p>
                </div>
              )}

              {/* Uploaded Files List */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Uploaded Files ({files.length}/{MAX_FILES})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {files.map((uploadedFile) => (
                      <div
                        key={uploadedFile.id}
                        className="border border-gray-200 rounded-lg p-4 flex items-center gap-3"
                      >
                        {uploadedFile.preview ? (
                          <img
                            src={uploadedFile.preview}
                            alt="Preview"
                            className="h-16 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {uploadedFile.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Patient Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Patient Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name (Optional)
                  </label>
                  <Input
                    id="patient-name"
                    type="text"
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="contact-number"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="instructions"
                  rows={3}
                  placeholder="Any specific requirements or delivery instructions..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={uploading || files.length === 0}
              >
                {uploading ? (
                  <>
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload & Continue
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-4">
                By uploading, you agree to our terms and privacy policy
              </p>
            </div>
          </form>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <span className="material-icons text-blue-600">verified_user</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Secure</h3>
            <p className="text-sm text-gray-600">
              Your prescription is encrypted and stored securely
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <span className="material-icons text-green-600">local_pharmacy</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Verified by Pharmacist</h3>
            <p className="text-sm text-gray-600">
              Licensed pharmacists review every prescription
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <span className="material-icons text-purple-600">local_shipping</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Get your medicines delivered within 24-48 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
