import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VKAdSimulator } from "@/components/VKAdSimulator";
import { Lock } from "lucide-react";

export const AdCabinet = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("vk");

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Рекламный кабинет</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="vk">Имитатор VK Реклама</TabsTrigger>
              <TabsTrigger value="yandex" disabled>
                <Lock className="h-3 w-3 mr-2" />
                Яндекс Директ (Скоро)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vk" className="mt-6">
              <VKAdSimulator />
            </TabsContent>

            <TabsContent value="yandex" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Lock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Этот раздел находится в разработке</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
