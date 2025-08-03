import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"

export default function MMAHomepage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Hero Content */}
        <div
          className={`relative z-10 text-center text-white px-4 transition-all duration-2000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">FIGHT</span>
            <br />
            <span className="text-white">NIGHT</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300 leading-relaxed">
            Experience the ultimate combat sports entertainment with world-class fighters and unforgettable moments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Watch Live
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
            >
              View Schedule
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Upcoming Events</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Don't miss the most anticipated fights of the year
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Championship Bout",
                date: "March 15, 2024",
                location: "Las Vegas, NV",
                fighters: "Rodriguez vs. Thompson",
                status: "Main Event",
              },
              {
                title: "Title Defense",
                date: "March 22, 2024",
                location: "New York, NY",
                fighters: "Silva vs. Johnson",
                status: "Co-Main",
              },
              {
                title: "Rising Stars",
                date: "March 29, 2024",
                location: "Miami, FL",
                fighters: "Garcia vs. Williams",
                status: "Featured",
              },
            ].map((event, index) => (
              <Card
                key={index}
                className={`bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-500 hover:scale-105 backdrop-blur-sm ${
                  isVisible ? `opacity-100 translate-y-0 delay-${index * 200}` : "opacity-0 translate-y-8"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-semibold text-red-400 mb-3">{event.fighters}</p>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 transition-colors duration-300">
                    Get Tickets
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Trophy, number: "500+", label: "Fights Hosted" },
              { icon: Users, number: "50M+", label: "Global Fans" },
              { icon: Calendar, number: "12", label: "Events Per Year" },
              { icon: MapPin, number: "25+", label: "Countries" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ease-out ${
                  isVisible ? `opacity-100 translate-y-0 delay-${index * 100 + 800}` : "opacity-0 translate-y-8"
                }`}
              >
                <stat.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Experience the Action?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of fans worldwide and witness the most intense combat sports action live
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Subscribe Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
