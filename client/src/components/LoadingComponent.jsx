import React from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const LoadingComponent = ({ number }) => {
  console.log(window.location.pathname.includes("profile"));
  return (
    <div
      className={
        number === 4
          ? "grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-2"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4 mb-2"
      }
    >
      {Array.from({ length: number }).map((_, i) => (
        <Card key={i}>
          <Skeleton className={"w-full h-[200px]"} />
          <div className="flex flex-col gap-3 m-3">
            <Skeleton className={"w-14 h-5"} />
            <Skeleton className={"w-14 h-5"} />
            <Skeleton className={"w-14 h-5"} />
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Skeleton className={"w-24 h-6"} />
                <Skeleton className={"w-24 h-6"} />
              </div>
              <div className="flex gap-3">
                {!window.location.pathname.includes("profile") && (
                  <Skeleton className={"w-8 h-8"} />
                )}
                <Skeleton className={"w-8 h-8"} />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LoadingComponent;
