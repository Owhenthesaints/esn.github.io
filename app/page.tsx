// `pages/index.tsx`
import type { NextPage } from 'next'
import './globals.css'
import WhiteContentBox from "@/components/esthetic-components/WhiteContentBox";

const Home: NextPage = () => (
    <main>
        <WhiteContentBox title="Presentation of ESN Fribourg">
            Welcome to the website of ESN Fribourg! We are a student organization dedicated to supporting and promoting the interests of international students in Fribourg. Our mission is to help international students integrate into the local community, provide them with valuable resources, and create opportunities for cultural exchange and social interaction.
        </WhiteContentBox>
    </main>
)

export default Home;