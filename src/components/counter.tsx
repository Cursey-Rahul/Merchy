"use client"
import React from 'react'
import Countdown from 'react-countdown'
const countdownend= new Date('2025-05-08')

const counter = () => {
  return (
    <div>
        <Countdown className="text-yellow-300 font-bold text-6xl" date={countdownend} />
    </div>
  )
}

export default counter