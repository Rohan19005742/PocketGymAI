"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

/**
 * Hero Component
 * 
 * Uses CSS variables from the theme system for all colors.
 * Change the color theme in lib/theme/theme-config.ts to see all colors update automatically.
 */

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Enhanced animated background with gradient mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main gradient blobs - using theme CSS variables */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse"
          style={{backgroundColor: `rgba(var(--color-gradient1), 0.2)`}}
        />
        <div 
          className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse"
          style={{backgroundColor: `rgba(var(--color-gradient2), 0.2)`, animationDelay: '1s'}}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse"
          style={{backgroundColor: `rgba(var(--color-gradient3), 0.15)`, animationDelay: '2s'}}
        />
        <div 
          className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{backgroundColor: `rgba(var(--color-gradient1), 0.15)`, animationDelay: '1.5s'}}
        />
        
        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, transparent, rgba(var(--color-gradient1), 0.05), transparent)`
          }}
        />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"%3E%3C/rect%3E%3C/svg%3E")'}} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 slide-up">
            {/* Badge - using theme colors */}
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 scale-fade-in group border"
              style={{
                backgroundColor: `rgba(var(--color-primary), 0.1)`,
                borderColor: `rgba(var(--color-primary), 0.3)`,
                boxShadow: `0 0 20px rgba(var(--color-primary), 0.1)`
              }}
            >
              <Zap 
                className="w-4 h-4 group-hover:animate-pulse"
                style={{color: `rgb(var(--color-primaryLight))`}}
              />
              <span
                className="text-xs sm:text-sm font-semibold bg-clip-text text-transparent"
                style={{
                  background: `linear-gradient(to right, rgb(var(--color-primaryLight)), rgb(var(--color-secondaryLight)))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AI-Powered Training
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight" style={{color: `rgb(var(--color-foreground))`}}>
                AI Fitness &
                <br />
                <span className="gradient-text animate-pulse">Nutrition Coach</span>
              </h1>
              <p className="text-lg sm:text-xl max-w-md leading-relaxed font-medium" style={{color: `rgb(var(--color-mutedForeground))`}}>
                Transform your fitness journey with an intelligent AI coach that understands your goals, adapts to your progress, and motivates you every step of the way.
              </p>
            </div>

            {/* Key Benefits - using success color */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" style={{color: `rgb(var(--color-success))`}} />
                <span style={{color: `rgb(var(--color-mutedForeground))`}}>Personalized workouts in real-time</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" style={{color: `rgb(var(--color-success))`}} />
                <span style={{color: `rgb(var(--color-mutedForeground))`}}>AI nutrition planning & coaching</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" style={{color: `rgb(var(--color-success))`}} />
                <span style={{color: `rgb(var(--color-mutedForeground))`}}>Track progress with detailed analytics</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                asChild
                className="text-white font-bold text-lg px-8 py-7 rounded-xl transition-all duration-300 hover:scale-105 transform"
                style={{
                  background: `linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-secondary)))`,
                  boxShadow: `0 0 30px rgba(var(--color-secondary), 0.4)`
                }}
              >
                <Link href="/chat" className="flex items-center justify-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="font-semibold text-lg px-8 py-7 rounded-xl transition-all duration-300 hover:scale-105 transform"
                style={{
                  borderColor: `rgba(var(--color-primary), 0.3)`,
                  color: `rgb(var(--color-foreground))`
                }}
              >
                Schedule a Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t flex items-center space-x-6 text-sm" style={{borderColor: `rgba(var(--color-border), 0.5)`}}>
              <div className="hover:scale-110 transition-transform">
                <p className="font-bold text-lg" style={{color: `rgb(var(--color-foreground))`}}>100% Free</p>
                <p style={{color: `rgb(var(--color-mutedForeground))`}}>Start Using Now</p>
              </div>
              <div className="w-px h-8" style={{backgroundColor: `rgba(var(--color-border), 0.5)`}} />
              <div className="hover:scale-110 transition-transform">
                <p className="font-bold text-lg" style={{color: `rgb(var(--color-foreground))`}}>3-in-1</p>
                <p style={{color: `rgb(var(--color-mutedForeground))`}}>Complete Platform</p>
              </div>
              <div className="w-px h-8" style={{backgroundColor: `rgba(var(--color-border), 0.5)`}} />
              <div className="hover:scale-110 transition-transform">
                <p className="font-bold text-lg" style={{color: `rgb(var(--color-foreground))`}}>Premium</p>
                <p style={{color: `rgb(var(--color-mutedForeground))`}}>Optional Upgrade</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-[500px] lg:h-[550px] hidden lg:block">
            {/* Animated card stack effect */}
            <div className="absolute inset-0 flex items-center justify-center gap-8">
              {/* Card 1 - Weight Loss Progress - uses primary color */}
              <div
                className="w-72 h-96 rounded-2xl backdrop-blur-xl p-6 transition-all duration-500 shadow-2xl hover:-translate-y-2 border"
                style={{
                  background: `linear-gradient(135deg, rgba(var(--color-primary), 0.1), rgba(var(--color-secondary), 0.05))`,
                  borderColor: `rgba(var(--color-primary), 0.3)`,
                  boxShadow: `0 20px 25px rgba(var(--color-primary), 0.2)`,
                }}
              >
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{backgroundColor: `rgb(var(--color-success))`}}
                      />
                      <p className="text-sm font-semibold" style={{color: `rgb(var(--color-foreground))`}}>Weight Loss</p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold border"
                      style={{
                        backgroundColor: `rgba(var(--color-success), 0.2)`,
                        borderColor: `rgba(var(--color-success), 0.5)`,
                        color: `rgb(var(--color-success))`
                      }}
                    >
                      On Track
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Chart */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold mb-3" style={{color: `rgb(var(--color-mutedForeground))`}}>Weight Trend & Goal Projection</p>
                      <div className="flex items-end justify-between h-32 gap-1.5 px-1">
                        {/* Historical bars */}
                        {[32, 28, 30, 24].map((height, i) => (
                          <div key={i} className="flex flex-col items-center flex-1 group">
                            <div
                              className="w-full rounded-t"
                              style={{
                                height: `${height * 0.8}px`,
                                background: `linear-gradient(to top, rgb(var(--color-primary)), rgba(var(--color-primary), 0.4))`,
                              }}
                            />
                            <p className="text-xs mt-1" style={{color: `rgb(var(--color-mutedForeground))`}}>W{i + 1}</p>
                          </div>
                        ))}
                        
                        {/* Prediction bars */}
                        {[20, 16].map((height, i) => (
                          <div key={`pred-${i}`} className="flex flex-col items-center flex-1 group">
                            <div
                              className="w-full rounded-t border-t"
                              style={{
                                height: `${height * 0.8}px`,
                                background: `linear-gradient(to top, rgba(var(--color-success), 0.4), rgba(var(--color-success), 0.2))`,
                                borderColor: `rgba(var(--color-success), 0.5)`,
                                borderStyle: 'dashed dashed solid solid'
                              }}
                            />
                            <p className="text-xs mt-1" style={{color: `rgb(var(--color-mutedForeground))`}}>W{i + 5}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-3 text-xs pt-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{backgroundColor: `rgb(var(--color-primary))`}}
                        />
                        <span style={{color: `rgb(var(--color-mutedForeground))`}}>Actual</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{backgroundColor: `rgb(var(--color-success))`}}
                        />
                        <span style={{color: `rgb(var(--color-mutedForeground))`}}>Projected</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Footer */}
                  <div className="flex justify-between text-sm border-t pt-3" style={{borderColor: `rgba(var(--color-border), 0.5)`}}>
                    <div>
                      <p className="text-xs" style={{color: `rgb(var(--color-mutedForeground))`}}>Current</p>
                      <p className="text-lg font-bold gradient-text">192 lbs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{color: `rgb(var(--color-success))`}}>↓ 8 lbs</p>
                      <p className="font-bold text-sm" style={{color: `rgb(var(--color-success))`}}>Lost</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{color: `rgb(var(--color-success))`}}>Goal</p>
                      <p className="font-bold text-sm" style={{color: `rgb(var(--color-success))`}}>160 lbs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - AI Meal Suggestions - uses secondary color */}
              <div
                className="w-72 h-96 rounded-2xl backdrop-blur-xl p-6 transition-all duration-500 shadow-2xl hover:-translate-y-2 border"
                style={{
                  background: `linear-gradient(135deg, rgba(var(--color-secondary), 0.1), rgba(var(--color-accent), 0.05))`,
                  borderColor: `rgba(var(--color-secondary), 0.3)`,
                  boxShadow: `0 20px 25px rgba(var(--color-secondary), 0.2)`,
                }}
              >
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{backgroundColor: `rgb(var(--color-secondary))`}}
                    />
                    <p className="text-sm font-semibold" style={{color: `rgb(var(--color-foreground))`}}>AI Meal Plans</p>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    <p className="text-xs font-semibold" style={{color: `rgb(var(--color-mutedForeground))`}}>Today's Suggestions</p>
                    
                    {/* Breakfast - Primary color */}
                    <div 
                      className="p-2.5 rounded transition-colors border"
                      style={{
                        background: `rgba(var(--color-primary), 0.15)`,
                        borderColor: `rgba(var(--color-primary), 0.3)`
                      }}
                    >
                      <p className="text-xs font-semibold uppercase" style={{color: `rgb(var(--color-primaryLight))`}}>Breakfast</p>
                      <p className="text-sm font-semibold" style={{color: `rgb(var(--color-foreground))`}}>Oatmeal with Berries</p>
                      <p className="text-xs" style={{color: `rgb(var(--color-mutedForeground))`}}>380 cal • 12g protein • 65g carbs</p>
                    </div>
                    
                    {/* Lunch - Success color */}
                    <div 
                      className="p-2.5 rounded transition-colors border"
                      style={{
                        background: `rgba(var(--color-success), 0.15)`,
                        borderColor: `rgba(var(--color-success), 0.3)`
                      }}
                    >
                      <p className="text-xs font-semibold uppercase" style={{color: `rgb(var(--color-success))`}}>Lunch</p>
                      <p className="text-sm font-semibold" style={{color: `rgb(var(--color-foreground))`}}>Grilled Chicken & Broccoli</p>
                      <p className="text-xs" style={{color: `rgb(var(--color-mutedForeground))`}}>520 cal • 45g protein • 32g carbs</p>
                    </div>
                    
                    {/* Dinner - Secondary color */}
                    <div 
                      className="p-2.5 rounded transition-colors border"
                      style={{
                        background: `rgba(var(--color-secondary), 0.15)`,
                        borderColor: `rgba(var(--color-secondary), 0.3)`
                      }}
                    >
                      <p className="text-xs font-semibold uppercase" style={{color: `rgb(var(--color-secondaryLight))`}}>Dinner</p>
                      <p className="text-sm font-semibold" style={{color: `rgb(var(--color-foreground))`}}>Salmon & Sweet Potato</p>
                      <p className="text-xs" style={{color: `rgb(var(--color-mutedForeground))`}}>580 cal • 38g protein • 52g carbs</p>
                    </div>
                  </div>
                  <div 
                    className="text-xs font-semibold border-t pt-2"
                    style={{
                      color: `rgb(var(--color-secondary))`,
                      borderColor: `rgba(var(--color-border), 0.5)`
                    }}
                  >
                    ✓ AI Personalized for Your Goals
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
