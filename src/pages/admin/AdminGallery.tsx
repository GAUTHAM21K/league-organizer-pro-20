
import { useState } from 'react';
import { TournamentToggle } from '@/components/ui/tournament-toggle';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  X, 
  Trash2,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Mock data - same as in Gallery.tsx
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

const AdminGallery = ({ tournamentType }: { tournamentType: string }) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    caption: '',
    date: new Date().toISOString().split('T')[0],
    file: null as File | null,
    previewUrl: ''
  });
  
  // In a real app, this would be a state management solution like React Query
  const [galleryImages, setGalleryImages] = useState(mockGalleryImages);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setNewImage({
      ...newImage,
      file,
      previewUrl: URL.createObjectURL(file)
    });
  };
  
  const handleSubmit = () => {
    if (!newImage.file || !newImage.caption) {
      toast({
        title: "Error",
        description: "Please provide an image and caption",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, upload the image to a storage service and save metadata in DB
    // Simulate adding a new image
    const newImageObj = {
      id: Math.floor(Math.random() * 1000),
      url: newImage.previewUrl,
      caption: newImage.caption,
      date: newImage.date
    };
    
    setGalleryImages({
      ...galleryImages,
      [tournamentType]: [...galleryImages[tournamentType as keyof typeof galleryImages], newImageObj]
    });
    
    toast({
      title: "Success",
      description: "Image uploaded successfully"
    });
    
    // Reset form and close dialog
    setNewImage({
      caption: '',
      date: new Date().toISOString().split('T')[0],
      file: null,
      previewUrl: ''
    });
    setIsDialogOpen(false);
  };
  
  const handleDeleteImage = (id: number) => {
    setGalleryImages({
      ...galleryImages,
      [tournamentType]: galleryImages[tournamentType as keyof typeof galleryImages]
        .filter(img => img.id !== id)
    });
    
    toast({
      title: "Success",
      description: "Image deleted successfully"
    });
  };
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gallery Management - {tournamentType === "asl" ? "Ahalia Soccer League" : "Ahalia Premier League"}
          </h2>
          <p className="text-gray-600">
            Upload and manage tournament photos
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="gap-2"
        >
          <PlusCircle size={16} />
          Upload Image
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {galleryImages[tournamentType as keyof typeof galleryImages].map(image => (
          <div key={image.id} className="group relative overflow-hidden rounded-lg bg-white shadow-md">
            <div className="aspect-video overflow-hidden">
              <img src={image.url} alt={image.caption} className="h-full w-full object-cover" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium">{image.caption}</h3>
              <p className="text-xs text-gray-500">{image.date}</p>
            </div>
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteImage(image.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      
      {/* Image Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Add a new image to the tournament gallery
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <Label htmlFor="image-upload" className="block mb-2">Image</Label>
              {newImage.previewUrl ? (
                <div className="relative aspect-video mb-2 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={newImage.previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => setNewImage({...newImage, file: null, previewUrl: ''})}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="caption">Caption</Label>
              <Input 
                id="caption" 
                value={newImage.caption} 
                onChange={(e) => setNewImage({...newImage, caption: e.target.value})}
                placeholder="Enter image caption"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={newImage.date} 
                onChange={(e) => setNewImage({...newImage, date: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="gap-2"
              disabled={!newImage.file || !newImage.caption}
            >
              <Upload size={16} />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
