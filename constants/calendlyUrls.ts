// Key format: "GuideName|ServiceName"
// Paste your Calendly scheduling URLs here for each guide + service combination.

export const calendlyUrlMap: Record<string, string> = {
  // Tarot Guidance
  "Jwalant S.|Tarot Guidance": "https://calendly.com/jwalantswaroop/happy-ho-js",
  "Nona|Tarot Guidance": "https://calendly.com/devyashrasela/new-meeting",
  "Saachi A.|Tarot Guidance": "https://calendly.com/coachsaachie/happy-ho-sa",
  "Monika S.|Tarot Guidance": "https://calendly.com/devyashrasela/new-meeting",

  // Energy Healing
  "Pooja|Energy Healing": "https://calendly.com/devyashrasela/new-meeting",
  "Nona|Energy Healing": "https://calendly.com/devyashrasela/new-meeting",
  "Monika|Energy Healing": "https://calendly.com/devyashrasela/new-meeting",
  "Pritpal|Energy Healing": "https://calendly.com/pritpalkaur-d6jg/happyho-pk",

  // Astrology
  "Monika|Astrology": "https://calendly.com/devyashrasela/new-meeting",

  // Numerology
  "Saachi A.|Numerology": "https://calendly.com/coachsaachie/happy-ho-sa",

  // Name Correction
  "Saachi A.|Name Correction": "https://calendly.com/coachsaachie/happy-ho-sa",

  // Conscious Guidance
  "Pooja|Conscious Guidance": "https://calendly.com/devyashrasela/meditation-session",

  // Meditation
  "Jwalant S.|Meditation": "https://calendly.com/jwalantswaroop/happy-ho-js",

  // Vastu
  "Saachi A.|Vastu": "https://calendly.com/coachsaachie/happy-ho-sa",
};

// Helper to look up the Calendly URL for a guide + service combo
export function getCalendlyUrl(guide: string, service: string): string | null {
  return calendlyUrlMap[`${guide}|${service}`] || null;
}
