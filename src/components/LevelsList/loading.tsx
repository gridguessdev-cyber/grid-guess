import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LevelLoadingItem = () => {
  return <Skeleton className="h-15" style={{ borderRadius: 12 }} />;
};

export default function LevelsListLoading() {
  return (
    <SkeletonTheme baseColor="white" highlightColor="#e0e0e0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LevelLoadingItem />
        <LevelLoadingItem />
        <LevelLoadingItem />
        <LevelLoadingItem />
        <LevelLoadingItem />
        <LevelLoadingItem />
        <LevelLoadingItem />
        <LevelLoadingItem />
        <LevelLoadingItem />
      </div>
    </SkeletonTheme>
  );
}
