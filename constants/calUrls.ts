// Key format: "GuideName|ServiceName"
// Values are Cal.com calLink slugs in the format "username/event-slug".
// Replace each placeholder with the real Cal.com link for that guide.

export const calLinkMap: Record<string, string> = {
  // Tarot Guidance
  "Jwalant S.|Tarot Guidance": "https://cal.com/devyash-rasela-al1c85/15min",
  "Nona|Tarot Guidance": "PLACEHOLDER/event-slug",
  "Saachi A.|Tarot Guidance": "coachsaachie/happy-ho-sa",
  "Monika S.|Tarot Guidance": "PLACEHOLDER/event-slug",

  // Energy Healing
  "Pooja|Energy Healing": "PLACEHOLDER/event-slug",
  "Nona|Energy Healing": "PLACEHOLDER/event-slug",
  "Monika|Energy Healing": "PLACEHOLDER/event-slug",
  "Pritpal|Energy Healing": "pritpalkaur/happyho-pk",

  // Astrology
  "Monika|Astrology": "PLACEHOLDER/event-slug",

  // Numerology
  "Saachi A.|Numerology": "coachsaachie/happy-ho-sa",

  // Name Correction
  "Saachi A.|Name Correction": "coachsaachie/happy-ho-sa",

  // Conscious Guidance
  "Pooja|Conscious Guidance": "PLACEHOLDER/event-slug",

  // Meditation
  "Jwalant S.|Meditation": "https://cal.com/devyash-rasela-al1c85/15min",

  // Vastu
  "Saachi A.|Vastu": "coachsaachie/happy-ho-sa",
};

// Helper to look up the Cal.com calLink for a guide + service combo
export function getCalLink(guide: string, service: string): string | null {
  return calLinkMap[`${guide}|${service}`] || null;
}
