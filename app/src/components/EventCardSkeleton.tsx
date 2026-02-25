import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const EventCardSkeleton = () => (
    <Card className="flex flex-col bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
        <CardHeader>
            <div className="animate-pulse space-y-3">
                {/* Title placeholder */}
                <div className="h-6 bg-gray-200 dark:bg-[#2a2a2a] rounded w-3/4"></div>
                {/* Description placeholder */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-5/6"></div>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
            <div className="animate-pulse space-y-3 flex-1">
                {/* Date placeholder */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-[#333] rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-2/3"></div>
                </div>
                {/* Location placeholder */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-[#333] rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-1/2"></div>
                </div>
                {/* Attendees placeholder */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-[#333] rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-[#272727] rounded w-1/3"></div>
                </div>
            </div>

            {/* Button placeholder */}
            <div className="mt-auto space-y-2 pt-4">
                <div className="h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded w-full"></div>
            </div>
        </CardContent>
    </Card>
);

export default EventCardSkeleton;
