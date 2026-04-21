/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {  useSearchParams, useRouter } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const generateCaptchaCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newCode = generateCaptchaCode();
    setCaptchaCode(newCode);

    // Set canvas dimensions
    canvas.width = 220;
    canvas.height = 70;

    // Clear canvas to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw 1px border
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw subtle background pattern (very light)
    ctx.fillStyle = "rgba(240, 245, 250, 0.3)";
    ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);

    // Draw wavy lines (noise)
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 15 + i * 15);
      for (let x = 0; x < canvas.width; x += 15) {
        const y = 15 + i * 15 + Math.sin(x * 0.12 + i) * 7;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, 15 + i * 15);
      ctx.strokeStyle = `rgba(120, 120, 140, 0.25)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Draw scattered dots
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1.5,
        1.5,
      );
    }

    // Draw random small circles
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 1,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `rgba(100, 100, 130, 0.2)`;
      ctx.fill();
    }

    // Draw CROOKED text - each character with random rotation and offset
    const chars = newCode.split("");
    const startX = 18;
    const startY = 48;
    const textColor = "#2a4a7a"; // Dark blue color

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      // Random offsets for crooked look
      const xOffset = (Math.random() - 0.5) * 8;
      const yOffset = (Math.random() - 0.5) * 6;
      const x = startX + i * 30 + xOffset;
      const y = startY + yOffset;
      // Random rotation between -0.4 and 0.4 radians (crooked)
      const rotation = (Math.random() - 0.5) * 0.8;
      // Random font size between 32 and 40
      const fontSize = 34 + Math.floor(Math.random() * 8);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.font = `bold ${fontSize}px "Courier New", "Monaco", monospace`;
      ctx.fillStyle = textColor;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Add some random lines crossing the text (noise)
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(80, 100, 120, 0.3)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
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
        router.push(`/check-my-visa?search=${visaNumber}`);
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
  useEffect(() => {
    const search = searchParams.get("search");

    if (!search) {
      resetSearch();
      return;
    }

    setVisaNumber(search);

    const fetchVisa = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://visa-consultancy-backend.onrender.com/api/evisa/check/${search}`,
        );

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          setResult(data.data);
          setShowResult(true);
          setError("");
        } else {
          setResult(null);
          setShowResult(false);
          setError(`Visa number is invalid ${search}`);
        }
      } catch (err) {
        setError("Network error. Please try again.");
        setShowResult(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVisa();
  }, [searchParams]);
  useEffect(() => {
    setTimeout(() => {
      drawCaptcha();
    }, 100);
  }, []);

  useEffect(() => {
    if (!showResult) {
      setTimeout(() => {
        drawCaptcha();
      }, 100);
    }
  }, [showResult]);

  return (
    <div id="body-wrapper" className="inner">
      <div id="sidebar">
        <div className="sidebar-item">
          Things you should know
          <Link href="https://www.evisa.gov.md/Info/ThingsYouShouldKnow?c=en-US">
            10 things you should know about the eVisa
          </Link>
        </div>
      </div>

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
                <span> Verification code is invalid</span>
              ) : error.includes("Visa number is invalid") ? (
                <span> {error}</span>
              ) : error.includes("Network error") ? (
                <span> {error}</span>
              ) : (
                <span> {error}</span>
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
                      // border: "1px solid #ccc",
                      // backgroundColor: "rgb(239, 246, 255)",#eff6ff
                      display: "block",
                      marginBottom: "5px",
                      cursor: "pointer",
                    }}
                    onClick={refreshCaptcha}
                    title="Click to refresh"
                  />
                  <div
                    onClick={refreshCaptcha}
                    className="underline"
                    style={{
                      fontSize: "12px",
                      color: "#551A8B",
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
                        {result.dateOfBirth
                          ? new Date(result.dateOfBirth).toLocaleDateString()
                          : "N/A"}
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
