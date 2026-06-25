interface PageTitleProps {
    title: string;
    description: string;
}

const PageTitle = ({ title, description }: PageTitleProps) => {
    return (
        <div>
            <div className="flex items-center gap-5">
                <div className="w-2 h-17 border-r-8 border-secondary/70 rounded-xl"> </div>
                <div className="">
                    <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">{title}</h1>
                    <p className="text-sm text-muted font-medium sm:text-base">{description}</p>
                </div>
            </div>

        </div>
    )

}

export default PageTitle;