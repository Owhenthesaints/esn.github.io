import './globals.css'
import Header from '@/components/building-blocks/Header'
import {Metadata} from "next";

export const metadata : Metadata= {
    title: 'ESN Fribourg',
    description: 'Website for ESN Fribourg',
}

function MyApp({children}: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                <Header/>
                {children}
            </body>
        </html>
    )
}

export default MyApp
