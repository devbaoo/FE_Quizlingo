import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
    ActiveBookSvg,
    LockedBookSvg,
    CheckmarkSvg,
    LockedDumbbellSvg,
    FastForwardSvg,
    GoldenBookSvg,
    GoldenDumbbellSvg,
    GoldenTreasureSvg,
    GoldenTrophySvg,
    LessonCompletionSvg0,
    LessonCompletionSvg1,
    LessonCompletionSvg2,
    LessonCompletionSvg3,
    LockSvg,
    StarSvg,
    LockedTreasureSvg,
    LockedTrophySvg,
    ActiveTreasureSvg,
    ActiveTrophySvg,
    ActiveDumbbellSvg,
    PracticeExerciseSvg,
} from "@/components/ui/Svgs";
import { Link } from "react-router-dom";
import { type Tile, type TileType, type Unit } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchTopics } from "@/services/features/topic/topicSlice";
import { fetchLessons } from "@/services/features/lesson/lessonSlice";

// Trạng thái của mỗi tile
// Không dùng useBoundStore, chỉ dùng state cục bộ cho lessonsCompleted

type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";
// (Bạn có thể thay đổi logic này nếu muốn lưu lessonsCompleted vào localStorage hoặc backend)| "ACTIVE" | "COMPLETE";

const tileStatus = (tile: Tile, lessonsCompleted: number, tiles: Tile[]): TileStatus => {
    const lessonsPerTile = 4;
    const tileIndex = tiles.findIndex((t) => t === tile);
    const tilesCompleted = Math.floor(lessonsCompleted / lessonsPerTile);
    if (tileIndex < tilesCompleted) return "COMPLETE";
    if (tileIndex > tilesCompleted) return "LOCKED";
    return "ACTIVE";
};

const TileIcon = ({
    tileType,
    status,
}: {
    tileType: TileType;
    status: TileStatus;
}): JSX.Element => {
    switch (tileType) {
        case "star":
            return status === "COMPLETE" ? (
                <CheckmarkSvg />
            ) : status === "ACTIVE" ? (
                <StarSvg />
            ) : (
                <LockSvg />
            );
        case "book":
            return status === "COMPLETE" ? (
                <GoldenBookSvg />
            ) : status === "ACTIVE" ? (
                <ActiveBookSvg />
            ) : (
                <LockedBookSvg />
            );
        case "dumbbell":
            return status === "COMPLETE" ? (
                <GoldenDumbbellSvg />
            ) : status === "ACTIVE" ? (
                <ActiveDumbbellSvg />
            ) : (
                <LockedDumbbellSvg />
            );
        case "fast-forward":
            return status === "COMPLETE" ? (
                <CheckmarkSvg />
            ) : status === "ACTIVE" ? (
                <StarSvg />
            ) : (
                <FastForwardSvg />
            );
        case "treasure":
            return status === "COMPLETE" ? (
                <GoldenTreasureSvg />
            ) : status === "ACTIVE" ? (
                <ActiveTreasureSvg />
            ) : (
                <LockedTreasureSvg />
            );
        case "trophy":
            return status === "COMPLETE" ? (
                <GoldenTrophySvg />
            ) : status === "ACTIVE" ? (
                <ActiveTrophySvg />
            ) : (
                <LockedTrophySvg />
            );
    }
};

const tileLeftClassNames = [
    "left-0",
    "left-[-45px]",
    "left-[-70px]",
    "left-[-45px]",
    "left-0",
    "left-[45px]",
    "left-[70px]",
    "left-[45px]",
] as const;

type TileLeftClassName = (typeof tileLeftClassNames)[number];

const getTileLeftClassName = ({
    index,
    unitNumber,
    tilesLength,
}: {
    index: number;
    unitNumber: number;
    tilesLength: number;
}): TileLeftClassName => {
    if (index >= tilesLength - 1) {
        return "left-0";
    }

    const classNames =
        unitNumber % 2 === 1
            ? tileLeftClassNames
            : [...tileLeftClassNames.slice(4), ...tileLeftClassNames.slice(0, 4)];

    return classNames[index % classNames.length] ?? "left-0";
};

const tileTooltipLeftOffsets = [140, 95, 70, 95, 140, 185, 210, 185] as const;

type TileTooltipLeftOffset = (typeof tileTooltipLeftOffsets)[number];

