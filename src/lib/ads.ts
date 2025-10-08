
export type Ad = {
  id: string;
  title: string;
  description: string;
  reward: number;
  duration: number; // in seconds
  videoUrl: string;
  thumbnailUrl: string;
  thumbnailHint: string;
};

const REWARD_RATE_PER_SECOND = 2.5; // $2.50 per second

const baseAds: Omit<Ad, 'id' | 'reward' | 'thumbnailUrl'>[] = [
  {
    title: 'QuantumLeap Investing',
    description: 'Invest in your future with our AI-powered trading platform. Maximize returns, minimize risk.',
    duration: 40,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailHint: 'finance app'
  },
  {
    title: 'The Future is Now: Drive the Nova-X',
    description: 'Sleek design, unparalleled performance. The all-new Nova-X electric vehicle.',
    duration: 45,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailHint: 'luxury car'
  },
  {
    title: 'Connect-o-Pad 5: Your Digital Canvas',
    description: 'Unleash your creativity with the new Connect-o-Pad 5. Faster, lighter, and more powerful.',
    duration: 35,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailHint: 'tech gadget'
  },
  {
    title: 'Apex Airlines: Fly Business Class',
    description: 'Experience unparalleled luxury and comfort at 40,000 feet. Your exclusive journey awaits.',
    duration: 60,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnAnAdventure.mp4',
    thumbnailHint: 'airline interior'
  },
  {
    title: 'Elegance Chronos Watch',
    description: 'A masterpiece of Swiss engineering. Timeless design, ultimate precision.',
    duration: 30,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailHint: 'luxury watch'
  },
  {
    title: 'Zenith Smart Watch',
    description: 'Track your fitness, stay connected. The future is on your wrist.',
    duration: 40,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailHint: 'smart watch'
  },
  {
    title: 'FortressGuard Cyber Security',
    description: 'Protect your digital life with our enterprise-grade security suite for personal use.',
    duration: 50,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailHint: 'cyber security'
  },
  {
    title: 'Sky-High Drone Pro',
    description: 'Capture breathtaking aerial shots with our new professional drone.',
    duration: 55,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailHint: 'drone flying'
  },
  {
    title: 'Synapse CRM Software',
    description: 'The all-in-one platform to grow your business. Sales, marketing, and support.',
    duration: 35,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnailHint: 'software interface'
  },
  {
    title: 'Azure Vista Real Estate',
    description: 'Find your luxury dream home with our exclusive property listings.',
    duration: 50,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnailHint: 'luxury home'
  },
  {
    title: 'Global Platinum Card',
    description: 'Unlock a world of benefits with the ultimate travel and lifestyle credit card.',
    duration: 40,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnailHint: 'credit card'
  },
  {
    title: 'Starlight Resorts & Spas',
    description: 'Indulge in 7-star luxury at our exclusive resorts. Your private paradise.',
    duration: 60,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailHint: 'luxury resort'
  }
];

// Generate a larger list of ads to simulate "unlimited" ads
const generateUnlimitedAds = (count: number): Ad[] => {
  if (count === 0) {
    return [];
  }
  const unlimitedAds: Ad[] = [];
  for (let i = 0; i < count; i++) {
    const baseAdIndex = i % baseAds.length;
    const baseAd = baseAds[baseAdIndex];
    
    // Create a truly unique ID based on the loop index
    const uniqueId = `${i + 1}`;
    
    unlimitedAds.push({
      ...baseAd,
      id: uniqueId,
      reward: baseAd.duration * REWARD_RATE_PER_SECOND,
      // Ensure thumbnail URLs are unique for each generated ad to prevent image caching issues
      thumbnailUrl: `https://picsum.photos/seed/${uniqueId}/600/400`
    });
  }
  return unlimitedAds;
};

export const ads: Ad[] = generateUnlimitedAds(100);

export const getAdById = (id: string): Ad | undefined => {
  // Since we generate 100 ads, we can find the ad by its ID.
  // The ID is simply the index + 1 in string form.
  const adIndex = parseInt(id, 10) - 1;
  if (adIndex >= 0 && adIndex < ads.length) {
    return ads[adIndex];
  }
  return undefined;
}
