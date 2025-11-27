import { notFound } from 'next/navigation';
import {getEventFolderById, getEventFolders} from "@/app/services/eventService";
import WhiteContentBox from "@/components/esthetic-components/WhiteContentBox";


export async function generateStaticParams() {
    const events = await getEventFolders();
    return events.map(event => ({
        eventId: event.id,
    }));
}

export const revalidate = 3600; // Revalidate every hour

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const event = await getEventFolderById(eventId)

    if (!event) {
        notFound();
    }

    return (
        <WhiteContentBox title={event.name}>
            <p>Details about the event &#34;{event.name}&#34; will be displayed here.</p>
        </WhiteContentBox>
    );
}