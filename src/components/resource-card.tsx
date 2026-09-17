import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Lock, FileText, Video, Image as ImageIcon, Download, Play, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import type { Resource } from "../lib/mock-data";

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

  const articleUrl = resource.articleUrl && resource.articleUrl !== "#" ? resource.articleUrl : undefined;

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

  const downloadUrl = resource.videoUrl ?? articleUrl ?? resource.imageUrl;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 h-full rounded-[1.5rem] border-2 border-slate-100/80 bg-white">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={resource.title}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-slate-200/50">
            <img src="/bino-ai-mascot.png" alt="Bino" className="w-6 h-6 object-contain drop-shadow-sm" />
          </div>
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
            <Badge
              key={diff}
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
            >
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
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl font-bold shadow-sm" asChild>
            <Link to="/premium">
              <Lock className="w-4 h-4 mr-2" />
              Nâng cấp để {getActionText(resource.format).toLowerCase()}
            </Link>
          </Button>
        ) : resource.flashcardHref ? (
          <Button className="w-full rounded-xl font-bold shadow-sm" asChild>
            <Link to="/library/flashcards" search={{ deck: resource.id }}>
              <Layers className="w-4 h-4 mr-2" />
              Mở flashcard
            </Link>
          </Button>
        ) : (
          <Button className="w-full rounded-xl font-bold shadow-sm" onClick={() => setShowPreview(true)}>
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
              resource.videoUrl && (resource.videoUrl.includes("youtube") || resource.videoUrl.includes("youtu.be")) ? (
                <div className="w-full aspect-video">
                  <iframe
                    src={resource.videoUrl.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/").replace(/[?&]si=[^&]*/, "")}
                    title={resource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-md"
                  />
                </div>
              ) : resource.videoUrl ? (
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
                {articleUrl ? (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 flex flex-col gap-2">
                    <span className="font-semibold">Nguồn bài viết</span>
                    <span>
                      Bài viết được tổng hợp từ nguồn uy tín. Nhấn nút bên dưới để đọc toàn bộ bài viết gốc.
                    </span>
                    <a
                      href={articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Đọc bài viết gốc
                    </a>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 flex flex-col gap-2">
                    <span className="font-semibold">Bản xem trước</span>
                    <span>
                      Đây là nội dung tóm tắt. Vui lòng tải xuống tài liệu để đọc toàn bộ bài viết
                      chi tiết cùng các hướng dẫn chuyên sâu.
                    </span>
                  </div>
                )}
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
