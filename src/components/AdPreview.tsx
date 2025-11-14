import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface AdPreviewProps {
  headline: string;
  text: string;
}

export const AdPreview = ({ headline, text }: AdPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Превью объявления</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-card">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-4xl opacity-30">🎯</div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground line-clamp-2">
                  {headline || "Заголовок объявления"}
                </h4>
              </div>
              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                Реклама
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {text || "Текст вашего объявления появится здесь..."}
            </p>
            <button className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              Перейти
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
