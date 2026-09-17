import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Lock, FileText, Video, Image as ImageIcon, Download, Play, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

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
  videoUrl?: string;
  flashcardHref?: string;
}

interface ResourceCardProps {
  resource: Resource;
  userType: "free" | "premium";
}

const FALLBACK_IMAGE = "/bino-ai-mascot.png";

export function ResourceCard({ resource, userType }: ResourceCardProps) {
  const isLocked = resource.accessLevel === "PREMIUM" && userType === "free";
  const [showPreview, setShowPreview] = useState(false);
  const [imageSrc, setImageSrc] = useState(resource.imageUrl);

  useEffect(() => {
    setImageSrc(resource.imageUrl);
  }, [resource.imageUrl]);

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
    return format === "Video" ? (
      <Play className="w-4 h-4 mr-2" />
    ) : (
      <Download className="w-4 h-4 mr-2" />
    );
  };

  const getActionText = (format: string) => {
    return format === "Video" ? "Xem video" : "Tải xuống";
  };

  const downloadUrl = resource.videoUrl ?? resource.imageUrl;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md h-full">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={resource.title}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
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
          <Badge
            variant="outline"
            className="bg-black/50 text-white border-none flex items-center gap-1 backdrop-blur-sm"
          >
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
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none" asChild>
            <Link to="/premium">
              <Lock className="w-4 h-4 mr-2" />
              Nâng cấp để {getActionText(resource.format).toLowerCase()}
            </Link>
          </Button>
        ) : resource.flashcardHref ? (
          <Button className="w-full" asChild>
            <Link to="/library/flashcards" search={{ deck: resource.id }}>
              <Layers className="w-4 h-4 mr-2" />
              Mở flashcard
            </Link>
          </Button>
        ) : (
          <Button className="w-full" onClick={() => setShowPreview(true)}>
            {getActionIcon(resource.format)}
            Xem trước
          </Button>
        )}
      </CardFooter>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{resource.title}</DialogTitle>
          </DialogHeader>
          <div
            className={`py-4 flex flex-col bg-slate-50 rounded-lg overflow-hidden min-h-[300px] ${
              resource.format === "Bài viết"
                ? "items-start justify-start"
                : "items-center justify-center"
            }`}
          >
            {resource.format === "Video" ? (
              resource.videoUrl ? (
                <video
                  src={resource.videoUrl}
                  poster={imageSrc}
                  controls
                  preload="metadata"
                  className="w-full max-h-[70vh] bg-black rounded-md"
                />
              ) : (
                <div className="relative w-full aspect-video bg-black flex items-center justify-center group">
                  <img
                    src={imageSrc}
                    alt={resource.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              )
            ) : resource.format === "Bài viết" ? (
              <div className="w-full px-6 pb-2 text-left">
                <img
                  src={imageSrc}
                  alt={resource.title}
                  onError={() => setImageSrc(FALLBACK_IMAGE)}
                  className="w-full h-48 object-cover rounded-md mb-4 shadow-sm"
                />
                <p className="text-slate-700 leading-relaxed">{resource.description}</p>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 flex flex-col gap-2">
                  <span className="font-semibold">Bản xem trước</span>
                  <span>
                    Đây là nội dung tóm tắt. Vui lòng tải xuống tài liệu để đọc toàn bộ bài viết
                    chi tiết cùng các hướng dẫn chuyên sâu.
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={imageSrc}
                alt={resource.title}
                onError={() => setImageSrc(FALLBACK_IMAGE)}
                className="max-h-[60vh] object-contain rounded-md shadow-sm"
              />
            )}
          </div>
          <DialogFooter className="flex items-center sm:justify-between w-full">
            <p className="text-sm text-slate-500 mr-auto hidden sm:block">
              {resource.format} · {resource.category}
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="flex-1 sm:flex-none"
              >
                Đóng
              </Button>
              <Button
                className="flex-1 sm:flex-none"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = resource.title;
                  a.target = "_blank";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  setShowPreview(false);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Tải xuống
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
