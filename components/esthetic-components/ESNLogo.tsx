import Image from "next/image";
import {DEFAULT_LOGO_HEIGHT, DEFAULT_LOGO_WIDTH} from "@/constants/styling_constants";
import ESNLogoImg from "../../public/Img/ESNlogo.png"
import Link from "next/link";

export default function ESNLogo({className, width, height, link}: {className?: string, width?: number, height?: number, link?: boolean}) {
    const IMAGE = <Image src={ESNLogoImg} alt="ESN Logo" width={width? width : DEFAULT_LOGO_WIDTH} height={height? height : DEFAULT_LOGO_HEIGHT} className={className}/>
    if (link) {
        return <Link href="/">
            {IMAGE}
        </Link>
    }
    return IMAGE;
}