"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"
import "./HomePage.css"

export default function MMAHomepage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="mma-homepage">
   <section class="hero-section">
  <div className="hero-bg"></div>
  <div className="hero-overlay-vertical"></div>
  <div className="hero-overlay-horizontal"></div>

  <div className="hero-content visible">
    <h1 className="hero-title">
      <span className="title-gradient">MMA</span> <span className="title-plain">Arena</span>
    </h1>
    <p className="hero-subtitle">Build cards, track fighters, and compete.</p>
    <div className="hero-actions">
      <button className="btn btn-primary">Get Started</button>
      <button className="btn btn-outline">Learn More</button>
    </div>

    <div className="scroll-indicator">
      <div className="scroll-mouse"><div className="scroll-wheel"></div></div>
    </div>
  </div>
</section>
    </div>
  )
}
