"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdById, Ad } from "@/lib/ads";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRewards } from "@/hooks/use-rewards";
import { ArrowLeft, AlertTriangle, PartyPopper } from "lucide-react";
import { verifyAdView } from "./actions";

export default function AdViewerPage() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isAdWatched, setIsAdWatched] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addReward } = useRewards();

  const adId = useMemo(() => Array.isArray(params.id) ? params.id[0] : params.id, [params.id]);

  useEffect(() => {
    if (adId) {
      const foundAd = getAdById(adId);
      if (foundAd) {
        setAd(foundAd);
      } else {
        setError("Ad not found.");
      }
    }
  }, [adId]);

  // =========================================================================
  // GOOGLE ADSENSE INTEGRATION POINT
  // =========================================================================
  // In a real application with Google AdSense, you would:
  // 1. Load the Google Adsense script in your main layout file.
  // 2. Place your AdSense ad unit code in the JSX below.
  // 3. AdSense provides callbacks to know when a user has successfully watched an ad.
  //    You would use that callback to set the ad as watched.
  //
  // For this prototype, we'll simulate this by setting the ad as "watched" after a delay.
  // =========================================================================
  useEffect(() => {
    if (ad) {
      // SIMULATION: Pretend the ad was watched after its duration.
      const timer = setTimeout(() => {
        setIsAdWatched(true);
        toast({
          title: "Ad Complete!",
          description: "You can now claim your reward.",
        })
      }, ad.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [ad, toast]);


  const handleClaimReward = async () => {
    if (!ad) return;
    setIsClaiming(true);
    
    // The AI verification can remain as part of your business logic
    const result = await verifyAdView(ad);

    if (result.success) {
      // The addReward hook now handles the automatic transfer via Flutterwave
      addReward(result.reward);
      toast({
        title: "Reward Claimed!",
        description: `Your reward of $${result.reward.toFixed(2)} is being processed.`,
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Claim Failed",
        description: result.reason,
      });
      setIsClaiming(false);
    }
  };

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={() => router.push('/dashboard')} variant="link" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Dashboard</Button>
        </CardContent>
      </Card>
    );
  }

  if (!ad) {
    return <div>Loading ad...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={() => router.back()} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{ad.title}</CardTitle>
          <CardDescription>{ad.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 
            =========================================================================
            ** GOOGLE ADSENSE AD PLACEMENT **
            =========================================================================
            This is where you would place your Google AdSense ad unit code.
            It will look something like this:

            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-YOUR_CLIENT_ID"
                 data-ad-slot="YOUR_AD_SLOT_ID"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            
            For this prototype, we show a placeholder.
            =========================================================================
          */}
          <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative mb-4 flex items-center justify-center text-background">
              <div className="text-center p-4">
                <h3 className="text-2xl font-bold">Google Ad Will Display Here</h3>
                <p className="text-muted-foreground mt-2">The ad is "playing" now. The claim button will be enabled when it's finished.</p>
              </div>
          </div>
          
          <Button 
            onClick={handleClaimReward} 
            disabled={!isAdWatched || isClaiming}
            className="w-full"
            size="lg"
          >
            {isClaiming ? 'Verifying & Processing...' : (isAdWatched ? 'Claim Reward' : 'Watch Ad to Claim')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
