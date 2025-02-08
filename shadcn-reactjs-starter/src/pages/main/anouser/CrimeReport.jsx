import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Upload, X } from "lucide-react";

const CrimeReport = () => {
  const [formData, setFormData] = useState({
    title:'',
    location: '',
    crimeType: '',
    date: '',
    time: '',
    description: '',
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create FormData to handle files
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });
    files.forEach(file => {
      formDataToSubmit.append('evidence', file);
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', formData);
    console.log('Files:', files);
    
    setIsSubmitting(false);
    setFiles([]);
    setFormData({
      name: '',
      phone: '',
      email: '',
      location: '',
      crimeType: '',
      date: '',
      time: '',
      description: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500');
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Report a Crime</CardTitle>
            <CardDescription className="text-center">
              Your information will be kept confidential and handled with utmost privacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">For emergencies, please call 112 immediately</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}

              {/* Incident Details */}
              <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Title</h3>
                <Input
                  name="title"
                  placeholder="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <h3 className="font-medium text-gray-900">Incident Details</h3>
                <Input
                  name="location"
                  placeholder="Location of Incident"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    name="crimeType"
                    value={formData.crimeType}
                    onValueChange={(value) => handleChange({ target: { name: 'crimeType', value } })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type of Crime" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="cybercrime">Cybercrime</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <Textarea
                  name="description"
                  placeholder="Please describe the incident in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  className="h-32"
                  required
                />
              </div>

              {/* Evidence Upload */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Evidence (Optional)</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 transition-colors duration-200"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <div className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag and drop files here, or click to select files
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports: JPG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                </div>

                {/* File Preview */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By submitting this form, you acknowledge that all information provided is true and accurate to the best of your knowledge.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrimeReport;