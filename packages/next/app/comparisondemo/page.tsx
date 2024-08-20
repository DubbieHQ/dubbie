"use client";

import React from "react";

const ComparisonChart = () => {
  const features = [
    {
      name: "Pricing",
      dubbie: "0.05$/min",
      reask: "2$/min",
      elevenLabs: "2$/min",
    },
    { name: "Languages", dubbie: "30", reask: "60+", elevenLabs: "29" },
    { name: "Extracts bgm", dubbie: true, reask: true, elevenLabs: true },
    { name: "Editor", dubbie: true, reask: true, elevenLabs: true },
    { name: "Voice cloning", dubbie: false, reask: true, elevenLabs: true },
    {
      name: "Enterprise support",
      dubbie: false,
      reask: true,
      elevenLabs: true,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left" />
            <th className="p-2 text-center">
              <img
                src="/dubbie-logo.png"
                alt="Dubbie"
                className="mx-auto mb-2 h-8"
              />
              Dubbie
            </th>
            <th className="p-2 text-center">
              <img
                src="/reask-logo.png"
                alt="Reask"
                className="mx-auto mb-2 h-8"
              />
              Reask
            </th>
            <th className="p-2 text-center">
              <img
                src="/elevenlabs-logo.png"
                alt="ElevenLabs"
                className="mx-auto mb-2 h-8"
              />
              ElevenLabs
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="p-2 font-medium">{feature.name}</td>
              <td className="p-2 text-center">
                {typeof feature.dubbie === "boolean"
                  ? feature.dubbie
                    ? "✓"
                    : "✗"
                  : feature.dubbie}
              </td>
              <td className="p-2 text-center">
                {typeof feature.reask === "boolean"
                  ? feature.reask
                    ? "✓"
                    : "✗"
                  : feature.reask}
              </td>
              <td className="p-2 text-center">
                {typeof feature.elevenLabs === "boolean"
                  ? feature.elevenLabs
                    ? "✓"
                    : "✗"
                  : feature.elevenLabs}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonChart;
