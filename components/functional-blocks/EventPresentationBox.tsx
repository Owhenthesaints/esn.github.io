import WhiteContentBox from "@/components/esthetic-components/WhiteContentBox";
import {CloudFolder} from "@/app/providers/file-handling/file-interfaces/FileInterfaces";
import Link from "next/link";


export default function EventPresentationBox({events}: { events: CloudFolder[] }) {
    return <WhiteContentBox title="Event Presentation">
        <ul>
            {events.map(event => (
                <li className="flex justify-center m-3" key={event.id}>
                    <Link href={`/events/${event.id}`}
                        className="w-full block border-2 border-black md:w-4/5 text-xl text-center px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200 font-medium">{event.name}</Link>
                </li>
            ))}
        </ul>
    </WhiteContentBox>
}