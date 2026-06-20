'use client'

import React from 'react'
import '../Marketing.scss'

export function TechStackBanner() {
  const techs = [
    "React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT Auth", "bcrypt", "REST API", "Axios",
    // Duplicate for seamless loop
    "React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT Auth", "bcrypt", "REST API", "Axios"
  ]

  return (
    <div className="tech-banner-container">
      <div className="tech-banner-track">
        {techs.map((tech, idx) => (
          <div key={idx} className="tech-item">
            <span className="tech-dot"></span>
            {tech}
          </div>
        ))}
      </div>
    </div>
  )
}
