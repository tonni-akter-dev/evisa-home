/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { useEffect, useState } from 'react'

const DashboardContent = () => {
   const [email, setEmail] = useState<string>("");
  
    useEffect(() => {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) setEmail(storedEmail);
    }, []);

  return (
    <div>WELCOME {email}</div>
  )
}

export default DashboardContent