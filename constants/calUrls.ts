// Key format: "GuideName|ServiceName"
// Values are Cal.com calLink slugs in the format "username/event-slug".
// Replace each placeholder with the real Cal.com link for that guide.

export const calLinkMap: Record<string, string> = {
  // Tarot Guidance
  "Jwalant S.|Tarot Guidance": "https://cal.com/jwalant-swaroop-ddkr5x/tarot-aided-life-coaching",
  "Nona|Tarot Guidance": "https://cal.com/nona-khanna-lvpeor/tarot",
  "Saachi A.|Tarot Guidance": "https://cal.com/coach-saachie-6pinvv/tarot-reader",
  "Monika S.|Tarot Guidance": "PLACEHOLDER/event-slug",

  // Energy Healing
  "Pooja|Energy Healing": "PLACEHOLDER/event-slug",
  "Nona|Energy Healing": "https://cal.com/nona-khanna-lvpeor/healing",
  "Monika|Energy Healing": "PLACEHOLDER/event-slug",
  "Pritpal|Energy Healing": "https://cal.com/pritpal-kaur-qzgl2z/30min",

  // Astrology
  "Monika|Astrology": "PLACEHOLDER/event-slug",

  // Numerology
  "Saachi A.|Numerology": "https://cal.com/coach-saachie-6pinvv/numerology",

  // Name Correction
  "Saachi A.|Name Correction": "https://cal.com/coach-saachie-6pinvv/name-balancing",

  // Conscious Guidance
  "Pooja|Conscious Guidance": "PLACEHOLDER/event-slug",

  // Meditation
  "Jwalant S.|Meditation": "https://cal.com/jwalant-swaroop-ddkr5x/meditation-coaching",

  // Vastu
  "Saachi A.|Vastu": "https://cal.com/coach-saachie-6pinvv/vastu-consultation",
};

// Helper to look up the Cal.com calLink for a guide + service combo
export function getCalLink(guide: string, service: string): string | null {
  return calLinkMap[`${guide}|${service}`] || null;
}





export const countryCodes = [
  { code: "+1", country: "🇺🇸 USA / Canada" },
  { code: "+7", country: "🇷🇺 Russia" },
  { code: "+20", country: "🇪🇬 Egypt" },
  { code: "+27", country: "🇿🇦 South Africa" },
  { code: "+30", country: "🇬🇷 Greece" },
  { code: "+31", country: "🇳🇱 Netherlands" },
  { code: "+32", country: "🇧🇪 Belgium" },
  { code: "+33", country: "🇫🇷 France" },
  { code: "+34", country: "🇪🇸 Spain" },
  { code: "+36", country: "🇭🇺 Hungary" },
  { code: "+39", country: "🇮🇹 Italy" },
  { code: "+40", country: "🇷🇴 Romania" },
  { code: "+41", country: "🇨🇭 Switzerland" },
  { code: "+43", country: "🇦🇹 Austria" },
  { code: "+44", country: "🇬🇧 United Kingdom" },
  { code: "+45", country: "🇩🇰 Denmark" },
  { code: "+46", country: "🇸🇪 Sweden" },
  { code: "+47", country: "🇳🇴 Norway" },
  { code: "+48", country: "🇵🇱 Poland" },
  { code: "+49", country: "🇩🇪 Germany" },
  { code: "+51", country: "🇵🇪 Peru" },
  { code: "+52", country: "🇲🇽 Mexico" },
  { code: "+54", country: "🇦🇷 Argentina" },
  { code: "+55", country: "🇧🇷 Brazil" },
  { code: "+56", country: "🇨🇱 Chile" },
  { code: "+57", country: "🇨🇴 Colombia" },
  { code: "+60", country: "🇲🇾 Malaysia" },
  { code: "+61", country: "🇦🇺 Australia" },
  { code: "+62", country: "🇮🇩 Indonesia" },
  { code: "+63", country: "🇵🇭 Philippines" },
  { code: "+64", country: "🇳🇿 New Zealand" },
  { code: "+65", country: "🇸🇬 Singapore" },
  { code: "+66", country: "🇹🇭 Thailand" },
  { code: "+81", country: "🇯🇵 Japan" },
  { code: "+82", country: "🇰🇷 South Korea" },
  { code: "+84", country: "🇻🇳 Vietnam" },
  { code: "+86", country: "🇨🇳 China" },
  { code: "+90", country: "🇹🇷 Turkey" },
  { code: "+91", country: "🇮🇳 India" },
  { code: "+92", country: "🇵🇰 Pakistan" },
  { code: "+93", country: "🇦🇫 Afghanistan" },
  { code: "+94", country: "🇱🇰 Sri Lanka" },
  { code: "+95", country: "🇲🇲 Myanmar" },
  { code: "+98", country: "🇮🇷 Iran" },
  { code: "+212", country: "🇲🇦 Morocco" },
  { code: "+213", country: "🇩🇿 Algeria" },
  { code: "+216", country: "🇹🇳 Tunisia" },
  { code: "+218", country: "🇱🇾 Libya" },
  { code: "+220", country: "🇬🇲 Gambia" },
  { code: "+221", country: "🇸🇳 Senegal" },
  { code: "+234", country: "🇳🇬 Nigeria" },
  { code: "+251", country: "🇪🇹 Ethiopia" },
  { code: "+254", country: "🇰🇪 Kenya" },
  { code: "+255", country: "🇹🇿 Tanzania" },
  { code: "+263", country: "🇿🇼 Zimbabwe" },
  { code: "+351", country: "🇵🇹 Portugal" },
  { code: "+352", country: "🇱🇺 Luxembourg" },
  { code: "+353", country: "🇮🇪 Ireland" },
  { code: "+354", country: "🇮🇸 Iceland" },
  { code: "+358", country: "🇫🇮 Finland" },
  { code: "+420", country: "🇨🇿 Czech Republic" },
  { code: "+421", country: "🇸🇰 Slovakia" },
  { code: "+852", country: "🇭🇰 Hong Kong" },
  { code: "+853", country: "🇲🇴 Macau" },
  { code: "+855", country: "🇰🇭 Cambodia" },
  { code: "+856", country: "🇱🇦 Laos" },
  { code: "+880", country: "🇧🇩 Bangladesh" },
  { code: "+886", country: "🇹🇼 Taiwan" },
  { code: "+960", country: "🇲🇻 Maldives" },
  { code: "+961", country: "🇱🇧 Lebanon" },
  { code: "+962", country: "🇯🇴 Jordan" },
  { code: "+963", country: "🇸🇾 Syria" },
  { code: "+964", country: "🇮🇶 Iraq" },
  { code: "+965", country: "🇰🇼 Kuwait" },
  { code: "+966", country: "🇸🇦 Saudi Arabia" },
  { code: "+971", country: "🇦🇪 UAE" },
  { code: "+972", country: "🇮🇱 Israel" },
  { code: "+973", country: "🇧🇭 Bahrain" },
  { code: "+974", country: "🇶🇦 Qatar" },
  { code: "+975", country: "🇧🇹 Bhutan" },
  { code: "+976", country: "🇲🇳 Mongolia" },
  { code: "+977", country: "🇳🇵 Nepal" },
  { code: "+998", country: "🇺🇿 Uzbekistan" },
];