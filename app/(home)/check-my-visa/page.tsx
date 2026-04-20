/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface VisaData {
  _id: string;
  surname: string;
  firstName: string;
  dateOfBirth: string;
  citizenship: string;
  passportNumber: string;
  visaNumber: string;
  status: string;
  validity: string;
  visaType: string;
  visitPurpose: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export default function VisaCheckPage() {
  const [visaNumber, setVisaNumber] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [result, setResult] = useState<VisaData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random CAPTCHA code - UPPERCASE ONLY
  const generateCaptchaCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Draw CAPTCHA on canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newCode = generateCaptchaCode();
    setCaptchaCode(newCode);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw noise lines
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
      ctx.stroke();
    }

    // Draw text - all uppercase
    ctx.font = "bold 28px monospace";
    for (let i = 0; i < newCode.length; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 45%)`;
      ctx.fillText(newCode[i], 15 + i * 28, 38);
    }

    // Draw dots
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.4})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2,
      );
    }
  };

  const refreshCaptcha = () => {
    drawCaptcha();
    setCaptcha("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check if CAPTCHA is empty
    if (!captcha.trim()) {
      setError("Verification code is invalid");
      refreshCaptcha();
      setLoading(false);
      return;
    }

    // Validate CAPTCHA - Case insensitive comparison
    if (captcha.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError("Verification code is invalid");
      refreshCaptcha();
      setLoading(false);
      return;
    }

    // Validate visa number is not empty
    if (!visaNumber.trim()) {
      setError("Please enter a valid visa number");
      refreshCaptcha();
      setLoading(false);
      return;
    }

    try {
      // Direct fetch to your backend API
      const response = await fetch(
        `https://visa-consultancy-backend.onrender.com/api/evisa/check/${visaNumber}`,
      );
      const data = await response.json();

      if (!response.ok) {
        // Handle 404 or other errors
        if (response.status === 404) {
          setError(`Visa number is invalid ${visaNumber}`);
        } else {
          setError(data.message || "An error occurred while checking the visa");
        }
        refreshCaptcha();
        setShowResult(false);
        setResult(null);
        setLoading(false);
        return;
      }

      // Success - display visa information
      if (data.success && data.data) {
        setResult(data.data);
        setShowResult(true);
        setError("");
      } else {
        setError(`Visa number is invalid ${visaNumber}`);
        refreshCaptcha();
      }
    } catch (err) {
      console.error("Error checking visa:", err);
      setError(
        "Network error. Please make sure the backend server is running.",
      );
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    // Clear all state variables
    setVisaNumber("");
    setCaptcha("");
    setResult(null);
    setShowResult(false);
    setError("");
    
    // Use setTimeout to ensure the canvas is visible and ready
    setTimeout(() => {
      drawCaptcha();
    }, 100);
  };

  // Initialize CAPTCHA on component mount
  useEffect(() => {
    // Small delay to ensure canvas is rendered
    setTimeout(() => {
      drawCaptcha();
    }, 100);
  }, []);

  // Redraw CAPTCHA when showResult changes (when returning to form)
  useEffect(() => {
    if (!showResult) {
      setTimeout(() => {
        drawCaptcha();
      }, 100);
    }
  }, [showResult]);

  return (
    <div id="body-wrapper" className="inner">
      {/* SIDEBAR */}
      <div id="sidebar">
        <div className="sidebar-item">
          Things you should know
          <Link href="https://www.evisa.gov.md/Info/ThingsYouShouldKnow?c=en-US">
            10 things you should know about the eVisa
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div id="content" className="">
        <div id="masterMainContent">
          {error && (
            <div
              style={{
                color: error.includes("invalid") ? "#cc0000" : "#ff0000",
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "right",
                marginBottom: "20px",
                padding: "10px",
                backgroundColor: "#ffeeee",
                borderRadius: "5px",
              }}
            >
              {error === "Verification code is invalid" ? (
                <span>✗ Verification code is invalid</span>
              ) : error.includes("Visa number is invalid") ? (
                <span>✗ {error}</span>
              ) : error.includes("Network error") ? (
                <span>✗ {error}</span>
              ) : (
                <span>✗ {error}</span>
              )}
            </div>
          )}
          {/* FORM */}
          {!showResult && (
            <form onSubmit={handleSubmit} className="app-panel">
              <div className="app-left-panel">Seeking visa</div>

              <div className="app-content-panel">
                <div className="app-content-data">
                  <label>Visa number</label>
                  <input
                    type="text"
                    value={visaNumber}
                    onChange={(e) => setVisaNumber(e.target.value)}
                    className="border w-72.75"
                    disabled={loading}
                  />
                </div>

                {/* CAPTCHA */}
                <div className="app-content-data">
                  <canvas
                    ref={canvasRef}
                    id="captchaCanvas"
                    width="180"
                    height="50"
                    style={{
                      border: "1px solid #ccc",
                      display: "block",
                      marginBottom: "5px",
                      cursor: "pointer",
                    }}
                    onClick={refreshCaptcha}
                    title="Click to refresh"
                  />
                  <div
                    onClick={refreshCaptcha}
                    style={{
                      fontSize: "12px",
                      color: "#0066cc",
                      cursor: "pointer",
                      marginBottom: "8px",
                    }}
                  >
                    Refresh
                  </div>
                  <input
                    type="text"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="border w-72.75"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 m-2"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? "Checking..." : "Check"}
                </button>
              </div>
            </form>
          )}

          {/* RESULT */}
          {showResult && result && (
            <div className="app-panel">
              <div className="app-left-panel">Seeking visa</div>

              <div className="app-content-panel p-8">
                <div className="flex gap-4 m-4 p-2.5">
                  {/* PHOTO */}
                  <div>
                    {result.photo ? (
                      <img
                        src={result.photo}
                        alt="Visa photo"
                        className="w-30 h-30 border object-cover"
                      />
                    ) : (
                      <div className="w-30 h-30 border bg-gray-100 flex items-center justify-center">
                        Photo not found
                      </div>
                    )}
                  </div>

                  {/* PERSONAL INFO */}
                  <div className="text-sm leading-7">
                    <div>
                      Surname: <strong>{result.surname || "N/A"}</strong>
                    </div>
                    <div>
                      First name: <strong>{result.firstName || "N/A"}</strong>
                    </div>
                    <div>
                      Date of birth:{" "}
                      <strong>
                        {result.dateOfBirth || result.dob || "N/A"}
                      </strong>
                    </div>
                    <div>
                      Citizenship:{" "}
                      <strong>{result.citizenship || "N/A"}</strong>
                    </div>
                    <div>
                      Passport number:
                      <strong>
                        {result.passportNumber || result.passport || "N/A"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* VISA INFO */}
                <div className="text-sm leading-7 m-4 px-4">
                  <div className="text-red-600">
                    Visa status: <strong>{result.status || "N/A"}</strong>
                  </div>
                  <div>
                    Visa validity:{" "}
                    <strong>
                      {result.validity
                        ? new Date(result.validity).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </div>
                  <div>
                    Visa type:{" "}
                    <strong>{result.visaType || result.type || "N/A"}</strong>
                  </div>
                  <div>
                    Visit purpose:{" "}
                    <strong>
                      {result.visitPurpose || result.purpose || "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="px-4">
                  <button
                    onClick={resetSearch}
                    className="bg-gray-700 text-white px-4 py-2"
                  >
                    Another search
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}