const getTileTooltipLeftOffset = ({
    index,
    unitNumber,
    tilesLength,
}: {
    index: number;
    unitNumber: number;
    tilesLength: number;
}): TileTooltipLeftOffset => {
    if (index >= tilesLength - 1) {
        return tileTooltipLeftOffsets[0];
    }

    const offsets =
        unitNumber % 2 === 1
            ? tileTooltipLeftOffsets
            : [
                ...tileTooltipLeftOffsets.slice(4),
                ...tileTooltipLeftOffsets.slice(0, 4),
            ];

    return offsets[index % offsets.length] ?? tileTooltipLeftOffsets[0];
};

const getTileColors = ({
    tileType,
    status,
    defaultColors,
}: {
    tileType: TileType;
    status: TileStatus;
    defaultColors: `border-${string} bg-${string}`;
}): `border-${string} bg-${string}` => {
    switch (status) {
        case "LOCKED":
            if (tileType === "fast-forward") return defaultColors;
            return "border-[#b7b7b7] bg-[#e5e5e5]";
        case "COMPLETE":
            return "border-yellow-500 bg-yellow-400";
        case "ACTIVE":
            return defaultColors;
    }
};

const TileTooltip = ({
    selectedTile,
    index,
    unitNumber,
    tilesLength,
    description,
    status,
    closeTooltip,
    backgroundColor,
    textColor,
    lessonId,
}: {
    selectedTile: number | null;
    index: number;
    unitNumber: number;
    tilesLength: number;
    description: string;
    status: TileStatus;
    closeTooltip: () => void;
    backgroundColor: string;
    textColor: string;
    lessonId?: string;
}) => {
    const tileTooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const containsTileTooltip = (event: MouseEvent) => {
            if (selectedTile !== index) return;
            const clickIsInsideTooltip = tileTooltipRef.current?.contains(
                event.target as Node,
            );
            if (clickIsInsideTooltip) return;
            closeTooltip();
        };

        window.addEventListener("click", containsTileTooltip, true);
        return () => window.removeEventListener("click", containsTileTooltip, true);
    }, [selectedTile, tileTooltipRef, closeTooltip, index]);

    const activeBackgroundColor = backgroundColor ?? "bg-green-500";
    const activeTextColor = textColor ?? "text-green-500";

    return (
        <div
            className={[
                "relative h-0 w-full",
                index === selectedTile ? "" : "invisible",
            ].join(" ")}
            ref={tileTooltipRef}
        >
            <div
                className={[
                    "absolute z-30 flex w-[300px] flex-col gap-4 rounded-xl p-4 font-bold transition-all duration-300",
                    status === "ACTIVE"
                        ? activeBackgroundColor
                        : status === "LOCKED"
                            ? "border-2 border-gray-200 bg-gray-100"
                            : "bg-yellow-400",
                    index === selectedTile ? "top-4 scale-100" : "-top-14 scale-0",
                ].join(" ")}
                style={{ left: "calc(50% - 150px)" }}
            >
                <div
                    className={[
                        "absolute left-[140px] top-[-8px] h-4 w-4 rotate-45",
                        status === "ACTIVE"
                            ? activeBackgroundColor
                            : status === "LOCKED"
                                ? "border-l-2 border-t-2 border-gray-200 bg-gray-100"
                                : "bg-yellow-400",
                    ].join(" ")}
                    style={{
                        left: getTileTooltipLeftOffset({ index, unitNumber, tilesLength }),
                    }}
                ></div>
                <div
                    className={[
                        "text-lg",
                        status === "ACTIVE"
                            ? "text-white"
                            : status === "LOCKED"
                                ? "text-gray-400"
                                : "text-yellow-600",
                    ].join(" ")}
                >
                    {description}
                </div>
                {status === "ACTIVE" ? (
                    <Link
                        to={lessonId ? `/lesson/${lessonId}` : "/learn"}
                        className={[
                            "flex w-full items-center justify-center rounded-xl border-b-4 border-gray-200 bg-white p-3 uppercase",
                            activeTextColor,
                        ].join(" ")}
                    >
                        Start +10 XP
                    </Link>
                ) : status === "LOCKED" ? (
                    <button
                        className="w-full rounded-xl bg-gray-200 p-3 uppercase text-gray-400"
                        disabled
                    >
                        Locked
                    </button>
                ) : (
                    <Link
                        to={lessonId ? `/lesson/${lessonId}` : "/learn"}
                        className="flex w-full items-center justify-center rounded-xl border-b-4 border-yellow-200 bg-white p-3 uppercase text-yellow-400"
                    >
                        Practice +5 XP
                    </Link>
                )}
            </div>
        </div>
    );
};

