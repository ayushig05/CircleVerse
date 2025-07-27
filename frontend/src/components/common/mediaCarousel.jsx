import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

const MediaCarousel = ({ media = [] }) => {
  if (!media.length) {
    return null;
  }

  return (
    <div className="w-full max-w-[400px] sm:max-w-md md:max-w-lg mx-auto relative">
      <Carousel className="relative">
        <CarouselContent className="-ml-1">
          {media.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-1 basis-full flex items-center justify-center h-[280px] sm:h-[300px] bg-black rounded-md overflow-hidden"
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`Preview-${index}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {media.length > 1 && (
          <>
            <CarouselPrevious className="-left-7 top-1/2 transform -translate-y-1/2 z-10 bg-transparent border-none shadow-none hover:bg-transparent hover:shadow-none" />
            <CarouselNext className="-right-7 top-1/2 transform -translate-y-1/2 z-10 bg-transparent border-none shadow-none hover:bg-transparent hover:shadow-none" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default MediaCarousel;
