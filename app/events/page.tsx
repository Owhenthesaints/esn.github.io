import EventPresentationBox from "@/components/functional-blocks/EventPresentationBox";
import Link from "next/link";
import { getEventFolders } from "@/app/services/eventService";
import {CloudFolder} from "@/app/providers/file-handling/file-interfaces/FileInterfaces";

export async function generateStaticParams() {
    const events =  await getEventFolders();
    return events.map((event) => ({
        id: event.id,
        name: event.name

    })
    )
}

export const revalidate = 3600;

export default async function Events({params}: { params: Promise<{id: string[], name: string[]}> }) {
    const {id, name} = await params;


    return (
        <div>
            <EventPresentationBox />
            <ul>
                {events && events.map(event => (
                    <li key={event.id}>
                        <Link href={`/events/${event.id}`}>
                            {event.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}