const UnitSection = ({ unit }: { unit: Unit }): JSX.Element => {
    const [selectedTile, setSelectedTile] = useState<null | number>(null);
    // lessonsCompleted chỉ dùng local state demo, bạn có thể thay đổi thành global hoặc lưu localStorage nếu muốn
    const [lessonsCompleted, setLessonsCompleted] = useState(0);
    const closeTooltip = useCallback(() => setSelectedTile(null), []);

    return (
        <>
            <UnitHeader
                unitNumber={unit.unitNumber}
                description={unit.description}
                backgroundColor={unit.backgroundColor}
            />
            <div className="relative mb-8 mt-[67px] flex max-w-2xl flex-col items-center gap-4">
                {unit.tiles.map((tile, i): JSX.Element => {
                    const status = tileStatus(tile, lessonsCompleted, unit.tiles);
                    return (
                        <Fragment key={i}>
                            {(() => {
                                switch (tile.type) {
                                    case "star":
                                    case "book":
                                    case "dumbbell":
                                    case "trophy":
                                    case "fast-forward":
                                        if (tile.type === "trophy" && status === "COMPLETE") {
                                            return (
                                                <div className="relative">
                                                    <TileIcon tileType={tile.type} status={status} />
                                                    <div className="absolute left-0 right-0 top-6 flex justify-center text-lg font-bold text-yellow-700">
                                                        {unit.unitNumber}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                className={[
                                                    "relative -mb-4 h-[93px] w-[98px]",
                                                    getTileLeftClassName({
                                                        index: i,
                                                        unitNumber: unit.unitNumber,
                                                        tilesLength: unit.tiles.length,
                                                    }),
                                                ].join(" ")}
                                            >
                                                {tile.type === "fast-forward" && status === "LOCKED" ? (
                                                    <HoverLabel
                                                        text="Jump here?"
                                                        textColor={unit.textColor}
                                                    />
                                                ) : selectedTile !== i && status === "ACTIVE" ? (
                                                    <HoverLabel text="Start" textColor={unit.textColor} />
                                                ) : null}
                                                <LessonCompletionSvg
                                                    lessonsCompleted={lessonsCompleted}
                                                    status={status}
                                                />
                                                <button
                                                    className={[
                                                        "absolute m-3 rounded-full border-b-8 p-4",
                                                        getTileColors({
                                                            tileType: tile.type,
                                                            status,
                                                            defaultColors: `${unit.borderColor} ${unit.backgroundColor}`,
                                                        }),
                                                    ].join(" ")}
                                                    onClick={() => {
                                                        if (
                                                            tile.type === "fast-forward" &&
                                                            status === "LOCKED"
                                                        ) {
                                                            // Chuyển trang hoặc logic khác nếu muốn
                                                            return;
                                                        }
                                                        setSelectedTile(i);
                                                    }}
                                                >
                                                    <TileIcon tileType={tile.type} status={status} />
                                                    <span className="sr-only">Show lesson</span>
                                                </button>
                                            </div>
                                        );
                                    case "treasure":
                                        return (
                                            <div
                                                className={[
                                                    "relative -mb-4",
                                                    getTileLeftClassName({
                                                        index: i,
                                                        unitNumber: unit.unitNumber,
                                                        tilesLength: unit.tiles.length,
                                                    }),
                                                ].join(" ")}
                                                onClick={() => {
                                                    if (status === "ACTIVE") {
                                                        setLessonsCompleted((c) => c + 4);
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={status === "ACTIVE" ? 0 : undefined}
                                                aria-hidden={status !== "ACTIVE"}
                                                aria-label={status === "ACTIVE" ? "Collect reward" : ""}
                                            >
                                                {status === "ACTIVE" && (
                                                    <HoverLabel text="Open" textColor="text-yellow-400" />
                                                )}
                                                <TileIcon tileType={tile.type} status={status} />
                                            </div>
                                        );
                                }
                            })()}
                            <TileTooltip
                                selectedTile={selectedTile}
                                index={i}
                                unitNumber={unit.unitNumber}
                                tilesLength={unit.tiles.length}
                                description={(() => {
                                    switch (tile.type) {
                                        case "book":
                                        case "dumbbell":
                                        case "star":
                                            return tile.description;
                                        case "fast-forward":
                                            return status === "LOCKED"
                                                ? "Jump here?"
                                                : tile.description;
                                        case "trophy":
                                            return `Unit ${unit.unitNumber} review`;
                                        case "treasure":
                                            return "";
                                    }
                                })()}
                                status={status}
                                closeTooltip={closeTooltip}
                                backgroundColor={unit.backgroundColor}
                                textColor={unit.textColor}
                                lessonId={tile.lessonId}
                            />
                        </Fragment>
                    );
                })}
            </div>
        </>
    );
};

const LessonCompletionSvg = ({
    lessonsCompleted,
    status,
    style = {},
}: {
    lessonsCompleted: number;
    status: TileStatus;
    style?: React.HTMLAttributes<SVGElement>["style"];
}) => {
    if (status !== "ACTIVE") {
        return null;
    }
    switch (lessonsCompleted % 4) {
        case 0:
            return <LessonCompletionSvg0 style={style} />;
        case 1:
            return <LessonCompletionSvg1 style={style} />;
        case 2:
            return <LessonCompletionSvg2 style={style} />;
        case 3:
            return <LessonCompletionSvg3 style={style} />;
        default:
            return null;
    }
};

const HoverLabel = ({
    text,
    textColor,
}: {
    text: string;
    textColor: `text-${string}`;
}) => {
    const hoverElement = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(72);

    useEffect(() => {
        setWidth(hoverElement.current?.clientWidth ?? width);
    }, [hoverElement.current?.clientWidth, width]);

    return (
        <div
            className={`absolute z-10 w-max animate-bounce rounded-lg border-2 border-gray-200 bg-white px-3 py-2 font-bold uppercase ${textColor}`}
            style={{
                top: "-25%",
                left: `calc(50% - ${width / 2}px)`,
            }}
            ref={hoverElement}
        >
            {text}
            <div
                className="absolute h-3 w-3 rotate-45 border-b-2 border-r-2 border-gray-200 bg-white"
                style={{ left: "calc(50% - 8px)", bottom: "-8px" }}
            ></div>
        </div>
    );
};

const UnitHeader = ({
    unitNumber,
    description,
    backgroundColor,

}: {
    unitNumber: number;
    description: string;
    backgroundColor: `bg-${string}`;

}) => {
    return (
        <article
            className={[
                "max-w-2xl w-[calc(100%+40px)] ml-[-20px] text-white sm:rounded-xl",
                backgroundColor
            ].join(" ")}
        >
            <header className="flex items-center justify-between gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold">Topic {unitNumber}</h2>
                    <p className="text-lg">{description}</p>
                </div>

            </header>
        </article>
    );
};

const LearnPage = () => {
    const dispatch = useAppDispatch();
    const { topics, loading: topicsLoading, error: topicsError } = useAppSelector((state) => state.topic);
    const { lessons, loading: lessonsLoading, error: lessonsError } = useAppSelector((state) => state.lesson);

    useEffect(() => {
        dispatch(fetchTopics());
        dispatch(fetchLessons());
    }, [dispatch]);

    // Map topics to units, lessons to tiles
    const units: Unit[] = topics.map((topic, idx) => {
        // Lấy các lesson thuộc topic này
        const topicLessons = lessons.filter(lesson => lesson.topic?._id === topic._id);
        // Map mỗi lesson thành một tile (type 'book')
        const tiles: Tile[] = topicLessons.map(lesson => ({
            type: "book",
            description: lesson.title,
            lessonId: lesson._id,
        }));
        return {
            unitNumber: idx + 1,
            description: topic.description,
            backgroundColor: "bg-blue-500", // Có thể custom theo idx nếu muốn
            textColor: "text-blue-500",
            borderColor: "border-blue-500",
            tiles,
        };
    });

    if (topicsLoading || lessonsLoading) {
        return <div className="text-center p-10">Đang tải dữ liệu...</div>;
    }
    if (topicsError || lessonsError) {
        return <div className="text-red-500 text-center p-10">Lỗi: {topicsError || lessonsError}</div>;
    }

    return (
        <div className="flex justify-center items-start pt-14 sm:p-6 sm:pt-10 min-h-screen bg-white">
            <div className="flex max-w-2xl w-full flex-col items-center mx-auto gap-8">
                {units.map((unit) => (
                    <UnitSection unit={unit} key={unit.unitNumber} />
                ))}
                <div className="sticky bottom-28 left-0 right-0 flex items-end justify-between w-full">
                    <Link
                        to="/lesson?practice"
                        className="absolute left-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:left-0"
                    >
                        <span className="sr-only">Practice exercise</span>
                        <PracticeExerciseSvg className="h-8 w-8" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LearnPage;