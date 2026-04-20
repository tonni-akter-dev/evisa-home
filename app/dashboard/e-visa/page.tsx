/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Country {
  name: string;
}

const AddEVisa = () => {
  const IMGBB_API_KEY = "4e40960ee867d0115a4c0049f45f4572";
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState({
    surname: "",
    firstName: "",
    dateOfBirth: "",
    citizenship: "",
    passportNumber: "",
    visaNumber: "",
    status: "",
    validity: "",
    visaType: "",
    visitPurpose: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  // Load countries
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/iamspruce/search-filter-painate-reactjs/main/data/countries.json",
    )
      .then((res) => res.json())
      .then((data) => {
        setCountries(Object.values(data));
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ImgBB Upload
  const uploadToImgBB = async (file: File) => {
    const formDataImg = new FormData();
    formDataImg.append("image", file);
    formDataImg.append("key", IMGBB_API_KEY);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formDataImg,
    });

    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("Upload failed");
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "Image must be under 2MB", "error");
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const url = await uploadToImgBB(file);
      setFormData((prev) => ({ ...prev, photo: url }));
      Swal.fire("Success", "Image uploaded", "success");
    } catch {
      Swal.fire("Error", "Upload failed", "error");
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://visa-consultancy-backend.onrender.com/api/evisa",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        Swal.fire("Success", "EVisa Added", "success");
        setFormData({
          surname: "",
          firstName: "",
          dateOfBirth: "",
          citizenship: "",
          passportNumber: "",
          visaNumber: "",
          status: "",
          validity: "",
          visaType: "",
          visitPurpose: "",
          photo: "",
        });
        router.push("/dashboard/e-visa-list");
        setPreview(null);
      } else {
        Swal.fire("Error", "Failed to add visa", "error");
      }
    } catch {
      Swal.fire("Error", "Server error", "error");
    }

    setLoading(false);
  };

  const inputClass =
    "w-full mt-1 px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 space-y-10"
      >
        {/* TITLE */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add New EVisa</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill all required information carefully
          </p>
        </div>

        {/* PERSONAL INFO */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Surname</label>
              <input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Citizenship</label>
              <select
                name="citizenship"
                value={formData.citizenship}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Passport Number</label>
              <input
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>

        {/* VISA INFO */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Visa Information
          </h3>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Visa Number</label>
              <input
                name="visaNumber"
                value={formData.visaNumber}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <input
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g., Pending, Approved, Rejected"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Validity Date</label>
              <input
                type="date"
                name="validity"
                value={formData.validity}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Visa Type</label>
              <input
                name="visaType"
                value={formData.visaType}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g., Tourist, Business, Student"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Visit Purpose</label>
              <input
                name="visitPurpose"
                value={formData.visitPurpose}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Photo Upload
          </h3>

          <div className="flex items-start gap-6">
            <div className="flex-1">
              <label className={labelClass}>Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files[0])
                }
                className="block w-full text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-400 mt-1">
                Max size: 2MB. Supported: JPG, PNG, GIF
              </p>
              {uploading && (
                <p className="text-blue-500 text-sm mt-2 flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Uploading...
                </p>
              )}
            </div>

            {preview && (
              <div className="shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Add EVisa"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddEVisa;
