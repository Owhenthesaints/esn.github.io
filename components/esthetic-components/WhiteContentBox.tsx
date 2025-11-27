

export default function WhiteContentBox({children, className, title}: {children?: React.ReactNode, className?: string, title?: string}) {
    return <div className={`bg-white p-4 rounded-lg shadow-md border-1 m-6 md:w-4/5 border-black mx-auto ${className}`}>
        {title && <h2 className="md:text-2xl font-bold mb-4 w-full justify-center inline-flex">{title}</h2>}
        {children}
    </div>
}