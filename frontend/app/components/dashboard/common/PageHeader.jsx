import { Link } from "react-router";

export default function PageHeader({ title, breadcrumbs = [] }) {
    return (
        <div className="pb-6">
            <div className="sm:flex sm:justify-between sm:items-center mb-6">
                
                {/* JUDUL HALAMAN */}
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">
                        {title}
                    </h1>
                </div>

                {/* NAVIGASI */}
                <div className="mb-4 sm:mb-0">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            
                            {breadcrumbs.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === breadcrumbs.length - 1;

                                return (
                                    <li key={index} className="inline-flex items-center">
                                        {!isFirst && (
                                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                            </svg>
                                        )}
                                        {item.link && !isLast ? (
                                            <Link 
                                                to={item.link} 
                                                className={`inline-flex items-center text-sm font-medium font-noto-sans ${isFirst ? 'text-gray-500' : 'text-gray-500 hover:text-primary-hover'}`}
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">
                                                {item.label}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    );
}