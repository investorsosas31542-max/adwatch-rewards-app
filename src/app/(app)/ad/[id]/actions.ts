"use server";

import { detectInvalidAdView, DetectInvalidAdViewInput } from "@/ai/flows/detect-invalid-ad-views";
import { Ad } from "@/lib/ads";

export async function verifyAdView(ad: Ad) {
  try {
    // In a real application, you would capture screen recording and user activity.
    // For this prototype, we'll use mock data.
    const mockInput: DetectInvalidAdViewInput = {
      adViewVideoDataUri: 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9A',
      mouseActivityJson: '[]',
      keyboardActivityJson: '[]',
      adMetadataJson: JSON.stringify({
        id: ad.id,
        duration: ad.duration,
      }),
    };

    const result = await detectInvalidAdView(mockInput);
    
    if (result.isValidAdView) {
      return { success: true, reward: ad.reward };
    } else {
      return { success: false, reason: result.reason || "Unusual activity detected." };
    }

  } catch (error) {
    console.error("Error verifying ad view:", error);
    return { success: false, reason: "An unexpected error occurred during verification." };
  }
}
