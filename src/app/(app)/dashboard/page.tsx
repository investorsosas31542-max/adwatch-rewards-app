import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ads } from "@/lib/ads";
import { DollarSign, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Available Ads</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={ad.thumbnailUrl}
                  alt={ad.title}
                  fill
                  objectFit="cover"
                  data-ai-hint={ad.thumbnailHint}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg font-semibold mb-2 leading-tight">{ad.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{ad.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 bg-muted/40 flex flex-col items-start gap-4 mt-auto">
              <div className="flex justify-between w-full">
                <Badge variant="secondary" className="flex items-center gap-1.5 py-1 px-2.5">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">{ad.reward.toFixed(2)}</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1.5 py-1 px-2.5">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{ad.duration}s</span>
                </Badge>
              </div>
              <Link href={`/ad/${ad.id}`} className="w-full">
                <Button className="w-full">Watch Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
