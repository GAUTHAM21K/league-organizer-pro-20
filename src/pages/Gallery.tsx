
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - In a real app, this would come from a database
const mockGalleryImages = {
  asl: [
    { id: 1, url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1936&auto=format&fit=crop", caption: "ASL Opening Ceremony", date: "2023-09-12" },
    { id: 2, url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1770&auto=format&fit=crop", caption: "Engineering Tigers vs Medicine United", date: "2023-09-15" },
    { id: 3, url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2033&auto=format&fit=crop", caption: "Science Strikers Victory", date: "2023-09-20" },
    { id: 4, url: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop", caption: "Arts Avengers Team Photo", date: "2023-09-25" },
  ],
  apl: [
    { id: 5, url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1767&auto=format&fit=crop", caption: "APL Trophy Ceremony", date: "2023-10-05" },
    { id: 6, url: "https://images.unsplash.com/photo-1624526267942-ab0c6b5b8b2a?q=80&w=1770&auto=format&fit=crop", caption: "Pharmacy Phoenix vs Engineering Eagles", date: "2023-10-10" },
    { id: 7, url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1905&auto=format&fit=crop", caption: "Medicine Mavericks Bowling", date: "2023-10-15" },
    { id: 8, url: "https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?q=80&w=1770&auto=format&fit=crop", caption: "Team Celebration", date: "2023-10-20" },
  ]
};

const GalleryImage = ({ image }: { image: { url: string, caption: string, date: string } }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        {!loaded && (
          <Skeleton className="absolute inset-0 h-full w-full" />
        )}
        <img 
          src={image.url} 
          alt={image.caption} 
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium">{image.caption}</h3>
        <p className="text-xs text-gray-500">{image.date}</p>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<string>("asl");
  const [loading, setLoading] = useState(true);
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Gallery</h1>
            <p className="text-gray-600">Browse photos from our tournaments</p>
          </div>
          
          <Tabs defaultValue="asl" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="asl">Ahalia Soccer League</TabsTrigger>
                <TabsTrigger value="apl">Ahalia Premier League</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="asl" className="mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg bg-white shadow-md">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-3">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  mockGalleryImages.asl.map(image => (
                    <GalleryImage key={image.id} image={image} />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="apl" className="mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg bg-white shadow-md">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-3">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  mockGalleryImages.apl.map(image => (
                    <GalleryImage key={image.id} image={image} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
