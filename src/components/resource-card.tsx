import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Lock, FileText, Video, Image as ImageIcon, Download, Play, Layers, ExternalLink, Globe, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string | string[];
  ageGroup: string[];
  difficulty: string[];
  format: string;
  accessLevel: "BASIC" | "PREMIUM";
  imageUrl: string;
  videoUrl?: string;
  flashcardHref?: string;
  externalUrl?: string;
  sourceName?: string;
  keyPoints?: string[];
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
        {resource.sourceName && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
            <Globe className="w-3.5 h-3.5 text-[#1FA7E1] shrink-0" />
            <span className="truncate">{resource.sourceName}</span>
          </div>
        )}
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
        ) : resource.externalUrl ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setShowPreview(true)}
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              Xem tóm tắt
            </Button>
            <Button
              size="sm"
              className="text-xs bg-[#1FA7E1] hover:bg-[#1994c8] text-white"
              asChild
            >
              <a href={resource.externalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Mở bài viết
              </a>
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={() => setShowPreview(true)}>
            {getActionIcon(resource.format)}
            Xem trước
          </Button>
        )}
      </CardFooter>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {resource.sourceName && (
                <Badge variant="secondary" className="text-xs bg-sky-50 text-sky-700 border border-sky-200">
                  <Globe className="w-3 h-3 mr-1 text-[#1FA7E1]" />
                  {resource.sourceName}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {resource.format}
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 leading-snug">
              {resource.title}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 space-y-4">
            {resource.format === "Video" ? (
              resource.videoUrl ? (
                <video
                  src={resource.videoUrl}
                  poster={imageSrc}
                  controls
                  preload="metadata"
                  className="w-full max-h-[60vh] bg-black rounded-lg"
                />
              ) : (
                <div className="relative w-full aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
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
            ) : (
              <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden bg-slate-100 border">
                <img
                  src={imageSrc}
                  alt={resource.title}
                  onError={() => setImageSrc(FALLBACK_IMAGE)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {resource.ageGroup.map((age) => (
                <Badge key={age} variant="outline" className="text-xs bg-slate-50">
                  {age}
                </Badge>
              ))}
              {resource.difficulty.map((diff) => (
                <Badge
                  key={diff}
                  variant="outline"
                  className="text-xs bg-[#1FA7E1]/10 text-[#1FA7E1] border-[#1FA7E1]/30 font-semibold"
                >
                  {diff}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-slate-700 text-sm leading-relaxed">{resource.description}</p>
            </div>

            {resource.keyPoints && resource.keyPoints.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-2.5">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Nội dung trọng tâm & Kỹ thuật can thiệp:
                </div>
                <ul className="space-y-2 text-slate-700 text-xs sm:text-sm pl-1">
                  {resource.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#1FA7E1] font-bold shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resource.externalUrl && (
              <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-sky-900">
                <span>Đọc bài viết đầy đủ với đầy đủ nội dung chuyên sâu từ nguồn chính thức.</span>
                <Button size="sm" className="bg-[#1FA7E1] hover:bg-[#1994c8] text-white shrink-0" asChild>
                  <a href={resource.externalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Truy cập nguồn
                  </a>
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center sm:justify-between w-full pt-3 border-t">
            <p className="text-xs text-slate-500 mr-auto hidden sm:block">
              {resource.format} · {Array.isArray(resource.category) ? resource.category.join(", ") : resource.category}
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="flex-1 sm:flex-none"
              >
                Đóng
              </Button>
              {resource.externalUrl ? (
                <Button
                  className="flex-1 sm:flex-none bg-[#1FA7E1] hover:bg-[#1994c8] text-white"
                  asChild
                >
                  <a href={resource.externalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Mở bài viết gốc
                  </a>
                </Button>
              ) : (
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
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
