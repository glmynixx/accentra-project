
export default function CardHeader({
    title,
    description,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-4
                border-b
                border-[#DCE4EC]
                bg-gradient-to-r
                from-[#DCE6F0]
                to-white
                px-5
                py-4
                max-[600px]:items-start
            "
        >
            {/* TITLE + DESCRIPTION */}
            <div className="min-w-0">
                <h3
                    className="
                        text-[15px]
                        font-bold
                        tracking-tight
                        text-[#243A52]
                    "
                >
                    {title}
                </h3>

                <p
                    className="
                        mt-0.5
                        text-xs
                        text-[#7A8999]
                    "
                >
                    {description}
                </p>
            </div>
        </div>
    );
}
