import Image from "next/image";
import {DEFAULT_LOGO_HEIGHT, DEFAULT_LOGO_WIDTH} from "@/constants/ESTHETIC-CONSTANTS";
import ESNLogoImg from "../../public/Img/ESNlogo.png"

export default function ESNLogo({className, width, height}: {className?: string, width?: number, height?: number}) {
    return <Image src={ESNLogoImg} alt="ESN Logo" width={width? width : DEFAULT_LOGO_WIDTH} height={height? height : DEFAULT_LOGO_HEIGHT} className={className}/>
}