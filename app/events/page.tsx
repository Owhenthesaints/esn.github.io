import type { Metadata } from 'next';
import EventPresentationBox from "@/components/functional-blocks/EventPresentationBox";
import { getEventFolders } from "@/app/services/eventService";
import Link from "next/link";

export const metadata: Metadata = {
    "title": "Events",
    description: "All available events organized by ESN Fribourg",
    openGraph: {
        title: "Events - ESN Fribourg",
        description: "All available events organized by ESN Fribourg",
        type: "website"
    }
}

export const revalidate = 3600;

export default async function Events() {

    const events = await getEventFolders();

    return (
        <div>
            <EventPresentationBox events={events}/>
        </div>
    );
}