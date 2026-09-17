import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Lock, FileText, Video, Image as ImageIcon, Download, Play } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  ageGroup: string[];
  difficulty: string[];
  format: string;
  accessLevel: "BASIC" | "PREMIUM";
  imageUrl: string;
}

interface ResourceCardProps {
  resource: Resource;
  userType: "free" | "premium";
}

export function ResourceCard({ resource, userType }: ResourceCardProps) {
  const isLocked = resource.accessLevel === "PREMIUM" && userType === "free";

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Video":
        return <Video className="w-4 h-4" />;
      case "PDF":
        return <FileText className="w-4 h-4" />;
      case "Hình ảnh":
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionIcon = (format: string) => {
    return format === "Video" ? <Play className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />;
  };

  const getActionText = (format: string) => {
    return format === "Video" ? "Xem video" : "Tải xuống";
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md h-full">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={resource.imageUrl}
          alt={resource.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {resource.accessLevel === "PREMIUM" ? (
            <Badge variant="default" className="bg-[#FFB365] text-white hover:bg-[#E59845] border-none font-bold">
              <Lock className="w-3 h-3 mr-1" /> Premium
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-[#6ED1CF] text-white hover:bg-[#4BB3B1] border-none font-bold">
              Basic
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-black/50 text-white border-none flex items-center gap-1 backdrop-blur-sm">
            {getFormatIcon(resource.format)}
            <span className="ml-1">{resource.format}</span>
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2 flex-none">
        <div className="flex flex-wrap gap-1 mb-2">
          {resource.ageGroup.map((age) => (
            <Badge key={age} variant="outline" className="text-xs bg-slate-50">
              {age}
            </Badge>
          ))}
          {resource.difficulty.map((diff) => (
            <Badge key={diff} variant="outline" className="text-xs bg-[#1FA7E1]/10 text-[#1FA7E1] border-[#1FA7E1]/30 font-semibold">
              {diff}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{resource.title}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex-none mt-auto">
        {isLocked ? (
          <Button variant="outline" className="w-full bg-slate-50 text-slate-500 cursor-not-allowed" disabled>
            <Lock className="w-4 h-4 mr-2" />
            Nâng cấp để {getActionText(resource.format).toLowerCase()}
          </Button>
        ) : (
          <Button className="w-full">
            {getActionIcon(resource.format)}
            {getActionText(resource.format)}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
