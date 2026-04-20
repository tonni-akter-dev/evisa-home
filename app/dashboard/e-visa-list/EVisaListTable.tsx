/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface EVisa {
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
}

export default function EVisaTable() {
  const [visas, setVisas] = useState<EVisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch EVisa
  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const res = await fetch(
          "https://visa-consultancy-backend.onrender.com/api/evisa",
        );
        const data = await res.json();
        setVisas(data.data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the EVisa",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(
        `https://visa-consultancy-backend.onrender.com/api/evisa/${id}`,
        {
          method: "DELETE",
        },
      );

      setVisas((prev) => prev.filter((v) => v._id !== id));

      Swal.fire("Deleted!", "EVisa removed", "success");
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <h3 className="p-4 text-2xl font-semibold">
        Total EVisas: {visas.length}
      </h3>
      <div className="w-full overflow-x-auto border border-gray-200 bg-white rounded-xl shadow-sm">
        <table className="min-w-300 w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">#</th>
              <th className="px-4 py-3 whitespace-nowrap">Photo</th>
              <th className="px-4 py-3 whitespace-nowrap">Surname</th>
              <th className="px-4 py-3 whitespace-nowrap">First Name</th>
              <th className="px-4 py-3 whitespace-nowrap">DOB</th>
              <th className="px-4 py-3 whitespace-nowrap">Citizenship</th>
              <th className="px-4 py-3 whitespace-nowrap">Passport</th>
              <th className="px-4 py-3 whitespace-nowrap">Visa No</th>
              <th className="px-4 py-3 whitespace-nowrap">Type</th>
              <th className="px-4 py-3 whitespace-nowrap">Validity</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visas.map((visa, index) => (
              <tr
                key={visa._id}
                className={`border-t border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="px-4">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {visa.photo ? (
                    <img
                      src={visa.photo}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">{visa.surname}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {visa.firstName}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {visa.dateOfBirth
                    ? new Date(visa.dateOfBirth).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {visa.citizenship}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {visa.passportNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {visa.visaNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{visa.visaType}</td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {visa.validity
                    ? new Date(visa.validity).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {visa.status}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/dashboard/edit-evisa/${visa._id}`}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(visa._id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
